import { useState, useRef, useEffect } from "react"
import { 
    UploadCloud, 
    File, 
    X, 
    CheckCircle, 
    Hospital, 
    BriefcaseMedical, 
    XCircle, 
    FileText, 
    Trash2, 
    Eye, 
    User, 
    ChevronDown, 
    ChevronUp, 
    Shield,
    Search,
    LayoutDashboard,
    Plus,
    Filter,
    Activity
} from "lucide-react"
import API from "../services/api"

export default function HospitalUpload() {
    const [medicalId, setMedicalId] = useState("")
    const [file, setFile] = useState(null)
    const [reportType, setReportType] = useState("Hospital Report")
    const [customReportType, setCustomReportType] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [patients, setPatients] = useState([])
    const [expandedPatient, setExpandedPatient] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const fileInputRef = useRef(null)

    const hospitalName = localStorage.getItem("userName") || "Hospital"
    const token = localStorage.getItem("token")

    useEffect(() => {
        fetchHospitalReports()
    }, [])

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
        formData.append("reportType", reportType === "Other" ? customReportType || "Other" : reportType)

        try {
            await API.post("/hospital/upload", formData, {
                headers: { Authorization: token }
            })
            setSuccess(true)
            fetchHospitalReports()
            setTimeout(() => {
                setSuccess(false)
                setMedicalId("")
                setCustomReportType("")
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

    const filteredPatients = patients.filter(p => 
        p.medicalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Medical Administration</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Portal</h1>
                    <p className="text-slate-500 font-medium">Managing records for <span className="text-emerald-600 font-bold">{hospitalName}</span></p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verified Hospital</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Upload Form */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-emerald-600/10">
                        <div className="bg-emerald-600 p-8 text-white relative">
                            <Plus className="absolute top-8 right-8 h-8 w-8 text-white/20" />
                            <h2 className="text-2xl font-black tracking-tight mb-2">New Record</h2>
                            <p className="text-emerald-100 text-sm font-medium leading-relaxed">Securely upload a new medical report to a patient's profile.</p>
                        </div>
                        
                        <div className="p-8">
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Upload Complete</h3>
                                    <p className="text-slate-500 text-sm font-medium text-center">Record successfully synchronized.</p>
                                </div>
                            ) : (
                                <form onSubmit={uploadReport} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Patient Medical ID</label>
                                        <div className="relative">
                                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="e.g. HM-12345"
                                                value={medicalId}
                                                onChange={e => setMedicalId(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Classification</label>
                                        <select
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                                        >
                                            <option value="Hospital Report">General Report</option>
                                            <option value="Blood Test">Blood Analysis</option>
                                            <option value="X-Ray">Radiology (X-Ray)</option>
                                            <option value="MRI">Diagnostic MRI</option>
                                            <option value="CT Scan">Computed Tomography</option>
                                            <option value="Prescription">Prescription</option>
                                            <option value="Discharge Summary">Discharge</option>
                                            <option value="Other">Miscellaneous (Other)</option>
                                        </select>
                                    </div>

                                    {reportType === "Other" && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Specify Type</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                                placeholder="Enter report name..."
                                                value={customReportType}
                                                onChange={e => setCustomReportType(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Document File</label>
                                        {!file ? (
                                            <div className="relative border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 text-center hover:bg-slate-50 hover:border-emerald-400 transition-all cursor-pointer group">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                />
                                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                                    <UploadCloud className="h-8 w-8 text-slate-300 mb-3 group-hover:text-emerald-500 transition-colors" />
                                                    <p className="text-slate-600 text-xs font-bold uppercase tracking-wider">Select File</p>
                                                    <p className="text-slate-400 text-[10px] mt-1 font-medium">PDF, JPG, PNG only</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
                                                        <File className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearFile}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !file || !medicalId}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : "Secure Synchronization"}
                                    </button>
                                    
                                    {error && <p className="text-center text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Historical Records */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-emerald-600/10">
                        <div className="p-8 pb-4 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Medical Records</h3>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                    <input 
                                        type="text"
                                        placeholder="Identification Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 p-2">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <div key={patient.patientId} className="group overflow-hidden rounded-2xl mb-2">
                                        <div 
                                            onClick={() => togglePatient(patient.patientId)}
                                            className={`p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition-all ${expandedPatient === patient.patientId ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <User className="h-7 w-7 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">{patient.name}</h4>
                                                    <div className="flex items-center gap-3">
                                                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{patient.medicalId}</span>
                                                       <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.reports.length} Records</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest md:block hidden">View Analysis</span>
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white border border-slate-100 transition-transform ${expandedPatient === patient.patientId ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {expandedPatient === patient.patientId && (
                                            <div className="bg-slate-50/30 p-2 space-y-2 border-t border-slate-50">
                                                {patient.reports.map(report => (
                                                    <div key={report._id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                                <FileText className="h-5 w-5 text-emerald-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                                </p>
                                                                <h5 className="text-sm font-bold text-slate-900">{report.reportType}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {report.verified ? (
                                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 mr-2">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider">Verified</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100 mr-2">
                                                                    <Activity className="h-3 w-3" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider">Analysis Pending</span>
                                                                </div>
                                                            )}
                                                            <a href={report.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Eye className="h-4 w-4" /></a>
                                                            {!report.verified && report.uploadedBy === hospitalName && (
                                                                <button onClick={() => deleteReport(report._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="h-4 w-4" /></button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-24 text-center">
                                    <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <Search className="h-10 w-10 text-slate-200" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">System clear</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">No records synchronized with the cloud</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}