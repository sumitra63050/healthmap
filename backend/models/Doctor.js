const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    doctorId: { type: String, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    phoneNumber: { type: String },
    specialty: { type: String },
    gender: { type: String },
    profilePic: { type: String },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("Doctor", doctorSchema)
