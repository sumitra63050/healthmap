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