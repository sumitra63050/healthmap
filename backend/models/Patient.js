const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    medicalId: { type: String, unique: true },
    doctorAccessCode: String,
    dob: Date,
    gender: String,
    bloodGroup: String,
    aadhaarNumber: { type: String, unique: true },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report"
    }]
}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)