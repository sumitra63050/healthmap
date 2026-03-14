const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    uploadedBy: String,
    uploadedByHospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    fileUrl: String,
    reportType: String,
    verified: {
        type: Boolean,
        default: false
    },
    verifiedByDoctor: String,
    verificationTimestamp: Date
}, { timestamps: true })

module.exports = mongoose.model("Report", reportSchema)