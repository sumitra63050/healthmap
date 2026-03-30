import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
    LayoutDashboard, 
    FileText, 
    Upload, 
    User, 
    Key, 
    Calendar, 
    RefreshCw, 
    Trash2, 
    CheckCircle, 
    Search,
    ShieldCheck,
    ArrowRight // Added ArrowRight for the new card
} from "lucide-react"
import API from "../services/api"

export default function PatientDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [regenerating, setRegenerating] = useState(false)
    const [error, setError] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [activeTab, setActiveTab] = useState("all") // all, hospital, patient
    const [reportTypeFilter, setReportTypeFilter] = useState("All Types")
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }

            try {
                const dashboardRes = await API.get("/patient/dashboard", {
                    headers: { Authorization: token }
                })
                setData(dashboardRes.data)
            } catch (err) {
                setError("Failed to load dashboard. Please log in again.")
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token")
                    navigate("/login")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate])

    const regenerateAccessCode = async () => {
        try {
            setRegenerating(true)
            const token = localStorage.getItem("token")
            const res = await API.put("/patient/access-code", {}, {
                headers: { Authorization: token }
            })
            setData(prev => ({ ...prev, doctorAccessCode: res.data.doctorAccessCode }))
        } catch (err) {
            alert("Failed to regenerate access code")
        } finally {
            setRegenerating(false)
        }
    }

    const deleteReport = async (reportId) => {
        if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
            return
        }

        try {
            setDeletingId(reportId)
            const token = localStorage.getItem("token")
            await API.delete(`/patient/report/${reportId}`, {
                headers: { Authorization: token }
            })
            // Remove report from local state
            setData(prev => ({
                ...prev,
                reports: prev.reports.filter(r => r._id !== reportId)
            }))
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete report")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-12 w-12 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading dashboard records...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center max-w-md mx-auto my-12">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <button onClick={() => navigate("/login")} className="px-6 py-2 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-all">
                    Back to Login
                </button>
            </div>
        )
    }

    const filteredReports = data.reports?.filter(report => {
        const isHospital = report.uploadedBy !== "patient";
        const matchesTab = activeTab === "all" || (activeTab === "hospital" && isHospital) || (activeTab === "patient" && !isHospital);
        const matchesType = reportTypeFilter === "All Types" || (report.reportType || "General Report") === reportTypeFilter;
        const matchesSearch = !searchTerm || 
            (report.reportType || "General Report").toLowerCase().includes(searchTerm.toLowerCase()) || 
            (report.uploadedBy || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesType && matchesSearch;
    });

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Dashboard</h1>
                    <p className="text-slate-500 font-medium">Welcome back, <span className="text-teal-600">{data.name.split(' ')[0]}</span></p>
                </div>
                <Link 
                    to="/upload-report" 
                    className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all text-sm w-full md:w-auto"
                >
                    <Upload className="h-4 w-4" />
                    Upload New Report
                </Link>
            </div>

            {/* Identifiers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Medical ID Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-[2rem] shadow-xl shadow-teal-100 text-white group">
                    <div className="relative z-10">
                        <p className="text-teal-100/80 text-sm font-bold uppercase tracking-wider mb-2">Medical ID Space</p>
                        <h2 className="text-4xl font-black tracking-tight mb-6">{data.medicalId}</h2>
                        <p className="text-teal-50/70 text-sm font-medium leading-relaxed max-w-[280px]">
                            Give this ID to hospital staff when getting tested.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-8 right-8 p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                </div>

                {/* Access Code Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-xl shadow-indigo-100 text-white group">
                    <div className="relative z-10">
                        <p className="text-indigo-100/80 text-sm font-bold uppercase tracking-wider mb-2">Doctor Access Code</p>
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <h2 className="text-4xl font-black tracking-tight">{data.doctorAccessCode}</h2>
                            <button
                                onClick={regenerateAccessCode}
                                disabled={regenerating}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl backdrop-blur-md transition-all font-bold text-xs disabled:opacity-50"
                            >
                                <RefreshCw className={`h-3 w-3 ${regenerating ? 'animate-spin' : ''}`} />
                                {regenerating ? 'Regenerating...' : 'Regenerate'}
                            </button>
                        </div>
                        <p className="text-indigo-50/70 text-sm font-medium leading-relaxed max-w-[280px]">
                            Share this code with your doctor for report access.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-8 right-8 p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Key className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
                </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-teal-600/10">
                <div className="p-8 pb-4 border-b border-slate-100 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                <FileText className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Your Medical Reports</h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">{filteredReports?.length || 0} Total Records</p>
                                    <span className="text-slate-200">|</span>
                                    <button 
                                        onClick={() => navigate("/reports")}
                                        className="text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                                    >
                                        View Categorized <ArrowRight className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search in Reports */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {[
                                { id: "all", label: "All Reports" },
                                { id: "hospital", label: "Hospital Uploads" },
                                { id: "patient", label: "Self Uploads" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === tab.id 
                                        ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <select
                                value={reportTypeFilter}
                                onChange={(e) => setReportTypeFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                            >
                                <option value="All Types">All Types</option>
                                {[...new Set(data.reports?.map(r => r.reportType || "General Report"))].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* List View */}
                <div className="divide-y divide-slate-100 p-2">
                    {filteredReports && filteredReports.length > 0 ? (
                        filteredReports.map((report, idx) => (
                            <div key={idx} className="group p-6 hover:bg-slate-50/80 rounded-2xl transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <FileText className="h-7 w-7 text-teal-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
                                                {report.reportType || "General Report"}
                                            </h4>
                                            {report.verified && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wide">Verified by Dr. {report.verifiedByDoctor.replace(/^Dr\.\s*/i, '')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            <span className={`flex items-center gap-1.5 ${report.uploadedBy === "patient" ? "text-slate-400" : "text-emerald-600"}`}>
                                                <User className="h-3 w-3" /> 
                                                {report.uploadedBy === "patient" ? "Self Uploaded" : `Verified Hospital: ${report.uploadedBy}`}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-slate-400">
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
                                        className="flex-1 lg:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0 text-center uppercase tracking-widest"
                                    >
                                        View
                                    </a>
                                    {report.uploadedBy === "patient" && !report.verified && (
                                        <button
                                            onClick={() => deleteReport(report._id)}
                                            disabled={deletingId === report._id}
                                            className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 group/del"
                                            title="Delete Record"
                                        >
                                            <Trash2 className={`h-5 w-5 ${deletingId === report._id ? 'animate-pulse' : ''} group-hover/del:scale-110 transition-transform`} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Search className="h-10 w-10 text-slate-200" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 tracking-tight">No records discovered</h4>
                            <p className="text-slate-400 font-medium max-w-[280px] mx-auto mt-2">
                                We couldn't find any medical reports matching your current configuration.
                            </p>
                            <button 
                                onClick={() => { setActiveTab("all"); setReportTypeFilter("All Types"); setSearchTerm(""); }}
                                className="mt-8 text-teal-600 font-bold hover:text-teal-700 py-2 px-6 bg-teal-50 rounded-xl transition-all"
                            >
                                Reset Search Parameters
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}