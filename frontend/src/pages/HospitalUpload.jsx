import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { UploadCloud, File, X, CheckCircle, Hospital, LogOut, BriefcaseMedical, XCircle, FileText, Trash2, Eye, User, ChevronDown, ChevronUp, Shield } from "lucide-react"
import logo from "../assets/logo.png"
import API from "../services/api"

export default function HospitalUpload() {
    const [medicalId, setMedicalId] = useState("")
    const [file, setFile] = useState(null)
    const [reportType, setReportType] = useState("Hospital Report")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [pendingDoctors, setPendingDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [expandedPatient, setExpandedPatient] = useState(null)
    const fileInputRef = useRef(null)

    const hospitalName = localStorage.getItem("userName") || "Hospital"
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchPendingDoctors()
        fetchHospitalReports()
    }, [])

    const fetchPendingDoctors = async () => {
        try {
            const res = await API.get("/hospital/pending-doctors", {
                headers: { Authorization: token }
            })
            setPendingDoctors(res.data.doctors || [])
        } catch (err) {
            console.error("Failed to fetch pending doctors")
        }
    }

    const fetchHospitalReports = async () => {
        try {
            const res = await API.get("/hospital/my-reports", {
                headers: { Authorization: token }
            })
            setPatients(res.data.patients || [])
        } catch (err) {
            console.error("Failed to fetch hospital reports")
        }
    }

    const verifyDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to approve this doctor?")) return;
        try {
            await API.put("/hospital/verify-doctor", { id }, {
                headers: { Authorization: token }
            })
            fetchPendingDoctors()
        } catch (err) {
            alert(err.response?.data?.error || "Failed to verify doctor")
        }
    }

    const rejectDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to reject this doctor? This cannot be undone.")) return;
        try {
            await API.delete("/hospital/reject-doctor", {
                data: { id },
                headers: { Authorization: token }
            })
            fetchPendingDoctors()
        } catch (err) {
            alert(err.response?.data?.error || "Failed to reject doctor")
        }
    }

    const deleteReport = async (reportId) => {
        if (!window.confirm("Are you sure you want to delete this report? This cannot be undone.")) return;
        try {
            await API.delete(`/hospital/report/${reportId}`, {
                headers: { Authorization: token }
            })
            fetchHospitalReports()
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete report")
        }
    }

    const logout = () => {
        localStorage.clear()
        window.location = "/login"
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError("")
        }
    }

    const clearFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const uploadReport = async (e) => {
        e.preventDefault()
        if (!medicalId || !file) {
            setError("Please fill in both Medical ID and select a file.")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("medicalId", medicalId)
        formData.append("file", file)
        formData.append("hospitalName", hospitalName)
        formData.append("reportType", reportType)

        try {
            await API.post("/hospital/upload", formData, {
                headers: { Authorization: token }
            })
            setSuccess(true)
            fetchHospitalReports()
            setTimeout(() => {
                setSuccess(false)
                setMedicalId("")
                clearFile()
            }, 3000)
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to upload report")
        } finally {
            setLoading(false)
        }
    }

    const togglePatient = (pid) => {
        setExpandedPatient(expandedPatient === pid ? null : pid)
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <img src={logo} alt="HealthMap Logo" className="h-8 w-8 object-contain" />
                        <span className="text-lg sm:text-xl font-bold text-indigo-900">HealthMap Portal</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                            <Hospital className="h-3 w-3 sm:h-4 sm:w-4" />
                            {hospitalName}
                        </div>
                        <button onClick={logout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Logout">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-indigo-600 px-8 py-10 text-center">
                        <img src={logo} alt="Upload Logo" className="h-16 w-16 object-contain mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {hospitalName}</h1>
                        <p className="text-indigo-100">Securely upload medical reports to patient profiles using their Medical ID.</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        {success ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <CheckCircle className="h-16 w-16 text-emerald-500" />
                                <h3 className="text-xl font-bold text-slate-800">Upload Successful</h3>
                                <p className="text-slate-500 text-center">The report has been securely added to the patient's records.</p>
                            </div>
                        ) : (
                            <form onSubmit={uploadReport} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Patient's Medical ID</label>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="e.g. HM-12345"
                                        value={medicalId}
                                        onChange={e => setMedicalId(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Report Type</label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="Hospital Report">Hospital Report</option>
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="X-Ray">X-Ray</option>
                                        <option value="MRI">MRI</option>
                                        <option value="CT Scan">CT Scan</option>
                                        <option value="Prescription">Prescription</option>
                                        <option value="Discharge Summary">Discharge Summary</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Medical Report File</label>

                                    {!file ? (
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <div className="relative z-0 flex flex-col items-center justify-center pointer-events-none">
                                                <UploadCloud className="h-10 w-10 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                                                <p className="text-slate-600 font-medium mb-1 group-hover:text-indigo-600 transition-colors">Click to select a file</p>
                                                <p className="text-slate-400 text-sm">PDF, JPEG, or PNG formats</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                                                    <File className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFile(null)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !file || !medicalId}
                                    className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Uploading..." : "Upload Securely"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            {/* Uploaded Patient Reports Section */}
            <section className="max-w-4xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-100">
                        <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-600" />
                            Uploaded Patient Reports ({patients.length} patients)
                        </h2>
                        <p className="text-sm text-emerald-700 mt-1">View and manage reports you've uploaded for patients. Delete option is available until a doctor verifies the report.</p>
                    </div>

                    {patients.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No reports uploaded yet. Upload a report above to see patient details here.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {patients.map(patient => (
                                <div key={patient.patientId} className="transition-colors">
                                    {/* Patient Header Card */}
                                    <div
                                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => togglePatient(patient.patientId)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800">{patient.name}</h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <span className="text-xs font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                                        {patient.medicalId}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                                                        {patient.gender || "N/A"}
                                                    </span>
                                                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                        {patient.reports.length} report{patient.reports.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50">
                                            <Eye className="h-4 w-4" />
                                            {expandedPatient === patient.patientId ? "Hide" : "View"} Reports
                                            {expandedPatient === patient.patientId ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    {/* Expanded Reports */}
                                    {expandedPatient === patient.patientId && (
                                        <div className="bg-slate-50 px-5 pb-5 border-t border-slate-100">
                                            <div className="space-y-3 pt-4">
                                                {patient.reports.map(report => (
                                                    <div key={report._id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-sm font-semibold text-slate-800 flex flex-wrap items-center gap-2">
                                                                    {report.reportType || "General Report"}
                                                                    {report.verified ? (
                                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                                            <Shield className="h-3 w-3" /> Verified by Dr. {report.verifiedByDoctor?.replace(/^Dr\.\s*/i, '')}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                                                            Pending Verification
                                                                        </span>
                                                                    )}
                                                                </h4>
                                                                <p className="text-xs text-slate-500 mt-0.5">
                                                                    Uploaded on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                                                            <a
                                                                href={report.fileUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:text-indigo-700 hover:border-indigo-300 rounded-lg text-sm font-medium transition-all text-center flex items-center justify-center gap-1"
                                                            >
                                                                <Eye className="h-4 w-4" /> View
                                                            </a>
                                                            {!report.verified && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); deleteReport(report._id); }}
                                                                    className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-all text-center flex items-center justify-center gap-1"
                                                                >
                                                                    <Trash2 className="h-4 w-4" /> Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Pending Doctors Section */}
            <section className="max-w-4xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="bg-indigo-50 px-6 py-5 border-b border-indigo-100">
                        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                            <BriefcaseMedical className="h-5 w-5 text-indigo-600" />
                            Pending Doctor Approvals ({pendingDoctors.length})
                        </h2>
                        <p className="text-sm text-indigo-700 mt-1">Review and approve doctor registration requests.</p>
                    </div>

                    {pendingDoctors.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No pending doctor verifications.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            {pendingDoctors.map(doctor => (
                                <div key={doctor._id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
                                    <p className="text-slate-500 text-sm mb-3">{doctor.email}</p>
                                    <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                                        <p className="text-xs text-indigo-800 font-semibold mb-1">Medical License Number</p>
                                        <p className="font-mono text-indigo-900 text-sm break-all">{doctor.licenseNumber}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => verifyDoctor(doctor._id)} className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-colors">
                                            <CheckCircle className="h-4 w-4" /> Approve
                                        </button>
                                        <button onClick={() => rejectDoctor(doctor._id)} className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-colors">
                                            <XCircle className="h-4 w-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}