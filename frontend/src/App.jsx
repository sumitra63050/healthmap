import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PatientDashboard from "./pages/PatientDashboard"
import DoctorDashboard from "./pages/DoctorDashboard"
import ViewPatientReports from "./pages/ViewPatientReports"
import HospitalUpload from "./pages/HospitalUpload"
import Profile from "./pages/Profile"
import UploadReport from "./pages/UploadReport"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Notifications from "./pages/Notifications"
import Reports from "./pages/Reports"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
           {/* Patient only routes */}
           <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
               <Route path="/patient" element={<PatientDashboard />} />
           </Route>

           {/* Doctor only routes */}
           <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
               <Route path="/doctor" element={<DoctorDashboard />} />
               <Route path="/doctor/view-reports" element={<ViewPatientReports />} />
           </Route>

           {/* Hospital only routes */}
           <Route element={<ProtectedRoute allowedRoles={['hospital']} />}>
               <Route path="/hospital" element={<HospitalUpload />} />
           </Route>

           {/* Shared authenticated routes */}
           <Route element={<ProtectedRoute />}>
               <Route path="/profile" element={<Profile />} />
           </Route>

           {/* Patient & Hospital shared routes */}
           <Route element={<ProtectedRoute allowedRoles={['patient', 'hospital']} />}>
               <Route path="/notifications" element={<Notifications />} />
               <Route path="/reports" element={<Reports />} />
               <Route path="/upload-report" element={<UploadReport />} />
           </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App