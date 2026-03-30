const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['VERIFICATION', 'UPLOAD', 'DOCTOR_APPROVAL'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report"
    }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)
