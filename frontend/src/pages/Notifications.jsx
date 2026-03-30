import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, FileText, CheckCircle2, LayoutDashboard, Clock, Shield } from "lucide-react"
import API from "../services/api"

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all") // all, UPLOAD, VERIFICATION
    const userRole = localStorage.getItem("role") || localStorage.getItem("userRole") || "patient";

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await API.get(`/${userRole}/notifications`, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            const fetchedNotifications = res.data.notifications;
            setNotifications(fetchedNotifications)

            // Auto mark as read only for doctors or specific roles if needed, but not patients/hospitals by default
            // users should mark them as read manually or by interacting with them
            /*
            if (userRole !== 'hospital' && fetchedNotifications.some(n => !n.isRead)) {
                await markAllAsRead();
            }
            */
        } catch (err) {
            console.error("Failed to fetch notifications", err)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            await API.put(`/${userRole}/notifications/${id}/read`, {}, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n))
        } catch (err) {
            console.error("Failed to mark as read", err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await API.put(`/${userRole}/notifications/read-all`, {}, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            setNotifications(notifications.map(n => ({ ...n, isRead: true })))
        } catch (err) {
            console.error("Failed to mark all as read", err)
        }
    }

    const handleDoctorResolution = async (notificationId, doctorId, action) => {
        try {
            await API.put(`/hospital/${action}-doctor`, { id: doctorId }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            await markAsRead(notificationId);
            fetchNotifications();
        } catch (err) {
            console.error(`Failed to ${action} doctor`, err);
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const filteredNotifications = notifications.filter(n => filter === "all" || n.type === filter)

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-12 w-12 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Retrieving communications...</p>
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
                        <span className="text-xs font-bold uppercase tracking-widest">Updates</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
                    <p className="text-slate-500 font-medium">Monitoring activity on your medical identity profile.</p>
                </div>
                {userRole !== 'hospital' && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:translate-y-0.5"
                    >
                        Dismiss All
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            {userRole !== 'hospital' && (
                <div className="flex border-b border-slate-200 gap-8 overflow-x-auto pb-px">
                    {[
                        { id: "all", label: "All Activity", icon: Bell },
                        { id: "UPLOAD", label: "Hospital Uploads", icon: FileText },
                        { id: "VERIFICATION", label: "Medical Verifications", icon: Shield }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${filter === tab.id ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            <tab.icon className="h-3 w-3" />
                            {tab.label}
                            {filter === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-600 rounded-full"></div>}
                        </button>
                    ))}
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-6">
                {notifications.length === 0 ? (
                    <div className="py-32 text-center bg-white border border-slate-200 rounded-[2.5rem] border-dashed">
                        <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Bell className="h-10 w-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">Transmission Archive Empty</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 px-12">No recent events or alerts detected in your activity stream.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-4 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {userRole === 'hospital' ? "Personnel Verifications" : filter === "all" ? "Recent Activity" : filter === "UPLOAD" ? "Medical Submissions" : "Clinical Validations"}
                            </span>
                        </div>
                        
                        {(userRole === 'hospital' ? notifications : filteredNotifications).map((notification) => (
                            <div
                                key={notification._id}
                                className={`group relative p-6 bg-white border rounded-[2rem] transition-all duration-300 ${
                                    notification.isRead 
                                    ? "border-slate-100 opacity-60" 
                                    : "border-teal-200 shadow-xl shadow-teal-50/50 ring-1 ring-teal-50"
                                }`}
                            >
                                <div className="flex gap-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                                        notification.type === 'VERIFICATION' 
                                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                        : notification.type === 'DOCTOR_APPROVAL'
                                        ? "bg-amber-50 border-amber-100 text-amber-600"
                                        : "bg-indigo-50 border-indigo-100 text-indigo-600"
                                    }`}>
                                        {notification.type === 'VERIFICATION' ? <CheckCircle2 className="h-7 w-7" /> : notification.type === 'DOCTOR_APPROVAL' ? <Shield className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">
                                                {notification.type === 'VERIFICATION' ? "Medical Analysis Verified" : notification.type === 'DOCTOR_APPROVAL' ? "Doctor Validation Request" : "New Medical Report"}
                                            </h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                                                {formatDate(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {notification.type === 'VERIFICATION' ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                                                    <Shield className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Secured</span>
                                                </div>
                                            ) : notification.type === 'DOCTOR_APPROVAL' ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                                    <Shield className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Pending Review</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                                                    <FileText className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Ledger Entry</span>
                                                </div>
                                            )}
                                            
                                            {notification.type === 'DOCTOR_APPROVAL' && notification.doctorId && (
                                                <div className="ml-auto flex items-center gap-2">
                                                    {!notification.isRead ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleDoctorResolution(notification._id, notification.doctorId, 'reject')}
                                                                className="px-3 py-1.5 text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 rounded-lg uppercase tracking-widest transition-all"
                                                            >
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => handleDoctorResolution(notification._id, notification.doctorId, 'verify')}
                                                                className="px-3 py-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg uppercase tracking-widest transition-all shadow-sm shadow-emerald-100"
                                                            >
                                                                Approve
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="px-3 py-1.5 text-[10px] font-black text-slate-400 bg-slate-50 rounded-lg uppercase tracking-widest border border-slate-100">
                                                            Action Completed
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {!notification.isRead && notification.type !== 'DOCTOR_APPROVAL' && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="ml-auto text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 px-3 py-1 hover:bg-teal-50 rounded-lg transition-all"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!notification.isRead && (
                                    <div className="absolute top-6 right-6 h-2 w-2 bg-teal-500 rounded-full animate-ping"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
