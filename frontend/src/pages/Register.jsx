import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Activity, User, Mail, Lock, CheckCircle, BriefcaseMedical, Building2 } from "lucide-react"
import API from "../services/api"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("patient")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [registrationNumber, setRegistrationNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const register = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const payload = { name, email, password, role }
            if (role === 'doctor') payload.licenseNumber = licenseNumber
            if (role === 'hospital') payload.registrationNumber = registrationNumber

            await API.post("/auth/register", payload)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            const data = err.response?.data;
            setError(typeof data === 'string' ? data : data?.message || data?.error || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <Activity className="h-8 w-8 text-teal-600" />
                            <span className="text-2xl font-bold text-teal-900">HealthMap</span>
                        </Link>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Create Account</h2>
                    <p className="text-slate-500 text-center mb-6">Join HealthMap to manage your records</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                            <h3 className="text-xl font-bold text-slate-800">Registration Successful!</h3>
                            <p className="text-slate-600">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={register} className="space-y-5">
                            <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setRole("patient")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-medium transition-all ${
                                        role === "patient" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <User className="h-4 w-4 mb-1" />
                                    Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("doctor")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-medium transition-all ${
                                        role === "doctor" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <BriefcaseMedical className="h-4 w-4 mb-1" />
                                    Doctor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("hospital")}
                                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-xs font-medium transition-all ${
                                        role === "hospital" ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <Building2 className="h-4 w-4 mb-1" />
                                    Hospital
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 block">
                                    {role === "patient" ? "Full Name" : role === "doctor" ? "Doctor Name" : "Hospital Name"}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {role === "hospital" ? (
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        ) : (
                                            <User className="h-5 w-5 text-slate-400" />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                        placeholder={role === "patient" ? "John Doe" : role === "doctor" ? "Dr. Smith" : "City Hospital"}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 block">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {role === "doctor" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 block">Medical License Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BriefcaseMedical className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                            placeholder="e.g. MED-12345"
                                            value={licenseNumber}
                                            onChange={e => setLicenseNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {role === "hospital" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 block">Hospital Registration Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                            placeholder="e.g. REG-98765"
                                            value={registrationNumber}
                                            onChange={e => setRegistrationNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Register"}
                            </button>
                        </form>
                    )}
                </div>
                {!success && (
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}