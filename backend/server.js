const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const patientRoutes = require("./routes/patientRoutes")
const doctorRoutes = require("./routes/doctorRoutes")
const hospitalRoutes = require("./routes/hospitalRoutes")
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/patient", patientRoutes)
app.use("/api/doctor", doctorRoutes)
app.use("/api/hospital", hospitalRoutes)

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err.message))

app.get("/", (req, res) => {
    res.send("HealthMap API running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port", PORT))