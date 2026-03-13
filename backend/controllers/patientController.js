const Report = require("../models/Report")
const Patient = require("../models/Patient")
const cloudinary = require("../config/cloudinary")
const generateAccessCode = require("../utils/generateAccessCode")

exports.updateAccessCode = async (req, res) => {
    try {
        const newCode = generateAccessCode();
        const patient = await Patient.findByIdAndUpdate(
            req.user.id,
            { doctorAccessCode: newCode },
            { new: true }
        );
        res.json({ doctorAccessCode: patient.doctorAccessCode });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
}

exports.uploadReport = async (req, res) => {

    try {

        const { reportType } = req.body
        const file = req.file

        const upload = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            async (error, result) => {

                if (error) return res.status(500).json(error)

                try {
                    const report = await Report.create({
                        patientId: req.user.id,
                        uploadedBy: "patient",
                        fileUrl: result.secure_url,
                        reportType: reportType || "General Report"
                    })

                    await Patient.findByIdAndUpdate(req.user.id, {
                        $push: { reports: report._id }
                    })

                    res.json(report)
                } catch (dbError) {
                    res.status(500).json({ error: "Failed to save report to database" })
                }
            })

        upload.end(file.buffer)

    } catch (err) {

        res.status(500).json(err)

    }

}


exports.createTestReport = async (req, res) => {
    try {

        const report = await Report.create({
            patientId: req.body.patientId,
            uploadedBy: "patient",
            fileUrl: "https://sample-report.com/report.pdf",
            reportType: "Blood Test"
        })

        res.json(report)

    } catch (err) {
        res.status(500).json(err)
    }

}

exports.getPatientDashboard = async (req, res) => {
    try {

        const patient = await Patient.findById(req.user.id)
            .populate("reports")

        res.json({
            name: patient.name,
            email: patient.email,
            medicalId: patient.medicalId,
            doctorAccessCode: patient.doctorAccessCode,
            reports: patient.reports
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

exports.deleteReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        if (report.patientId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this report" });
        }

        if (report.uploadedBy !== "patient") {
            return res.status(403).json({ error: "You can only delete reports that you have uploaded" });
        }

        // Delete from cloudinary
        const fileUrl = report.fileUrl;
        const urlParts = fileUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExt.split('.')[0];

        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
            console.error("Cloudinary delete error:", cloudErr);
            // continue deleting from db even if cloudinary fails
        }

        // Remove from DB
        await Report.findByIdAndDelete(reportId);

        // Remove from Patient's reports array
        await Patient.findByIdAndUpdate(req.user.id, {
            $pull: { reports: reportId }
        });

        res.json({ message: "Report deleted successfully", id: reportId });

    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
}