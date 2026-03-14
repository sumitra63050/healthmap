const Patient = require("../models/Patient")
const Report = require("../models/Report")
const cloudinary = require("../config/cloudinary")

exports.uploadHospitalReport = async (req, res) => {

    try {

        const { medicalId, hospitalName, reportType } = req.body

        const patient = await Patient.findOne({ medicalId })

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            })
        }

        const file = req.file

        const upload = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },

            async (error, result) => {

                if (error) return res.status(500).json(error)

                try {
                    const report = await Report.create({
                        patientId: patient._id,
                        uploadedBy: hospitalName || "hospital",
                        uploadedByHospitalId: req.user ? req.user.id : null,
                        fileUrl: result.secure_url,
                        reportType: reportType || "Hospital Report"
                    })

                    await Patient.findByIdAndUpdate(patient._id, {
                        $push: { reports: report._id }
                    })

                    res.json(report)
                } catch (dbError) {
                    res.status(500).json({ error: "Failed to save report to database" })
                }

            }
        )

        upload.end(file.buffer)

    } catch (err) {
        res.status(500).json(err)
    }

}

const Doctor = require("../models/Doctor")

exports.getPendingDoctors = async (req, res) => {
    try {
        const pendingDoctors = await Doctor.find({ isVerified: false, hospitalId: req.user.id }).select("-password");
        res.json({ doctors: pendingDoctors });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.verifyDoctor = async (req, res) => {
    try {
        const { id } = req.body;
        const doctor = await Doctor.findById(id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        await Doctor.findByIdAndUpdate(id, { isVerified: true });
        res.json({ message: "Doctor verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.rejectDoctor = async (req, res) => {
    try {
        const { id } = req.body;
        const doctor = await Doctor.findById(id);
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        await Doctor.findByIdAndDelete(id);
        res.json({ message: "Doctor application rejected" });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

// Get all reports uploaded by this hospital, grouped by patient
exports.getHospitalReports = async (req, res) => {
    try {
        const hospitalId = req.user.id;

        const reports = await Report.find({ uploadedByHospitalId: hospitalId })
            .populate("patientId", "name medicalId gender")
            .sort({ createdAt: -1 });

        // Group reports by patient
        const patientMap = {};

        reports.forEach(report => {
            if (!report.patientId) return;

            const pid = report.patientId._id.toString();

            if (!patientMap[pid]) {
                patientMap[pid] = {
                    patientId: pid,
                    name: report.patientId.name,
                    medicalId: report.patientId.medicalId,
                    gender: report.patientId.gender,
                    reports: []
                };
            }

            patientMap[pid].reports.push({
                _id: report._id,
                reportType: report.reportType,
                fileUrl: report.fileUrl,
                verified: report.verified,
                verifiedByDoctor: report.verifiedByDoctor,
                createdAt: report.createdAt
            });
        });

        const patients = Object.values(patientMap);

        res.json({ patients });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

// Delete a report uploaded by this hospital (only if not verified by doctor)
exports.deleteHospitalReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const hospitalId = req.user.id;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Check that this hospital uploaded the report
        if (!report.uploadedByHospitalId || report.uploadedByHospitalId.toString() !== hospitalId) {
            return res.status(403).json({ error: "Not authorized to delete this report" });
        }

        // Check that report is not verified by doctor
        if (report.verified) {
            return res.status(403).json({ error: "Cannot delete a report that has been verified by a doctor" });
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
        }

        // Remove from DB
        await Report.findByIdAndDelete(reportId);

        // Remove from Patient's reports array
        await Patient.findByIdAndUpdate(report.patientId, {
            $pull: { reports: reportId }
        });

        res.json({ message: "Report deleted successfully", id: reportId });

    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};