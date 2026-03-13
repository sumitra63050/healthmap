const router = require("express").Router()

const upload = require("../middleware/upload")

const {
    uploadHospitalReport
} = require("../controllers/hospitalController")

router.post("/upload", upload.single("file"), uploadHospitalReport)

module.exports = router