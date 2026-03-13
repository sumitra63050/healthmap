import { Link } from "react-router-dom"
import { Activity, Shield, Users, FileText, Lock, Clock, Stethoscope, Building2, ChevronRight, CheckCircle2 } from "lucide-react"

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="flex flex-wrap items-center justify-between px-6 md:px-12 py-4 md:py-6 max-w-7xl mx-auto w-full sticky top-0 bg-slate-50/80 backdrop-blur-md z-50 border-b border-transparent transition-all gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <Activity className="h-8 w-8 text-teal-600" />
                    <span className="text-2xl font-bold tracking-tight text-teal-900">HealthMap</span>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-center sm:justify-end">
                    <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-teal-600 text-white rounded-xl shadow-sm hover:bg-teal-700 hover:shadow-md transition-all duration-300">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                {/* Hero */}
                <section className="relative px-6 md:px-12 pt-20 pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-blue-50/50 -z-10" />
                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 text-teal-800 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Shield className="h-4 w-4" />
                            <span>Secure Healthcare Management</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Your Medical History, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Unified & Accessible</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            HealthMap seamlessly connects patients, doctors, and hospitals. Manage your reports, grant secure access, and take control of your healthcare journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Link to="/register" className="px-8 py-4 text-lg font-medium bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                                <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                Join as Patient
                            </Link>
                            <Link to="/login" className="px-8 py-4 text-lg font-medium bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:border-teal-300 hover:shadow-md hover:text-teal-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                                <Stethoscope className="h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                                Doctor Portal
                            </Link>
                            <Link to="/login" className="px-8 py-4 text-lg font-medium bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:border-teal-300 hover:shadow-md hover:text-teal-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                                <Building2 className="h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                                Hospital Portal
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose HealthMap?</h2>
                            <p className="text-lg text-slate-600">Built with modern security and ease of use in mind, giving you peace of mind over your records.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Lock className="h-8 w-8 text-teal-600" />,
                                    title: "Bank-Grade Security",
                                    desc: "Your records are encrypted and stored safely. Only you control who sees your data."
                                },
                                {
                                    icon: <FileText className="h-8 w-8 text-teal-600" />,
                                    title: "Centralized Records",
                                    desc: "No more carrying paper files. Access X-rays, blood tests, and prescriptions in one place."
                                },
                                {
                                    icon: <Clock className="h-8 w-8 text-teal-600" />,
                                    title: "Instant Access",
                                    desc: "Share a unique, temporary doctor code during your visit for instant record sharing."
                                }
                            ].map((feat, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all group">
                                    <div className="h-14 w-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-600/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                        <div className="mb-16 md:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">How HealthMap Works</h2>
                            <p className="text-slate-400 text-lg">A simple 3-step process to taking control of your medical journey.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-teal-500/50 via-teal-500/50 to-transparent -z-10 border-t-2 border-dashed border-teal-500/30"></div>

                            {[
                                {
                                    step: "01",
                                    title: "Register & Get IDs",
                                    desc: "Sign up as a patient. You instantly receive a unique Medical ID and a secure Doctor Access Code."
                                },
                                {
                                    step: "02",
                                    title: "Upload or Visit",
                                    desc: "Upload your past reports, or give your Medical ID to a registered Hospital to upload them for you."
                                },
                                {
                                    step: "03",
                                    title: "Share with Doctors",
                                    desc: "When visiting a specialist, share your Doctor Access Code so they can view your full history."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="h-24 w-24 bg-slate-800 border-2 border-teal-500 rounded-full flex items-center justify-center text-3xl font-bold text-teal-400 mb-6 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24 bg-white text-center px-6">
                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <Activity className="h-16 w-16 text-teal-600 mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to digitize your health?</h2>
                        <p className="text-xl text-slate-600 mb-10">Join thousands of patients who are managing their health records securely and easily.</p>
                        <Link to="/register" className="px-8 py-4 text-lg font-medium bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                            Create Free Account <ChevronRight className="h-5 w-5" />
                        </Link>
                        
                        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-500" /> No hidden fees</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-500" /> Cancel anytime</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-teal-600" />
                        <span className="text-lg font-bold text-slate-800">HealthMap</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © {new Date().getFullYear()} HealthMap. All rights reserved.
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-slate-600">
                        <Link to="/login" className="hover:text-teal-600 transition-colors">Patient</Link>
                        <Link to="/login" className="hover:text-teal-600 transition-colors">Doctor</Link>
                        <Link to="/login" className="hover:text-teal-600 transition-colors">Hospital</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}