import { useState } from "react"
import { 
    Search, 
    FileText, 
    Calendar, 
    User, 
    CheckCircle, 
    LayoutDashboard, 
    ExternalLink,
    Filter
} from "lucide-react"
import API from "../services/api"

export default function ViewPatientReports() {
    const [accessCode, setAccessCode] = useState("")
    const [patientData, setPatientData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const doctorDisplayName = localStorage.getItem("userName") || "Doctor"

    const fetchPatientData = async (e) => {
        if (e) e.preventDefault()
        if (!accessCode) return

        setLoading(true)
        setError("")
        setPatientData(null)

        try {
            // For separate patient lookup, we might need a specific endpoint or use existing dashboard logic
            const res = await API.post("/doctor/dashboard", { accessCode })
            setPatientData(res.data)
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Access Code or network error")
        } finally {
            setLoading(false)
        }
    }

    const verifyReport = async (reportId) => {
        try {
            await API.post("/doctor/verify", {
                reportId,
                doctorName: doctorDisplayName
            })
            // Refresh patient data to reflect verification
            const res = await API.post("/doctor/dashboard", { accessCode })
            setPatientData(res.data)
        } catch (err) {
            console.error(err)
            alert("Failed to verify report")
        }
    }

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Search className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Clinical Review</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Records Access</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Access and verify reports via secure patient proximity codes.</p>
                </div>
            </div>

            {/* Patient Search Section */}
            <div className="max-w-3xl mx-auto space-y-6 text-center">
                <div className="bg-white p-2.5 rounded-[2rem] shadow-xl shadow-indigo-100 border border-slate-100 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input 
                            type="text"
                            placeholder="Patient Access Code (e.g., DR-1234)"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchPatientData()}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-lg font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <button 
                        onClick={fetchPatientData}
                        disabled={loading || !accessCode}
                        className="px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 w-full md:w-auto shrink-0"
                    >
                        {loading ? 'Searching...' : 'Retrieve Records'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold text-center animate-shake">
                    {error}
                </div>
            )}

            {/* Search Results */}
            {patientData && (
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-teal-600/10">
                    <div className="p-8 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm shadow-indigo-50">
                                <User className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{patientData.patientName}</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Medical ID: {patientData.medicalId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                           <Filter className="h-3 w-3 text-slate-400" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{patientData.reports?.length || 0} Total Records</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 p-2">
                        {patientData.reports && patientData.reports.length > 0 ? (
                            patientData.reports.map((report, idx) => (
                                <div key={idx} className="group p-6 hover:bg-slate-50/80 rounded-2xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            <FileText className="h-7 w-7 text-indigo-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                                                    {report.reportType || "General Report"}
                                                </h4>
                                                {report.verified && (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wide">Verified by Dr. {report.verifiedByDoctor?.replace(/^Dr\.\s*/i, '')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="h-3 w-3" /> {report.uploadedBy}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <a 
                                            href={report.fileUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="flex-1 lg:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0 text-center uppercase tracking-widest inline-flex items-center gap-2"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            View
                                        </a>
                                        {!report.verified && (
                                            <button 
                                                onClick={() => verifyReport(report._id)} 
                                                className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0 text-center uppercase tracking-widest shadow-indigo-100 flex items-center gap-2"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Verify Report
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center">
                                <FileText className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No reports identified for this patient</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
