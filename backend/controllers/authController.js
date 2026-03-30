const Patient = require("../models/Patient")
const Doctor = require("../models/Doctor")
const Hospital = require("../models/Hospital")
const Notification = require("../models/Notification")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const generateMedicalId = require("../utils/generateMedicalid")
const generateAccessCode = require("../utils/generateAccessCode")
const cloudinary = require("../config/cloudinary")

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, licenseNumber, registrationNumber, dob, gender, bloodGroup, aadhaarNumber, hospitalId, phoneNumber, specialty } = req.body

        if (!role || !['patient', 'doctor', 'hospital'].includes(role)) {
            return res.status(400).json({ error: "Invalid role specified" })
        }

        const hashed = await bcrypt.hash(password, 10)

        if (role === 'patient') {
            if (!aadhaarNumber) {
                return res.status(400).json({ error: "Aadhaar number is required" })
            }

            // Check if Aadhaar already exists
            const existingAadhaar = await Patient.findOne({ aadhaarNumber });
            if (existingAadhaar) return res.status(400).json({ error: "Patient with this Aadhaar number already exists" });

            const patient = await Patient.create({
                name,
                email,
                password: hashed,
                medicalId: generateMedicalId(),
                doctorAccessCode: generateAccessCode(),
                dob,
                gender,
                bloodGroup,
                aadhaarNumber,
                phoneNumber
            })

            const token = jwt.sign({ id: patient._id, role: 'patient' }, process.env.JWT_SECRET)
            return res.json({
                message: "Patient registered successfully",
                token,
                role: 'patient',
                user: { id: patient._id, name: patient.name, email: patient.email }
            })
        }

        if (role === 'doctor') {
            // Check if email exists
            const existing = await Doctor.findOne({ email });
            if (existing) return res.status(400).json({ error: "Email already registered" });

            if (!licenseNumber) return res.status(400).json({ error: "License number is required" });
            if (!hospitalId) return res.status(400).json({ error: "Hospital selection is required" });

            const doctor = await Doctor.create({
                name,
                email,
                password: hashed,
                doctorId: generateMedicalId(),
                licenseNumber,
                hospitalId,
                phoneNumber,
                specialty,
                gender
            })

            await Notification.create({
                hospitalId: hospitalId,
                doctorId: doctor._id,
                message: `New doctor ${name} (${specialty}, Lic: ${licenseNumber}) has registered and is pending your approval.`,
                type: 'DOCTOR_APPROVAL'
            })

            return res.json({ message: "Doctor registered successfully. Please wait for hospital verification.", user: { id: doctor._id, role: 'doctor' } })
        }

        if (role === 'hospital') {
            // Check if email exists
            const existing = await Hospital.findOne({ email });
            if (existing) return res.status(400).json({ error: "Email already registered" });

            if (!registrationNumber) return res.status(400).json({ error: "Registration number is required" });

            const hospital = await Hospital.create({
                name,
                email,
                password: hashed,
                hospitalId: generateMedicalId(),
                registrationNumber
            })

            const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET)
            return res.json({
                message: "Hospital registered successfully",
                token,
                role: 'hospital',
                user: { id: hospital._id, name: hospital.name, email: hospital.email }
            })
        }

    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check each collection
        let user = await Patient.findOne({ email })
        let role = 'patient'

        if (!user) {
            user = await Doctor.findOne({ email })
            role = 'doctor'
        }

        if (!user) {
            user = await Hospital.findOne({ email })
            role = 'hospital'
        }


        if (!user) return res.status(400).json({ error: "User not found" })

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) return res.status(400).json({ error: "Wrong password" })

        // Check verification for doctors and hospitals
        if (role === 'doctor' && !user.isVerified) {
            return res.status(403).json({ error: "Your account is pending verification by a hospital." })
        }

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET)

        res.json({ token, role, user })
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" })
    }
}

exports.updateProfilePic = async (req, res) => {
    try {
        const file = req.file
        if (!file) {
            return res.status(400).json({ error: "No image file provided" })
        }

        const role = req.user.role
        const userId = req.user.id

        const upload = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "profile_pics" },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed" })

                try {
                    let updatedUser;
                    if (role === 'patient') {
                        updatedUser = await Patient.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { new: true })
                    } else if (role === 'doctor') {
                        updatedUser = await Doctor.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { new: true })
                    } else if (role === 'hospital') {
                        updatedUser = await Hospital.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { new: true })
                    }

                    if (!updatedUser) {
                        return res.status(404).json({ error: "User not found" })
                    }

                    res.json({ message: "Profile picture updated successfully", profilePic: result.secure_url })
                } catch (dbError) {
                    res.status(500).json({ error: "Failed to update user profile picture" })
                }
            }
        )

        upload.end(file.buffer)
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" })
    }
}