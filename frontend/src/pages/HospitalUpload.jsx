import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Activity, UploadCloud, File, X, CheckCircle, Hospital, LogOut } from "lucide-react"
import API from "../services/api"

export default function HospitalUpload() {
    const [medicalId, setMedicalId] = useState("")
    const [file, setFile] = useState(null)
    const [reportType, setReportType] = useState("Hospital Report")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef(null)

    const hospitalName = localStorage.getItem("userName") || "Hospital"

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
            await API.post("/hospital/upload", formData)
            setSuccess(true)
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
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
                        <UploadCloud className="h-12 w-12 text-indigo-100 mx-auto mb-4" />
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
        </div>
    )
}