import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Wallet, FileText, Settings, LogOut, LayoutDashboard,
  CheckCircle, XCircle, Clock, Plus, ArrowRightLeft, DollarSign, Menu, X
} from 'lucide-react';

// --- DUMMY DATA ---
// Dalam aplikasi nyata, data ini akan datang dari backend/database
const DUMMY_USERS = [
  { id: 'u1', name: 'Bapak Owner', role: 'owner', email: 'owner@koperasi.com' },
  { id: 'u2', name: 'Mbak Admin', role: 'admin', email: 'admin@koperasi.com' },
  { id: 'u3', name: 'Budi Santoso', role: 'member', email: 'budi@gmail.com', balance: { pokok: 100000, wajib: 500000, sukarela: 1500000 } },
  { id: 'u4', name: 'Siti Aminah', role: 'member', email: 'siti@gmail.com', balance: { pokok: 100000, wajib: 300000, sukarela: 500000 } }
];

const DUMMY_TRANSACTIONS = [
  { id: 't1', userId: 'u3', type: 'deposit', category: 'sukarela', amount: 500000, date: '2023-10-25' },
  { id: 't2', userId: 'u4', type: 'deposit', category: 'wajib', amount: 50000, date: '2023-10-26' }
];

const DUMMY_LOANS = [
  { id: 'l1', userId: 'u3', amount: 5000000, tenor: 12, status: 'pending', date: '2023-10-27' },
  { id: 'l2', userId: 'u4', amount: 2000000, tenor: 6, status: 'approved', date: '2023-10-20' }
];

// --- UTILS ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null means not logged in
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for App Data
  const [users, setUsers] = useState(DUMMY_USERS);
  const [loans, setLoans] = useState(DUMMY_LOANS);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);

  // Authentication Simulator
  const login = (email, password) => {
    // Basic simulation: check if user exists by email. Ignoring password for demo simplicity.
    const user = users.find(u => u.email === email);
    if (user && password === 'admin123') { // Hardcoded password for demo
      setCurrentUser(user);
      setIsMobileMenuOpen(false);
      return { success: true };
    } else if (user) {
        return { success: false, message: 'Kata sandi salah.' };
    }
    return { success: false, message: 'Email tidak ditemukan.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar 
        user={currentUser} 
        onLogout={logout} 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-2">
            <img src="/artifacts/Gemini_Generated_Image_hy5rqahy5rqahy5r.jpg" alt="Logo" className="w-8 h-8 rounded-md object-cover" />
            <h1 className="text-xl font-bold text-slate-800">Koperasi Sinjam</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-md">
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Selamat datang, {currentUser.name} 👋
                </h2>
                <p className="text-gray-500">Masuk sebagai: <span className="capitalize font-medium text-blue-600">{currentUser.role}</span></p>
             </div>

            {/* Role-Based Rendering */}
            {currentUser.role === 'member' && <MemberDashboard user={currentUser} loans={loans} transactions={transactions} setLoans={setLoans} />}
            {currentUser.role === 'admin' && <AdminDashboard users={users} loans={loans} setLoans={setLoans} />}
            {currentUser.role === 'owner' && <OwnerDashboard users={users} loans={loans} transactions={transactions} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = onLogin(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleDemoFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[#0f172a] transform -skew-y-6 origin-top-left -z-10 shadow-2xl"></div>
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-md border-4 border-white">
             <img src="/artifacts/Gemini_Generated_Image_hy5rqahy5rqahy5r.jpg" alt="Koperasi Sinjam Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Koperasi Sinjam</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Portal Keuangan Terpadu</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">Alamat Email</label>
            <input 
              id="email"
              type="email" 
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a] outline-none transition-all shadow-sm"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
               <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Kata Sandi</label>
               <a href="#" className="text-xs text-[#0f172a] hover:underline font-medium">Lupa Sandi?</a>
            </div>
            <input 
              id="password"
              type="password" 
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a] outline-none transition-all shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-3.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 mt-2">
            Masuk ke Dasbor
          </button>
        </form>

        {/* Demo Helper */}
        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-center text-slate-500 mb-3 font-semibold uppercase tracking-wider">Akses Cepat Demo</p>
           <div className="flex justify-center gap-2">
             <button type="button" onClick={() => handleDemoFill('owner@koperasi.com')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">Owner</button>
             <button type="button" onClick={() => handleDemoFill('admin@koperasi.com')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">Admin</button>
             <button type="button" onClick={() => handleDemoFill('budi@gmail.com')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">Member</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, onLogout, isOpen, setIsOpen }) {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', showFor: ['owner', 'admin', 'member'] },
    { icon: <Users size={20} />, label: 'Anggota', showFor: ['owner', 'admin'] },
    { icon: <FileText size={20} />, label: 'Pinjaman', showFor: ['owner', 'admin', 'member'] },
    { icon: <ArrowRightLeft size={20} />, label: 'Transaksi', showFor: ['admin'] },
    { icon: <Settings size={20} />, label: 'Pengaturan', showFor: ['owner'] },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
             <img src="/artifacts/Gemini_Generated_Image_hy5rqahy5rqahy5r.jpg" alt="Logo" className="w-10 h-10 rounded-lg bg-white p-0.5 object-cover" />
             <h2 className="text-xl font-bold text-white tracking-wide">
               Koperasi Sinjam
             </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            item.showFor.includes(user.role) && (
              <a key={index} href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </a>
            )
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-800 rounded-xl">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold">
               {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </div>
    </>
  );
}

// --- DASHBOARDS ---

function MemberDashboard({ user, loans, transactions, setLoans }) {
  const [showLoanModal, setShowLoanModal] = useState(false);
  const myLoans = loans.filter(l => l.userId === user.id);
  const totalBalance = user.balance.pokok + user.balance.wajib + user.balance.sukarela;

  const handleApplyLoan = (amount, tenor) => {
    const newLoan = {
      id: `l${Date.now()}`,
      userId: user.id,
      amount: parseInt(amount),
      tenor: parseInt(tenor),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setLoans([newLoan, ...loans]);
    setShowLoanModal(false);
    alert('Pengajuan pinjaman berhasil dikirim!');
  };

  return (
    <div className="space-y-6">
      {/* Saldo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Saldo Simpanan" value={formatRupiah(totalBalance)} icon={<Wallet />} color="bg-blue-500" />
        <StatCard title="Simpanan Wajib" value={formatRupiah(user.balance.wajib)} icon={<DollarSign />} color="bg-teal-500" />
        <StatCard title="Simpanan Sukarela" value={formatRupiah(user.balance.sukarela)} icon={<DollarSign />} color="bg-green-500" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setShowLoanModal(true)} className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl w-32 transition-colors border border-blue-100">
            <div className="bg-blue-500 p-2 rounded-full text-white mb-2"><Plus size={20} /></div>
            <span className="text-sm font-medium text-blue-700">Ajukan Pinjaman</span>
          </button>
           <button className="flex flex-col items-center justify-center p-4 bg-teal-50 hover:bg-teal-100 rounded-xl w-32 transition-colors border border-teal-100">
            <div className="bg-teal-500 p-2 rounded-full text-white mb-2"><ArrowRightLeft size={20} /></div>
            <span className="text-sm font-medium text-teal-700">Setor Simpanan</span>
          </button>
        </div>
      </div>

      {/* Status Pinjaman */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Riwayat Pengajuan Pinjaman</h3>
        {myLoans.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">Belum ada riwayat pinjaman.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-3 font-medium rounded-tl-lg">Tanggal</th>
                  <th className="p-3 font-medium">Nominal</th>
                  <th className="p-3 font-medium">Tenor</th>
                  <th className="p-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 text-sm text-gray-600">{loan.date}</td>
                    <td className="p-3 font-medium text-gray-800">{formatRupiah(loan.amount)}</td>
                    <td className="p-3 text-sm text-gray-600">{loan.tenor} Bulan</td>
                    <td className="p-3">
                      <StatusBadge status={loan.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showLoanModal && <LoanApplicationModal onClose={() => setShowLoanModal(false)} onSubmit={handleApplyLoan} />}
    </div>
  );
}

function AdminDashboard({ users, loans, setLoans }) {
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const membersCount = users.filter(u => u.role === 'member').length;

  const handleApprove = (loanId) => {
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'approved' } : l));
  };
  
  const handleReject = (loanId) => {
    setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'rejected' } : l));
  };

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown';

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total Anggota" value={membersCount} icon={<Users />} color="bg-purple-500" />
        <StatCard title="Menunggu Persetujuan" value={pendingLoans.length} icon={<Clock />} color="bg-orange-500" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-semibold text-gray-800">Verifikasi Pinjaman</h3>
           <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-xs font-semibold">{pendingLoans.length} Antrean</span>
        </div>
        
        {pendingLoans.length === 0 ? (
           <div className="text-center py-8">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
               <CheckCircle className="text-gray-400" size={32} />
             </div>
             <p className="text-gray-500 font-medium">Semua pengajuan sudah diproses.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {pendingLoans.map(loan => (
              <div key={loan.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{getUserName(loan.userId)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Pengajuan: <span className="font-medium text-gray-700">{formatRupiah(loan.amount)}</span> selama {loan.tenor} bulan
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Tanggal: {loan.date}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => handleApprove(loan.id)} className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <CheckCircle size={16} /> Setujui
                  </button>
                  <button onClick={() => handleReject(loan.id)} className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200">
                    <XCircle size={16} /> Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OwnerDashboard({ users, loans, transactions }) {
  const membersCount = users.filter(u => u.role === 'member').length;
  
  // Calculate total assets (simplified for demo: sum of all member balances)
  const totalAssets = users.reduce((acc, user) => {
    if (user.role === 'member' && user.balance) {
      return acc + user.balance.pokok + user.balance.wajib + user.balance.sukarela;
    }
    return acc;
  }, 0);

  // Calculate total active loans (approved)
  const totalActiveLoans = loans.filter(l => l.status === 'approved').reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="space-y-6">
      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Aset (Simpanan)" value={formatRupiah(totalAssets)} icon={<Wallet />} color="bg-indigo-600" />
        <StatCard title="Total Dana Keluar (Pinjaman)" value={formatRupiah(totalActiveLoans)} icon={<DollarSign />} color="bg-rose-500" />
        <StatCard title="Total Anggota Aktif" value={membersCount} icon={<Users />} color="bg-teal-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Summary Report */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Laporan Kas Singkat</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-800 font-medium">Kas Tersedia</span>
                <span className="text-indigo-900 font-bold">{formatRupiah(totalAssets - totalActiveLoans)}</span>
             </div>
             <div className="p-4 border border-gray-100 rounded-xl">
                 <p className="text-sm text-gray-500 mb-2">Kesehatan Koperasi (Rasio Pinjaman vs Aset)</p>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((totalActiveLoans/totalAssets)*100, 100)}%` }}></div>
                 </div>
                 <p className="text-xs text-right mt-1 font-medium text-gray-600">{Math.round((totalActiveLoans/totalAssets)*100)}% Terpinjam</p>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold mb-4 text-gray-800">Aktivitas Terbaru</h3>
           <div className="space-y-3">
              {transactions.map(t => {
                const user = users.find(u => u.id === t.userId);
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                     <div className="bg-green-100 p-2 rounded-full text-green-600"><Plus size={16} /></div>
                     <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">Setor {t.category}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-green-600">+{formatRupiah(t.amount)}</p>
                        <p className="text-xs text-gray-400">{t.date}</p>
                     </div>
                  </div>
                )
              })}
           </div>
        </div>
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200'
  };
  
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function LoanApplicationModal({ onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [tenor, setTenor] = useState('6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount < 500000) {
      alert('Minimal pinjaman adalah Rp 500.000');
      return;
    }
    onSubmit(amount, tenor);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Ajukan Pinjaman</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Pinjaman (Rp)</label>
            <input 
              type="number" 
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              placeholder="Contoh: 5000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tenor (Bulan)</label>
            <select 
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              value={tenor}
              onChange={(e) => setTenor(e.target.value)}
            >
              <option value="3">3 Bulan</option>
              <option value="6">6 Bulan</option>
              <option value="12">12 Bulan</option>
              <option value="24">24 Bulan</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
            <p className="text-sm text-blue-800 flex justify-between">
              <span>Estimasi Cicilan Pokok:</span>
              <span className="font-bold">{amount ? formatRupiah(amount / tenor) : 'Rp 0'} /bln</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">*Belum termasuk jasa/bunga koperasi.</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
              Batal
            </button>
            <button type="submit" className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-blue-500/20">
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}