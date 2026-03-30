const router = require("express").Router()

const upload = require("../middleware/upload")
const auth = require("../middleware/authMiddleware")

const {
    uploadHospitalReport,
    getHospitalReports,
    deleteHospitalReport,
    getHospitalDashboard,
    updateProfile,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
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

router.post("/upload", hospitalAuth, upload.single("file"), uploadHospitalReport)
router.get("/dashboard", hospitalAuth, getHospitalDashboard)
router.put("/profile", hospitalAuth, updateProfile)
router.get("/notifications", hospitalAuth, getNotifications)
router.put("/notifications/read-all", hospitalAuth, markAllNotificationsAsRead)
router.put("/notifications/:id/read", hospitalAuth, markNotificationAsRead)
router.get("/my-reports", hospitalAuth, getHospitalReports)
router.delete("/report/:id", hospitalAuth, deleteHospitalReport)
router.get("/pending-doctors", hospitalAuth, getPendingDoctors)
router.put("/verify-doctor", hospitalAuth, verifyDoctor)
router.put("/reject-doctor", hospitalAuth, rejectDoctor)

module.exports = router