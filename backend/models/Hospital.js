const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospitalId: { type: String, unique: true },
    registrationNumber: { type: String, required: true, unique: true },
    profilePic: String
}, { timestamps: true })

module.exports = mongoose.model("Hospital", hospitalSchema)
