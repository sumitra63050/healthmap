import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Shield, CheckCircle, XCircle, LogOut, Search, User, BriefcaseMedical, Building2, FileText } from "lucide-react"
import logo from "../assets/logo.png"
import API from "../services/api"

export default function AdminDashboard() {
    const [pendingHospitals, setPendingHospitals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchPending()
    }, [])

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await API.get("/admin/pending", {
                headers: { Authorization: token }
            })
            setPendingHospitals(res.data.hospitals || [])
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load pending verifications")
        } finally {
            setLoading(false)
        }
    }

    const verifyUser = async (type, id) => {
        if (!window.confirm(`Are you sure you want to approve this ${type}?`)) return;
        try {
            const token = localStorage.getItem("token")
            await API.put("/admin/verify", { type, id }, {
                headers: { Authorization: token }
            })
            fetchPending()
        } catch (err) {
            alert(err.response?.data?.error || `Failed to verify ${type}`)
        }
    }

    const rejectUser = async (type, id) => {
        if (!window.confirm(`Are you sure you want to reject and delete this ${type}? This action cannot be undone.`)) return;
        try {
            const token = localStorage.getItem("token")
            await API.delete("/admin/reject", {
                data: { type, id },
                headers: { Authorization: token }
            })
            fetchPending()
        } catch (err) {
            alert(err.response?.data?.error || `Failed to reject ${type}`)
        }
    }

    const logout = () => {
        localStorage.clear()
        window.location = "/login"
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <img src={logo} alt="Loading..." className="h-10 w-10 object-contain animate-pulse" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <img src={logo} alt="HealthMap Logo" className="h-8 w-8 object-contain" />
                        <span className="text-xl font-bold text-teal-900">HealthMap Admin</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                            <Shield className="h-4 w-4" /> Administrator
                        </div>
                        <button onClick={logout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Logout">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Verification Dashboard</h1>
                    <p className="text-slate-500 mt-1">Review and approve new Hospital applications.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Building2 className="h-6 w-6 text-blue-500" />
                            Pending Hospitals ({pendingHospitals.length})
                        </h2>
                        {pendingHospitals.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-sm">
                                No pending hospital verifications.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingHospitals.map(hospital => (
                                    <div key={hospital._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-slate-800">{hospital.name}</h3>
                                        <p className="text-slate-500 text-sm mb-4">{hospital.email}</p>
                                        <div className="bg-blue-50 p-3 rounded-lg mb-6">
                                            <p className="text-xs text-blue-800 font-semibold mb-1">Hospital Registration</p>
                                            <p className="font-mono text-blue-900 text-sm break-all">{hospital.registrationNumber}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => verifyUser('hospital', hospital._id)} className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-colors">
                                                <CheckCircle className="h-4 w-4" /> Approve
                                            </button>
                                            <button onClick={() => rejectUser('hospital', hospital._id)} className="flex-1 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-colors">
                                                <XCircle className="h-4 w-4" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}
