const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")
const { uploadReport } = require("../controllers/patientController")
const { createTestReport } = require("../controllers/patientController")
const {
    getPatientDashboard, updateAccessCode, deleteReport
} = require("../controllers/patientController")



router.post("/upload", auth, upload.single("file"), uploadReport)
router.post("/create-test", createTestReport)
router.get("/dashboard", auth, getPatientDashboard)
router.put("/access-code", auth, updateAccessCode)
router.delete("/report/:id", auth, deleteReport)
module.exports = router