import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, Camera, Save, X, CheckCircle } from "lucide-react";
import API from "../services/api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const userRole = localStorage.getItem("role") || localStorage.getItem("userRole");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const route = userRole === 'patient' ? '/patient/dashboard' : `/${userRole}/dashboard`;
        const res = await API.get(route);
        const responseData = res.data?.doctor || res.data;
        setData(responseData);
        setFormData(responseData);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userRole]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-12 w-12 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Loading profile data...</p>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
        <X className="h-6 w-6" />
      </div>
      <p className="text-slate-500 font-medium">Failed to load profile. Please try again later.</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold">Retry</button>
    </div>
  );

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setUploading(true);
      const res = await API.post("/auth/update-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setData(prev => ({ ...prev, profilePic: res.data.profilePic }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await API.put(`/${userRole}/profile`, formData);
      setData(res.data);
      setFormData(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile", err);
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData(data);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <User className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Account Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 font-medium">Manage your identity and account details</p>
      </div>

      {/* Profile Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2rem] shadow-xl shadow-teal-100 p-8 text-white min-h-[200px] flex items-center">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-28 w-28 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center text-white font-bold text-4xl shadow-xl overflow-hidden">
              {data.profilePic ? (
                <img src={data.profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                data.name ? data.name.charAt(0) : "?"
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-white text-teal-600 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Camera className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
              <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} disabled={uploading} />
            </label>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-black tracking-tight">{data.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                {userRole}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/30 text-emerald-50 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-400/30 backdrop-blur-sm">
                <CheckCircle className="h-3 w-3" />
                Verified Account
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "personal" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <User className="h-4 w-4" />
            Personal Information
            {activeTab === "personal" && <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-600 rounded-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "contact" ? "text-teal-600" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Mail className="h-4 w-4" />
            Contact Details
            {activeTab === "contact" && <div className="absolute bottom-0 left-0 w-full h-1 bg-teal-600 rounded-full"></div>}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 max-w-4xl border-b-4 border-b-teal-600/10">
          {activeTab === "personal" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {userRole === 'hospital' ? 'Hospital Name' : userRole === 'doctor' ? 'Doctor Name' : 'Full Name'}
                </label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                  <input type="text" value={formData?.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {userRole === 'hospital' ? 'Registration Number' : userRole === 'doctor' ? 'License Number' : 'Official Identification'}
                </label>
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold flex justify-between items-center group">
                  <input type="text" value={userRole === 'doctor' ? formData?.licenseNumber : (formData?.medicalId || formData?.doctorId || formData?.hospitalId || formData?.registrationNumber || "")} disabled className="bg-transparent outline-none select-none w-full" />
                  <Shield className="h-4 w-4 opacity-50 shrink-0" />
                </div>
              </div>
              {userRole !== 'hospital' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gender</label>
                  <select value={formData?.gender || ""} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer appearance-none">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
              {userRole === 'patient' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Blood Group</label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <input type="text" value={formData?.bloodGroup || ""} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} placeholder="e.g., A+" className="w-full bg-transparent outline-none" />
                  </div>
                </div>
              )}
              {userRole === 'doctor' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specialty</label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                    <input type="text" value={formData?.specialty || ""} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="e.g., Cardiology" className="w-full bg-transparent outline-none" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold flex items-center gap-3">
                  <Mail className="h-4 w-4 text-teal-600" />
                  <input type="email" value={formData?.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent outline-none" />
                </div>
              </div>
              {userRole !== 'hospital' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold flex items-center gap-3">
                    <Phone className="h-4 w-4 text-teal-600" />
                    <input type="tel" value={formData?.phoneNumber || ""} onChange={e => setFormData({...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, "")})} className="w-full bg-transparent outline-none" />
                  </div>
                </div>
              )}
              {userRole !== 'patient' && (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical / Work Address</label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-teal-600 mt-0.5" />
                    <textarea rows="3" className="w-full bg-transparent outline-none resize-none" defaultValue="123 Medical Way, Health City"></textarea>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Shield className="h-3 w-3" />
              Your data is encrypted and secure.
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDiscard} disabled={saving} className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50">Discard</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 bg-teal-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
