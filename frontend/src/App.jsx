import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import HospitalUpload from "./pages/HospitalUpload"
import UploadReport from "./pages/UploadReport"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/upload-report" element={<UploadReport />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        {/* Hospital Routes */}
        <Route element={<ProtectedRoute allowedRoles={['hospital']} />}>
            <Route path="/hospital" element={<HospitalUpload />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>

    </BrowserRouter>

  )

}

export default App