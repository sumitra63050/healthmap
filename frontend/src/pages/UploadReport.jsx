import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UploadCloud, File, X, CheckCircle, User, ArrowLeft } from "lucide-react"
import logo from "../assets/logo.png"
import API from "../services/api"

export default function UploadReport() {
    const [file, setFile] = useState(null)
    const [reportType, setReportType] = useState("General Report")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

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
        if (!file) {
            setError("Please select a file to upload.")
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("reportType", reportType)

        try {
            await API.post("/patient/upload", formData, {
                headers: {
                    "Authorization": token
                }
            })
            setSuccess(true)
            setTimeout(() => {
                navigate("/patient")
            }, 2000)
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to upload report")
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token")
                navigate("/login")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <img src={logo} alt="HealthMap Logo" className="h-8 w-8 object-contain" />
                        <span className="text-lg sm:text-xl font-bold text-teal-900">HealthMap Portal</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        Patient Services
                    </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-12">
                <Link to="/patient" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-6 font-medium text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-teal-600 px-8 py-10 text-center">
                        <img src={logo} alt="Upload Logo" className="h-16 w-16 object-contain mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Upload Personal Report</h1>
                        <p className="text-teal-100">Add past medical records to your profile securely.</p>
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
                                <p className="text-slate-500 text-center">Redirecting back to your dashboard...</p>
                            </div>
                        ) : (
                            <form onSubmit={uploadReport} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Select Report File</label>

                                    {!file ? (
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors cursor-pointer border border-slate-200 rounded-xl"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-xl">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-teal-100 rounded-lg shrink-0">
                                                    <File className="h-6 w-6 text-teal-600" />
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

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 block">Report Type</label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    >
                                        <option value="General Report">General Report</option>
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="X-Ray">X-Ray</option>
                                        <option value="MRI">MRI</option>
                                        <option value="CT Scan">CT Scan</option>
                                        <option value="Prescription">Prescription</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Uploading..." : "Upload to Profile"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}