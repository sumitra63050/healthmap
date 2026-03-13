const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const { adminLogin, getPendingUsers, verifyUser, rejectUser, setupAdmin } = require("../controllers/adminController")

// Admin auth middleware to ensure user is admin
const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Admin access denied" });
        }
        next();
    });
};

router.post("/login", adminLogin)
router.post("/setup", setupAdmin) // Used once to create the first admin
router.get("/pending", adminAuth, getPendingUsers)
router.put("/verify", adminAuth, verifyUser)
router.delete("/reject", adminAuth, rejectUser)

module.exports = router
