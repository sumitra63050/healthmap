const express = require("express")
const path = require("path")
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

// Diagnostic Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "OK", env: process.env.NODE_ENV }))

app.use("/api/auth", authRoutes)
app.use("/api/patient", patientRoutes)
app.use("/api/doctor", doctorRoutes)
app.use("/api/hospital", hospitalRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Diagnostic: Server starting on port ${PORT}`)
})

console.log("Diagnostic: Attempting MongoDB Connection...")
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log("SUCCESS: MongoDB Connected"))
    .catch(err => {
        console.error("ERROR: MongoDB Connection Failed:", err.message)
        console.log("TIP: Check your Atlas IP Whitelist (Allow 0.0.0.0/0)")
    })

// Serve static assets from frontend/dist in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("HealthMap API running in development mode")
    })
}

const dummy_port_marker = true