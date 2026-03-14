const router = require("express").Router()

const upload = require("../middleware/upload")
const auth = require("../middleware/authMiddleware")

const {
    uploadHospitalReport,
    getPendingDoctors,
    verifyDoctor,
    rejectDoctor
} = require("../controllers/hospitalController")

// Hospital auth middleware
const hospitalAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ error: "Hospital access denied" });
        }
        next();
    });
};

router.post("/upload", upload.single("file"), uploadHospitalReport)
router.get("/pending-doctors", hospitalAuth, getPendingDoctors)
router.put("/verify-doctor", hospitalAuth, verifyDoctor)
router.delete("/reject-doctor", hospitalAuth, rejectDoctor)

module.exports = router