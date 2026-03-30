import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCircle, 
  UploadCloud, 
  Bell, 
  LogOut, 
  Settings,
  ShieldCheck,
  Search,
  Menu,
  X,
  FileText,
  Upload
} from "lucide-react";
import logo from "../assets/logo.png";


const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = localStorage.getItem("role") || localStorage.getItem("userRole") || "patient";
  const userName = localStorage.getItem("userName") || "User";
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const route = userRole === 'patient' ? '/patient/dashboard' : `/${userRole}/dashboard`;
        const res = await API.get(route);
        const data = res.data?.doctor || res.data;
        if (data.profilePic) setProfilePic(data.profilePic);
      } catch (err) {
        console.error("Layout profile fetch failed", err);
      }
    };
    fetchProfile();
  }, [userRole]);

    const navItems = userRole === 'doctor' ? [
      { name: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
      { name: "My Profile", icon: UserCircle, path: "/profile" },
      { name: "View Patient Reports", icon: Search, path: "/doctor/view-reports" },
    ] : [
      { name: "Dashboard", icon: LayoutDashboard, path: `/${userRole}` },
      ...(userRole !== 'hospital' ? [{ name: "My Profile", icon: UserCircle, path: "/profile" }] : []),
      { name: "Upload Report", icon: Upload, path: "/upload-report" },
      { name: "Medical Records", icon: FileText, path: "/reports" },
      { name: "Notifications", icon: Bell, path: "/notifications" },
    ];



  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-200">
            <img src={logo} alt="Logo" className="h-4 w-4 object-contain brightness-0 invert" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">HEALTHMAP</span>
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu (Overlay) */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <aside className="fixed top-[73px] left-0 w-full bg-white border-b border-slate-200 z-50 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-bold text-sm tracking-tight">Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-slate-200 flex-col z-20 shadow-sm overflow-y-auto">
        <div className="p-8 pb-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 group-hover:scale-105 transition-transform">
              <img src={logo} alt="Logo" className="h-6 w-6 object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">HEALTHMAP</h1>
              <p className="text-[10px] font-black text-teal-600 tracking-widest uppercase mt-1">Identity Protocol</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group relative ${
                isActive(item.path)
                  ? "bg-teal-600 text-white shadow-xl shadow-teal-200 border-b-2 border-teal-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-6"
              }`}
            >
              <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-teal-600"}`} />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
              {item.badge && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-100 animate-in zoom-in duration-300">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex items-center gap-3 mb-6 group cursor-default">
            <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-lg group-hover:rotate-6 transition-transform shrink-0 overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                userName.charAt(0)
              )}
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-xs font-black text-slate-900 truncate uppercase tracking-widest leading-none mb-1">{userName}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{userRole}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-100"
          >
            <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
            <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50/30 relative">
        <div className="max-w-7xl mx-auto p-4 md:p-10 min-h-screen">
            <Outlet />
        </div>
        
        {/* Modern decorative element */}
        <div className="fixed top-0 right-0 w-2/3 h-1/2 bg-gradient-to-bl from-teal-500/5 to-transparent -z-10 blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-500/5 to-transparent -z-10 blur-[120px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default Layout;
