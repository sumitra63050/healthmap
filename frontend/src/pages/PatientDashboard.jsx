import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, FileText, Upload, User, Key, Calendar, RefreshCw, Trash2, CheckCircle } from "lucide-react"
import API from "../services/api"

export default function PatientDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [regenerating, setRegenerating] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }

            try {
                const res = await API.get("/patient/dashboard", {
                    headers: { Authorization: token }
                })
                setData(res.data)
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

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

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
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <img src="/logo.png" alt="HealthMap Logo" className="h-12 w-auto animate-pulse" />
                    <p className="text-teal-900 font-medium">Loading your portal...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4">
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => navigate("/login")} className="px-6 py-2 bg-teal-600 text-white rounded-xl shadow-sm hover:bg-teal-700 transition">
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="HealthMap Logo" className="h-8 w-auto" />
                        <span className="text-xl font-bold text-teal-900">HealthMap</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                            <User className="h-4 w-4" />
                            {data.name} {data.gender ? `(${data.gender})` : ''}
                        </div>
                        <button onClick={logout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Logout">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your health records safely and securely.</p>
                    </div>
                    <Link to="/upload-report" className="px-4 py-2.5 bg-teal-600 text-white font-medium rounded-xl shadow-sm hover:bg-teal-700 hover:shadow-md transition-all flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload New Report
                    </Link>
                </div>

                {/* Identity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 rounded-2xl shadow-md text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-teal-100 text-sm font-medium mb-1">Medical ID Space</p>
                                <h3 className="text-2xl font-bold tracking-tight">{data.medicalId || "Not Assigned"}</h3>
                            </div>
                            <div className="p-2 bg-white/20 rounded-xl">
                                <img src="/logo.png" alt="Logo" className="h-6 w-auto brightness-0 invert" />
                            </div>
                        </div>
                        <p className="text-teal-50 text-sm opacity-90">Give this ID to hospital staff when getting tested.</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-md text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-blue-100 text-sm font-medium mb-1">Doctor Access Code</p>
                                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-3 mt-1">
                                    <h3 className="text-2xl font-bold tracking-tight">{data.doctorAccessCode || "Not Assigned"}</h3>
                                    <button
                                        onClick={regenerateAccessCode}
                                        disabled={regenerating}
                                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Regenerate Access Code"
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                                        {regenerating ? 'Generating...' : 'Regenerate'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Key className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p className="text-blue-50 text-sm opacity-90">Share this code with your doctor for report access.</p>
                    </div>
                </div>

                {/* Reports List */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600" />
                            Your Medical Reports
                        </h2>
                        <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full">{data.reports?.length || 0} Total</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {data.reports && data.reports.length > 0 ? (
                            data.reports.map((report, idx) => (
                                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-slate-800 flex flex-wrap items-center gap-2">
                                                {report.reportType || "General Report"}
                                                {report.verified && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        <CheckCircle className="h-3 w-3" /> Verified by Dr. {report.verifiedByDoctor.replace(/^Dr\.\s*/i, '')}
                                                    </span>
                                                )}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> Uploaded by: {report.uploadedBy}</span>
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <a href={report.fileUrl} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:text-teal-700 hover:border-teal-300 rounded-lg text-sm font-medium transition-all text-center">
                                            View
                                        </a>
                                        {report.uploadedBy === "patient" && (
                                            <button
                                                onClick={() => deleteReport(report._id)}
                                                disabled={deletingId === report._id}
                                                className="px-3 py-2 border border-slate-200 bg-white text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-1"
                                                title="Delete Record"
                                            >
                                                <Trash2 className={`h-4 w-4 ${deletingId === report._id ? 'animate-pulse' : ''}`} />
                                                <span className="sr-only sm:not-sr-only sm:max-w-none">Delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <p className="text-slate-600 font-medium">No reports found.</p>
                                <p className="text-slate-400 text-sm mt-1 mb-4">You haven't uploaded any reports yet.</p>
                                <Link to="/upload-report" className="text-teal-600 hover:text-teal-700 text-sm font-medium bg-teal-50 px-4 py-2 rounded-lg">
                                    Upload First Report
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}