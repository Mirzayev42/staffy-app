import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, LayoutDashboard, Briefcase, Settings, ShieldCheck, Mail, Lock, Plus, Search, X, LogOut, TrendingUp, DollarSign, CheckCircle, XCircle, QrCode } from 'lucide-react';

function App() {
  // --- AUTH & ROLES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  const [loginStep, setLoginStep] = useState(1); 
  const [loginData, setLoginData] = useState({ email: '', password: '', otp: '' });

  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // --- YENİ ƏLAVƏ OLUNAN DATA STATELƏRİ ---
  const [employees, setEmployees] = useState([
    { id: 101, name: "Zaur Əliyev", role: "Menecer", salary: "1200 AZN" }
  ]);
  
  const [cvs, setCvs] = useState([
    { id: 1, date: "24.12.2024", name: "Nicat Qasımov", role: "Kassir", status: "Yeni" },
    { id: 2, date: "23.12.2024", name: "Aysel Məmmədova", role: "Satıcı", status: "Müsahibə" }
  ]);

  // --- QR KOD VƏ FORMA ÜÇÜN MODAL STATE ---
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // CV-ni Təsdiqləyib İşçiyə Çevirmək Funksiyası
  const hireCandidate = (candidate) => {
    // 1. İşçilər siyahısına əlavə et
    const newEmployee = {
      id: Date.now(),
      name: candidate.name,
      role: candidate.role,
      salary: "Təyin edilməyib"
    };
    setEmployees([...employees, newEmployee]);

    // 2. CV siyahısından sil
    setCvs(cvs.filter(item => item.id !== candidate.id));
    alert(`${candidate.name} uğurla işə götürüldü və İşçilər bölməsinə əlavə edildi!`);
  };

  // Yeni CV Müraciəti Funksiyası (Simulyasiya)
  const handleApplyForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCV = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      name: formData.get('name'),
      role: formData.get('role'),
      status: "Yeni"
    };
    setCvs([newCV, ...cvs]);
    setIsApplyModalOpen(false);
    alert("Müraciətiniz Leyla xanıma göndərildi!");
  };

  // --- GİZLİ GİRİŞ VƏ OTP MƏNTİQİ ---
  const handleInitialAuth = async (e) => {
    e.preventDefault();
    if (loginData.email === "superadmin@staffy.com" && loginData.password === "root123") {
      setUser({ fullName: "Rasif (Owner)", role: "SUPER_ADMIN", email: loginData.email });
      setIsLoggedIn(true);
      return;
    }
    if (loginData.email === "leyla@grandmarket.az") {
       setLoginStep(2);
       return;
    }
    setLoginStep(2); 
  };

  const verifyOTPAndLogin = async (e) => {
    e.preventDefault();
    if (loginData.email === "leyla@grandmarket.az") {
        setUser({ fullName: "Leyla Əliyeva", role: "ADMIN", company: "Grand Market", email: loginData.email });
    } else {
        setUser({ fullName: "Şirkət Sahibi", role: "ADMIN", email: loginData.email });
    }
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-[450px]">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-blue-600 italic tracking-tighter">Staffy.</h1>
            <p className="text-slate-400 font-medium mt-2 italic">Professional Management System</p>
          </div>
          {loginStep === 1 ? (
            <form onSubmit={handleInitialAuth} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="email" placeholder="E-mail ünvanınız" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="password" placeholder="Şifrə" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95">Təsdiq Kodu Göndər</button>
            </form>
          ) : (
            <form onSubmit={verifyOTPAndLogin} className="space-y-5 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center bg-blue-50 p-4 rounded-2xl mb-4 text-blue-600 text-sm font-semibold">Emailinizə gələn 6 rəqəmli kodu daxil edin</div>
              <input type="text" placeholder="000000" required maxLength="6" className="w-full p-4 text-center text-3xl tracking-[12px] font-black bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" onChange={(e) => setLoginData({...loginData, otp: e.target.value})} />
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all">Girişi Tamamla</button>
              <button onClick={() => setLoginStep(1)} className="w-full text-slate-400 text-sm font-semibold">Geri qayıt</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-6 shadow-2xl">
        <div className="mb-12 px-4 text-3xl font-black text-blue-500 italic tracking-tighter">Staffy.</div>
        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Analitika" />
          <NavItem active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} icon={<Users size={20}/>} label="İşçilər" />
          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <NavItem active={activeTab === 'cvs'} onClick={() => setActiveTab('cvs')} icon={<Briefcase size={20}/>} label="CV Müraciətləri" />
          )}
          {user.role === 'SUPER_ADMIN' && (
            <div className="pt-8 mt-8 border-t border-slate-800">
              <p className="px-4 text-[10px] text-blue-400/50 font-black uppercase mb-4 tracking-[3px]">Global Admin</p>
              <NavItem active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} icon={<ShieldCheck size={20}/>} label="Bütün Şirkətlər" />
            </div>
          )}
        </nav>
        <button onClick={() => { setIsLoggedIn(false); setLoginStep(1); }} className="flex items-center gap-3 p-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold mt-auto"><LogOut size={20}/> Çıxış</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight">
                {activeTab === 'dashboard' && "Sistem İcmalı"}
                {activeTab === 'companies' && "Şirkətlərin İdarə Edilməsi"}
                {activeTab === 'cvs' && "Müraciət Bazası"}
                {activeTab === 'employees' && "İşçi Heyəti"}
              </h1>
              <p className="text-slate-400 mt-2 font-medium italic">Xoş gəldin, <span className="text-blue-600 font-bold">{user.fullName}</span> {user.company && <span className="text-slate-500">({user.company})</span>} 👋</p>
            </div>
            
            {/* SAĞ YUXARI PROFİL VƏ QR DÜYMƏSİ */}
            <div className="flex gap-4">
              {user.role === 'ADMIN' && (
                <button onClick={() => setIsApplyModalOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <QrCode size={20} className="text-blue-600"/> QR Kodum
                </button>
              )}
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 pr-5">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black uppercase">{user.fullName.charAt(0)}</div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">{user.role}</span>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-700 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Aktiv Vakansiya" value="4" icon={<Briefcase size={24}/>} color="bg-blue-600" />
                <StatCard title="Yeni CV-lər" value={cvs.length.toString()} icon={<TrendingUp size={24}/>} color="bg-emerald-600" />
                <StatCard title="Aktiv İşçilər" value={employees.length.toString()} icon={<Users size={24}/>} color="bg-violet-600" />
              </div>

              {/* QR KODU ANALİTİKA BÖLMƏSİNDƏ GÖRMƏK ÜÇÜN KART */}
              {user.role === 'ADMIN' && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white flex justify-between items-center shadow-2xl shadow-blue-500/20">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Vakansiya QR Kodunuz</h3>
                    <p className="opacity-80 font-medium mb-6 italic text-sm">Bu kodu çap edib mağazanın girişinə vura bilərsiniz. Namizədlər kodu oxudaraq birbaşa müraciət edəcək.</p>
                    <button onClick={() => setIsApplyModalOpen(true)} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all">QR Kodu Aç</button>
                  </div>
                  <div className="bg-white p-4 rounded-[32px] shadow-2xl">
                    <QrCode size={120} className="text-slate-900" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'employees' && (
             <div className="bg-white rounded-[35px] shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 font-black text-slate-500 text-[11px] uppercase tracking-widest">
                    <tr><th className="p-6">ID</th><th className="p-6">Ad Soyad</th><th className="p-6">Vəzifə</th><th className="p-6">Maaş</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-6 text-slate-400">#{emp.id.toString().slice(-4)}</td>
                        <td className="p-6 text-slate-900">{emp.name}</td>
                        <td className="p-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs">{emp.role}</span></td>
                        <td className="p-6 text-emerald-600 font-black">{emp.salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {activeTab === 'cvs' && (
            <div className="animate-in slide-in-from-bottom-5 duration-500">
                <div className="bg-white rounded-[35px] shadow-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 font-black text-slate-500 text-[11px] uppercase tracking-widest">
                      <tr><th className="p-6">Tarix</th><th className="p-6">Namizəd</th><th className="p-6">Vəzifə</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Əməliyyat</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {cvs.map(cv => (
                        <tr key={cv.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-tighter">{cv.date}</td>
                          <td className="p-6 font-bold text-slate-800">{cv.name}</td>
                          <td className="p-6 font-medium text-slate-500">{cv.role}</td>
                          <td className="p-6 text-center"><span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-600">{cv.status}</span></td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => hireCandidate(cv)} title="İşə götür" className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={18}/></button>
                              <button onClick={() => setCvs(cvs.filter(i => i.id !== cv.id))} title="Rədd et" className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><XCircle size={18}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}
      </main>

      {/* QR KOD VƏ FORMA MODALI (SİMULYASİYA) */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase">İş Müraciət Portalı</h3>
                <p className="text-xs opacity-70 font-bold italic tracking-widest">QR Məntiqi və Test Forması</p>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex justify-center flex-col items-center gap-4 bg-slate-50 p-6 rounded-[30px] border border-dashed border-slate-200">
                <QrCode size={150} className="text-slate-800" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Namizəd tərəfindən oxunacaq kod</p>
              </div>

              <div className="border-t border-slate-100 pt-8">
                <p className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 underline underline-offset-4 decoration-blue-500">Müraciət Formasını Yoxla (Test)</p>
                <form onSubmit={handleApplyForm} className="space-y-4">
                  <input name="name" placeholder="Ad və Soyad" required className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                  <select name="role" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                    <option>Kassir</option>
                    <option>Satıcı</option>
                    <option>Anbar işçisi</option>
                  </select>
                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Namizəd kimi göndər</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all font-bold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {icon} <span className="tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl transition-all group">
      <div className={`${color} p-5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{title}</p>
        <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h4>
      </div>
    </div>
  );
}

function CompanyRow({ name, owner, count, status }) {
  return (
    <tr className="p-6 border-b border-slate-50 hover:bg-blue-50/20 font-bold text-slate-700">
      <td className="p-6">{name}</td>
      <td className="p-6 italic text-slate-500">{owner}</td>
      <td className="p-6 text-center">{count}</td>
      <td className="p-6 text-center"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px]">{status}</span></td>
    </tr>
  );
}

export default App;