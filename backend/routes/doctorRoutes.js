const router = require("express").Router()

const {
    verifyReport,
    getPatientByAccessCode,
    getDoctorDashboard
} = require("../controllers/doctorController")

router.post("/access", getPatientByAccessCode)

router.post("/verify", verifyReport)
router.post("/dashboard", getDoctorDashboard)
module.exports = router