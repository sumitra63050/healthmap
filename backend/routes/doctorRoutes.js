const router = require("express").Router()

const auth = require("../middleware/authMiddleware")

const {
    verifyReport,
    getPatientByAccessCode,
    getDoctorDashboard,
    updateProfile
} = require("../controllers/doctorController")

// Doctor auth middleware
const doctorAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: "Doctor access denied" });
        }
        next();
    });
};

router.post("/access", doctorAuth, getPatientByAccessCode)
router.post("/verify", doctorAuth, verifyReport)
router.get("/dashboard", doctorAuth, getDoctorDashboard)
router.post("/dashboard", doctorAuth, getDoctorDashboard)
router.put("/profile", doctorAuth, updateProfile)
module.exports = router