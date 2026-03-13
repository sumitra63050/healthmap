const Report = require("../models/Report")
const Patient = require("../models/Patient")

exports.verifyReport = async (req, res) => {

    const { reportId, doctorName } = req.body

    const report = await Report.findByIdAndUpdate(reportId, {
        verified: true,
        verifiedByDoctor: doctorName,
        verificationTimestamp: new Date()
    }, { new: true })

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

        const { accessCode } = req.body

        const patient = await Patient.findOne({
            doctorAccessCode: accessCode
        }).populate("reports")

        if (!patient) {
            return res.status(404).json({
                message: "Invalid Access Code"
            })
        }

        res.json({
            patientName: patient.name,
            medicalId: patient.medicalId,
            reports: patient.reports
        })

    } catch (err) {

        res.status(500).json(err)

    }

}