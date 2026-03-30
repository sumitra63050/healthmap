const Notification = require("../models/Notification")
const Report = require("../models/Report")
const Patient = require("../models/Patient")
const Doctor = require("../models/Doctor")


exports.verifyReport = async (req, res) => {

    const { reportId, doctorName } = req.body

    const report = await Report.findByIdAndUpdate(reportId, {
        verified: true,
        verifiedByDoctor: doctorName,
        verificationTimestamp: new Date()
    }, { new: true })

    if (report) {
        await Notification.create({
            patientId: report.patientId,
            message: `Your report (${report.reportType}) has been verified by Dr. ${doctorName}.`,
            type: 'VERIFICATION',
            reportId: report._id
        })

        if (report.uploadedByHospitalId) {
            await Notification.create({
                hospitalId: report.uploadedByHospitalId,
                message: `Report (${report.reportType}) uploaded by you was verified by Dr. ${doctorName}.`,
                type: 'VERIFICATION',
                reportId: report._id
            })
        }
    }

    res.json(report)

}




exports.getPatientByAccessCode = async (req, res) => {
    try {

        const { code } = req.body

        const patient = await Patient.findOne({
            doctorAccessCode: code
        }).populate("reports")

        if (!patient) {
            return res.status(404).json({
                message: "Invalid access code"
            })
        }

        res.json(patient)

    } catch (error) {
        res.status(500).json(error)
    }
}


exports.getDoctorDashboard = async (req, res) => {
    try {
        const accessCode = req.body ? req.body.accessCode : undefined;
        let doctor;
        try {
            doctor = await Doctor.findById(req.user.id).populate("hospitalId", "name");
        } catch (popErr) {
            // If populate fails (e.g. invalid hospitalId reference), try without populate
            doctor = await Doctor.findById(req.user.id);
        }

        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const profileData = {
            name: doctor.name,
            doctorId: doctor.doctorId,
            email: doctor.email,
            licenseNumber: doctor.licenseNumber,
            isVerified: doctor.isVerified,
            specialty: doctor.specialty || "Not Specified",
            phoneNumber: doctor.phoneNumber || "Not Specified",
            gender: doctor.gender || "Not Specified",
            hospitalName: doctor.hospitalId?.name || "Not Assigned"
        };

        if (!accessCode) {
            return res.json({ doctor: profileData });
        }

        const patient = await Patient.findOne({
            doctorAccessCode: accessCode
        }).populate("reports");

        if (!patient) {
            return res.status(404).json({
                doctor: profileData,
                message: "Invalid Access Code"
            });
        }

        res.json({
            doctor: profileData,
            patientName: patient.name,
            medicalId: patient.medicalId,
            reports: patient.reports
        });

    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, gender, specialty } = req.body;
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.user.id,
            { name, email, phoneNumber, gender, specialty },
            { new: true, runValidators: true }
        ).select("-password").populate("hospitalId", "name");

        if (!updatedDoctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const profileData = {
            name: updatedDoctor.name,
            doctorId: updatedDoctor.doctorId,
            licenseNumber: updatedDoctor.licenseNumber,
            email: updatedDoctor.email,
            specialty: updatedDoctor.specialty || "Not Specified",
            phoneNumber: updatedDoctor.phoneNumber || "Not Specified",
            gender: updatedDoctor.gender || "Not Specified",
            hospitalName: updatedDoctor.hospitalId?.name || "Not Assigned"
        };

        res.json({ doctor: profileData });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};