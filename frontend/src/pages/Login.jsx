import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, ArrowRight } from "lucide-react"
import API from "../services/api"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const login = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await API.post("/auth/login", { email, password })
            localStorage.clear()
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("role", res.data.role)
            if (res.data.user && res.data.user.name) {
                localStorage.setItem("userName", res.data.user.name)
            }
            
            // Redirect based on role
            if (res.data.role === 'admin') {
                window.location = "/admin"
            } else if (res.data.role === 'doctor') {
                window.location = "/doctor"
            } else if (res.data.role === 'hospital') {
                window.location = "/hospital"
            } else {
                window.location = "/patient"
            }
        } catch (err) {
            const data = err.response?.data;
            setError(typeof data === 'string' ? data : data?.message || data?.error || "Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="HealthMap Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-teal-900">HealthMap</span>
                        </Link>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-center mb-8">Sign in to access your portal</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={login} className="space-y-6">
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

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : (
                                <>
                                    Sign In <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}