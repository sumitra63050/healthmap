const router = require("express").Router()
const { register, login, updateProfilePic } = require("../controllers/authController")
const Hospital = require("../models/Hospital")
const auth = require("../middleware/authMiddleware")
const upload = require("../middleware/upload")

router.post("/register", register)
router.post("/login", login)

// Public route to get hospitals (for doctor registration dropdown)
router.get("/verified-hospitals", async (req, res) => {
    try {
        const hospitals = await Hospital.find().select("_id name")
        res.json(hospitals)
    } catch (err) {
        res.status(500).json({ error: "Server Error" })
    }
})

router.post("/update-profile-pic", auth, upload.single("profilePic"), updateProfilePic)

module.exports = router