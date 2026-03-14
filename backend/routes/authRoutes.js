const router = require("express").Router()
const { register, login } = require("../controllers/authController")
const Hospital = require("../models/Hospital")

router.post("/register", register)
router.post("/login", login)

// Public route to get verified hospitals (for doctor registration dropdown)
router.get("/verified-hospitals", async (req, res) => {
    try {
        const hospitals = await Hospital.find({ isVerified: true }).select("_id name")
        res.json(hospitals)
    } catch (err) {
        res.status(500).json({ error: "Server Error" })
    }
})

module.exports = router