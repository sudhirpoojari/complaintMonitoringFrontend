import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import ImageModal from "./ImageModal";

export default function Dashboard() {
  const [stats, setStats] = useState({ pending: 0, actionTaken: 0, completed: 0, closed: 0, total: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: "" });
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch logic using the globally configured axios interceptor (with auth token)
        const [statsRes, complaintsRes] = await Promise.all([
          axios.get("http://localhost:3000/complaint-stats"),
          axios.get("http://localhost:3000/complaints")
        ]);
        
        setStats(statsRes.data);
        setComplaints(complaintsRes.data);
      } catch (err) {
        setError("Failed to load dashboard data. " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const downloadReport = async (type) => {
    try {
      if (type === 'pdf') setDownloadingPdf(true);
      else setDownloadingExcel(true);

      // responseType: 'blob' is crucial for downloading files via Axios
      const response = await axios.get(`http://localhost:3000/complaints/export/${type}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Complaint_Report.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(`Failed to download ${type.toUpperCase()} report.`);
    } finally {
      setDownloadingPdf(false);
      setDownloadingExcel(false);
    }
  };

  // Sidebar Navigation Links
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "File Complaint", path: "/complaint", icon: "M12 4v16m8-8H4" },
    { name: "My Reports", path: "/complaint-report", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-800">
          <span className="text-xl font-bold tracking-wider text-blue-400">CitizenPortal</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link, idx) => (
            <Link key={idx} to={link.path} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} /></svg>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link to="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/complaint" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Complaint
            </Link>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 text-blue-700 font-bold">
              U
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">{error}</div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div><p className="text-sm text-slate-500 font-medium">Total Complaints</p><p className="text-2xl font-bold text-slate-800">{stats.total}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div><p className="text-sm text-slate-500 font-medium">Pending</p><p className="text-2xl font-bold text-slate-800">{stats.pending}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div><p className="text-sm text-slate-500 font-medium">In Progress</p><p className="text-2xl font-bold text-slate-800">{stats.actionTaken}</p></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div><p className="text-sm text-slate-500 font-medium">Completed</p><p className="text-2xl font-bold text-slate-800">{stats.completed}</p></div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">My Recent Complaints</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => downloadReport('pdf')} 
                  disabled={downloadingPdf || complaints.length === 0} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 rounded-md text-xs font-semibold transition border border-red-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {downloadingPdf ? "Generating..." : "Export PDF"}
                </button>
                <button 
                  onClick={() => downloadReport('excel')} 
                  disabled={downloadingExcel || complaints.length === 0} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800 rounded-md text-xs font-semibold transition border border-green-100 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {downloadingExcel ? "Generating..." : "Export Excel"}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Complaint ID</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Photo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">Loading complaints...</td></tr>
                  ) : complaints.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">No complaints found. File a new complaint to get started!</td></tr>
                  ) : (
                    complaints.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">#{c._id.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{c.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div>{c.taluk}</div>
                          <div className="text-xs text-slate-400">{c.gramPanchayat}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            c.status === 'Closed' ? 'bg-red-100 text-red-800' :
                            c.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            (c.status === 'Action Taken' || c.status === 'In Progress') ? 'bg-indigo-100 text-indigo-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {c.image ? (
                            <button onClick={() => setImageModal({ isOpen: true, imageUrl: c.image })} className="relative group block w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <img src={c.image} alt="thumbnail" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </div>
                            </button>
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium italic">N/A</div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Reuse Image Modal */}
      <ImageModal isOpen={imageModal.isOpen} imageUrl={imageModal.imageUrl} onClose={() => setImageModal({ isOpen: false, imageUrl: "" })} />
    </div>
  )
}
