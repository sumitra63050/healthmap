const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) return res.status(400).json({ error: "Admin not found" });

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(400).json({ error: "Wrong password" });

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
        res.json({ token, role: 'admin', user: { email: admin.email, id: admin._id } });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingHospitals = await Hospital.find({ isVerified: false }).select("-password");
        
        res.json({ hospitals: pendingHospitals });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { type, id } = req.body; // type is 'hospital'
        
        if (type === 'hospital') {
            await Hospital.findByIdAndUpdate(id, { isVerified: true });
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }
        res.json({ message: `${type} verified successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const { type, id } = req.body; 
        
        if (type === 'hospital') {
            await Hospital.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }
        res.json({ message: `${type} application rejected` });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.setupAdmin = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        
        const hashed = await bcrypt.hash("admin123", 10);
        await Admin.create({ email: "admin@healthmap.com", password: hashed });
        res.json({ message: "Default admin created: admin@healthmap.com / admin123" });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};
