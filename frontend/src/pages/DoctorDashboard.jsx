import { useState, useEffect } from "react"
import { 
    LayoutDashboard, 
    Stethoscope, 
    ShieldCheck, 
    MapPin, 
    ChevronRight,
    User,
    Shield
} from "lucide-react"
import API from "../services/api"

export default function DoctorDashboard() {
    const [doctorProfile, setDoctorProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/doctor/dashboard")
                setDoctorProfile(res.data.doctor)
            } catch (err) {
                console.error("Failed to fetch doctor profile")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const doctorDisplayName = doctorProfile?.name || localStorage.getItem("userName") || "Doctor"
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Loading practitioner dashboard...</p>
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Medical Portal</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Dashboard</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Welcome back, <span className="text-indigo-600 font-bold uppercase">Dr. {doctorDisplayName.replace(/^Dr\.\s*/i, '')}</span></p>
                </div>
                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full animate-pulse ${doctorProfile?.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${doctorProfile?.isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {doctorProfile?.isVerified ? 'Authorized Practitioner' : 'Verification Pending'}
                    </span>
                </div>
            </div>

            {/* Doctor Info Card */}
            {doctorProfile && (
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden border-b-4 border-b-indigo-600/10">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Specialty</p>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-indigo-500" />
                                <p className="text-slate-800 font-bold">{doctorProfile.specialty}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Hospital</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                <p className="text-slate-800 font-bold truncate">{doctorProfile.hospitalName}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License Number</p>
                            <p className="text-slate-800 font-bold">{doctorProfile.licenseNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                            {doctorProfile.isVerified ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Hospital Verified</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Pending Institutional Review</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between min-h-[220px] group transition-all hover:scale-[1.02]">
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-widest mb-2 opacity-80">Clinical Analysis</h4>
                        <h3 className="text-2xl font-black leading-tight">Patient Records</h3>
                        <p className="text-indigo-100 text-sm font-medium mt-4">Access and verify reports via secure codes.</p>
                    </div>
                    <button 
                        onClick={() => window.location.href='/doctor/view-reports'}
                        className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all text-center flex items-center justify-center gap-2 group-hover:gap-3"
                    >
                        Access Now <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-between min-h-[220px] group transition-all hover:border-indigo-100">
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-widest mb-2 text-slate-400 tracking-widest">Account</h4>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">Identity Profile</h3>
                        <p className="text-slate-500 text-sm font-medium mt-4">Review and manage your clinical credentials.</p>
                    </div>
                    <button 
                        onClick={() => window.location.href='/profile'}
                        className="mt-6 w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all text-center"
                    >
                        Manage Profile
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white flex flex-col justify-between min-h-[220px]">
                    <div>
                        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                            <Shield className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black leading-tight">Protocol Security</h3>
                        <p className="text-slate-400 text-xs font-medium mt-3">All report verifications are cryptographically signed and tracked on the medical ledger.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20">
                        <ShieldCheck className="h-3 w-3" /> Verified Practitioner Status
                    </div>
                </div>
            </div>
        </div>
    )
}