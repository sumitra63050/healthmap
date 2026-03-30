import { useState, useEffect } from "react"
import { 
    FileText, 
    Search, 
    ChevronRight, 
    ArrowLeft, 
    Activity, 
    FlaskConical, 
    Microscope, 
    ClipboardList,
    Layers,
    ExternalLink,
    User,
    ChevronDown,
    CheckCircle,
    Eye
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function Reports() {
    const [reports, setReports] = useState([])
    const [hospitalPatients, setHospitalPatients] = useState([])
    const [expandedPatient, setExpandedPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all") // all, hospital, patient
    const [reportTypeFilter, setReportTypeFilter] = useState("All Types")
    const navigate = useNavigate()

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const userRole = localStorage.getItem("role") || localStorage.getItem("userRole") || "patient";
            let fetchedReports = [];
            
            if (userRole === 'hospital') {
                const res = await API.get("/hospital/my-reports", {
                     headers: { Authorization: localStorage.getItem("token") }
                });
                if (res.data.patients) {
                    setHospitalPatients(res.data.patients || []);
                }
            } else {
                const route = userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
                const res = await API.get(route);
                fetchedReports = res.data.reports || [];
            }
            setReports(fetchedReports)
        } catch (err) {
            console.error("Failed to fetch reports", err)
        } finally {
            setLoading(false)
        }
    }

    // Filtering logic
    const filteredReports = reports.filter(report => {
        const isHospital = report.uploadedBy !== "patient";
        const matchesTab = activeTab === "all" || (activeTab === "hospital" && isHospital) || (activeTab === "patient" && !isHospital);
        const matchesType = reportTypeFilter === "All Types" || (report.reportType || "General Report") === reportTypeFilter;
        const matchesSearch = !searchTerm || 
            (report.reportType || "General Report").toLowerCase().includes(searchTerm.toLowerCase()) || 
            (report.uploadedBy || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesType && matchesSearch;
    });

    // Grouping logic
    const categories = filteredReports.reduce((acc, report) => {
        const type = report.reportType || "General Report"
        if (!acc[type]) acc[type] = []
        acc[type].push(report)
        return acc
    }, {})

    const categoryList = Object.keys(categories).map(name => ({
        name,
        count: categories[name].length,
        reports: categories[name]
    }))

    const getIcon = (name) => {
        const n = name.toLowerCase()
        if (n.includes("blood")) return <FlaskConical className="h-6 w-6" />
        if (n.includes("radiology") || n.includes("scan") || n.includes("x-ray")) return <Layers className="h-6 w-6" />
        if (n.includes("prescription")) return <ClipboardList className="h-6 w-6" />
        if (n.includes("diagnostic")) return <Microscope className="h-6 w-6" />
        return <Activity className="h-6 w-6" />
    }

    const getColor = (name) => {
        const n = name.toLowerCase()
        if (n.includes("blood")) return "bg-rose-50 text-rose-600 border-rose-100"
        if (n.includes("radiology") || n.includes("scan")) return "bg-blue-50 text-blue-600 border-blue-100"
        if (n.includes("prescription")) return "bg-amber-50 text-amber-600 border-amber-100"
        if (n.includes("diagnostic")) return "bg-purple-50 text-purple-600 border-purple-100"
        return "bg-teal-50 text-teal-600 border-teal-100"
    }

    const userRole = localStorage.getItem("role") || localStorage.getItem("userRole") || "patient";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-12 w-12 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Categorizing your records...</p>
            </div>
        )
    }

    if (userRole === 'hospital') {
        const filteredPatients = hospitalPatients.filter(p => 
            (p.medicalId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="animate-fade-in space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Medical Records</h3>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{hospitalPatients.length} Active Patients</p>
                        </div>
                    </div>
                    
                    <div className="relative w-full md:w-72">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                         <input 
                            type="text"
                            placeholder="Patient search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                         />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-emerald-600/10">
                   <div className="divide-y divide-slate-100 p-2">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <div key={patient.patientId || patient._id} className="group overflow-hidden rounded-2xl mb-2">
                                        <div 
                                            onClick={() => setExpandedPatient(expandedPatient === (patient.patientId || patient._id) ? null : (patient.patientId || patient._id))}
                                            className={`p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition-all ${expandedPatient === (patient.patientId || patient._id) ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
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
                                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(patient.reports || []).length} Records</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest md:block hidden">View Analysis</span>
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white border border-slate-100 transition-transform ${expandedPatient === (patient.patientId || patient._id) ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {expandedPatient === (patient.patientId || patient._id) && (
                                            <div className="bg-slate-50/30 p-2 space-y-2 border-t border-slate-50">
                                                {(patient.reports || []).map(report => (
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
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">No active records found matching criteria</p>
                                </div>
                            )}
                        </div>
                </div>
            </div>
        )
    }

    const displayedReports = selectedCategory 
        ? categories[selectedCategory] || []
        : []

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Your Medical Reports</h3>
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">{filteredReports.length} Total Records</p>
                    </div>
                </div>
                
                {selectedCategory ? (
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:translate-y-0.5"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to Categories
                    </button>
                ) : (
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
                )}
            </div>

            {/* Quick Filters - Visible only in category view */}
            {!selectedCategory && (
                <div className="flex flex-wrap items-center justify-between gap-4">
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
                            {[...new Set(reports.map(r => r.reportType || "General Report"))].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryList.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat.name)}
                            className="group relative p-8 bg-white border border-slate-200 rounded-[2.5rem] text-left hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-100 transition-all duration-500 overflow-hidden"
                        >
                            <div className={`h-16 w-16 rounded-[1.5rem] border flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${getColor(cat.name)}`}>
                                {getIcon(cat.name)}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase group-hover:text-teal-600 transition-colors">
                                {cat.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                                    {cat.count} {cat.count === 1 ? 'Record' : 'Records'}
                                </span>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                            
                            {/* Decorative Background Element */}
                            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-slate-50/50 rounded-full group-hover:bg-teal-50/50 transition-colors duration-500 -z-0"></div>
                        </button>
                    ))}
                    
                    {categoryList.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white border border-slate-200 rounded-[2.5rem] border-dashed">
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
            ) : (
                <div className="max-w-4xl mx-auto space-y-4">
                    {displayedReports.map((report, idx) => (
                        <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
                            <div className="flex items-center gap-5 w-full">
                                <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <FileText className="h-7 w-7 text-teal-500" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">
                                        {report.reportType || "General Report"}
                                    </h4>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className={report.uploadedBy === 'patient' ? "text-slate-400" : "text-emerald-600"}>
                                            {report.uploadedBy === 'patient' ? "Self Uploaded" : `From: ${report.uploadedBy}`}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <a 
                                href={report.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <ExternalLink className="h-3 w-3" />
                                View Document
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
