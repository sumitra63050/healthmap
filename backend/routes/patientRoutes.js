const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const { uploadReport } = require("../controllers/patientController")
const { createTestReport } = require("../controllers/patientController")
const {
    getPatientDashboard, updateAccessCode, deleteReport,
    getNotifications, markNotificationAsRead, markAllNotificationsAsRead,
    updateProfile
} = require("../controllers/patientController")

router.post("/upload", auth, upload.single("file"), uploadReport)
router.post("/create-test", createTestReport)
router.get("/dashboard", auth, getPatientDashboard)
router.put("/profile", auth, updateProfile)
router.put("/access-code", auth, updateAccessCode)
router.delete("/report/:id", auth, deleteReport)

// Notification routes
router.get("/notifications", auth, getNotifications)
router.put("/notifications/:id/read", auth, markNotificationAsRead)
router.put("/notifications/read-all", auth, markAllNotificationsAsRead)
module.exports = router