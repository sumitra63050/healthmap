import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
    UploadCloud, 
    File, 
    X, 
    CheckCircle, 
    LayoutDashboard, 
    FileText, 
    ArrowLeft,
    ShieldCheck,
    AlertCircle
} from "lucide-react"
import API from "../services/api"

export default function UploadReport() {
    const [file, setFile] = useState(null)
    const [reportType, setReportType] = useState("General Report")
    const [customReportType, setCustomReportType] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [medicalId, setMedicalId] = useState("")
    const fileInputRef = useRef(null)
    const navigate = useNavigate()
    const userRole = localStorage.getItem("role") || localStorage.getItem("userRole") || "patient"
    const hospitalName = localStorage.getItem("userName") || "Hospital"

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
        if (userRole === 'hospital' && !medicalId) {
            setError("Please enter the patient's Medical ID.")
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
        formData.append("reportType", reportType === "Other" ? customReportType || "Other" : reportType)
        
        if (userRole === 'hospital') {
            formData.append("medicalId", medicalId)
            formData.append("hospitalName", hospitalName)
        }

        const endpoint = userRole === 'hospital' ? "/hospital/upload" : "/patient/upload"

        try {
            await API.post(endpoint, formData, {
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
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Link to="/patient" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Upload</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sync Medical Record</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Add your personal health documentation to the secure ledger.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">End-to-End Encrypted</span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto py-8">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden border-b-4 border-b-teal-600/10">
                    <div className="p-10">
                        {success ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
                                <div className="h-20 w-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center">
                                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Synthesis Complete</h3>
                                    <p className="text-slate-500 font-medium mt-2">Your medical record has been securely archived.</p>
                                </div>
                                <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-600 animate-[progress_2s_ease-in-out]"></div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={uploadReport} className="space-y-10">
                                {/* File Dropzone */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Document Data</label>
                                    {!file ? (
                                        <div className="relative border-4 border-dashed border-slate-50 rounded-[2rem] p-12 text-center hover:bg-slate-50/50 hover:border-teal-200 transition-all cursor-pointer group bg-slate-50/30">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                ref={fileInputRef}
                                            />
                                            <div className="flex flex-col items-center justify-center pointer-events-none">
                                                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                                    <UploadCloud className="h-8 w-8 text-teal-600" />
                                                </div>
                                                <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Transmit File</p>
                                                <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-tighter">PDF • JPG • PNG (Max 10MB)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between gap-4 shadow-xl shadow-slate-200">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <FileText className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Sync</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearFile}
                                                className="h-10 w-10 bg-white/10 hover:bg-red-500 hover:text-white text-slate-400 rounded-xl transition-all flex items-center justify-center shrink-0"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {userRole === 'hospital' && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Patient Medical ID</label>
                                        <div className="relative animate-in fade-in slide-in-from-top-2">
                                            <input
                                                type="text"
                                                required={userRole === 'hospital'}
                                                value={medicalId}
                                                onChange={(e) => setMedicalId(e.target.value)}
                                                placeholder="e.g. HM-12345"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Report Classification */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Medical Classification</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {[
                                            "General Report",
                                            "Blood Test",
                                            "Radiology",
                                            "Prescription",
                                            "Diagnostic",
                                            "Other"
                                        ].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setReportType(type)}
                                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    reportType === type 
                                                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100" 
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-teal-200 hover:text-slate-900"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {reportType === "Other" && (
                                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter custom report type..."
                                                value={customReportType}
                                                onChange={(e) => setCustomReportType(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <button
                                        type="submit"
                                        disabled={loading || !file}
                                        className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-teal-100 disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {loading ? "Establishing Secure Connection..." : "Initiate Secure Sync"}
                                    </button>
                                    
                                    {error && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                
                <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Secure cryptographic verification in progress
                </p>
            </div>
        </div>
    )
}