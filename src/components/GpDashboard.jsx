import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CloseComplaintModal from "./CloseComplaintModal";
import CompleteComplaintModal from "./CompleteComplaintModal";
import ImageModal from "./ImageModal";
import ActivityTimeline from "./ActivityTimeline";
import API_URL from "../config/api";

// --- Reusable SVG Icons ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Complaints: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Reports: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Bell: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
};

export default function GpDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ pending: 0, actionTaken: 0, closed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gpProfile, setGpProfile] = useState({ name: "Gram Panchayat" });
  const [closeModal, setCloseModal] = useState({ isOpen: false, complaintId: null });
  const [closeLoading, setCloseLoading] = useState(false);
  const [completeModal, setCompleteModal] = useState({ isOpen: false, complaintId: null });
  const [completeLoading, setCompleteLoading] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: "" });
  const [timelineModal, setTimelineModal] = useState({ isOpen: false, activities: [] });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      setLoading(true);
      const [compRes, statsRes] = await Promise.all([
        axios.get("API_URL/complaint/gp", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("API_URL/complaint/gp/stats", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setComplaints(compRes.data);
      setStats(statsRes.data);

      // Try extracting GP info from the first complaint to personalize the header
      if (compRes.data.length > 0) {
        setGpProfile({ name: `${compRes.data[0].gramPanchayat} Panchayat` });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/gp");
  };

  const handleStatusChange = async (id, newStatus) => {
    // Intercept the "Close Case" selection to open the modal instead
    if (newStatus === "Closed") {
      setCloseModal({ isOpen: true, complaintId: id });
      return;
    }
    if (newStatus === "Completed") {
      setCompleteModal({ isOpen: true, complaintId: id });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `API_URL/complaint/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state instantly for better UX
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
      
      setToast(`Complaint status updated to ${newStatus}`);
      setTimeout(() => setToast(""), 3000);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Modal submit handler
  const submitCloseComplaint = async (formData) => {
    setCloseLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `API_URL/complaint/${closeModal.complaintId}/close`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setToast("Complaint closed successfully");
      setCloseModal({ isOpen: false, complaintId: null });
      setTimeout(() => setToast(""), 3000);
      
      fetchData(); // Refresh stats in the background
    } catch (error) {
      console.error("Error closing complaint:", error);
      alert(error.response?.data?.message || "Failed to close complaint.");
    } finally {
      setCloseLoading(false);
    }
  };

  // Complete Action submit handler
  const submitCompleteComplaint = async (formData) => {
    setCompleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `API_URL/complaint/${completeModal.complaintId}/complete`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setToast("Complaint permanently marked as Completed");
      setCompleteModal({ isOpen: false, complaintId: null });
      setTimeout(() => setToast(""), 3000);
      fetchData(); // Refresh list to get accurate stats and status
    } catch (error) {
      console.error("Error completing complaint:", error);
      alert(error.response?.data?.message || "Failed to complete complaint.");
    } finally {
      setCompleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 relative">
      {/* Success Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity z-50">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gram Panchayat Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm">
            <Icons.Logout />
            Logout
          </button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 font-semibold uppercase">Total Complaints</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 font-semibold uppercase">Pending</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-semibold uppercase">Action Taken</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.actionTaken}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 font-semibold uppercase">Closed</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.closed}</p>
          </div>
        </div>

        {/* Complaints Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Complaints</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Citizen Info</th>
                  <th className="p-4 font-semibold">Location / Address</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Photo</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">No complaints found.</td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-sm text-gray-600 font-medium">#{c._id.slice(-6).toUpperCase()}</td>
                      <td className="p-4">
                        <div className="text-sm text-gray-800 font-bold">{c.userId?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{c.userId?.email || "No Email"}</div>
                        <div className="text-xs text-gray-500">{c.userId?.mobile || "No Mobile"}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-800">{c.category}</div>
                        <div className="text-xs text-gray-500">{c.taluk}, {c.gramPanchayat}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={c.remarks}>
                        {c.remarks || "No description provided."}
                      </td>
                      <td className="p-4">
                        {c.image ? (
                          <button
                            onClick={() => setImageModal({ isOpen: true, imageUrl: c.image })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-md text-xs font-semibold transition border border-indigo-100"
                          >
                            <Icons.Eye /> View Photo
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">No Photo</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.status === 'Closed' ? 'bg-green-100 text-green-800' :
                          (c.status === 'Action Taken' || c.status === 'In Progress') ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          {c.status === 'Closed' ? (
                            <div className="block text-center text-sm text-red-600 font-bold italic bg-red-50 py-1.5 rounded-md border border-red-200">
                              Closed (Permanent)
                            </div>
                          ) : (
                            <select
                              className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white border shadow-sm cursor-pointer"
                              value={c.status}
                              onChange={(e) => handleStatusChange(c._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Action Taken">Action Taken</option>
                              <option value="Completed">Completed</option>
                              <option value="Closed">Closed</option>
                            </select>
                          )}
                          <button
                            onClick={() => setTimelineModal({ isOpen: true, activities: c.activities || [] })}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-md text-xs font-semibold transition shadow-sm border border-slate-200"
                          >
                            <Icons.Reports /> View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CloseComplaintModal 
        isOpen={closeModal.isOpen} 
        onClose={() => setCloseModal({ isOpen: false, complaintId: null })} 
        onSubmit={submitCloseComplaint} 
        loading={closeLoading} 
      />
      <CompleteComplaintModal 
        isOpen={completeModal.isOpen} 
        onClose={() => setCompleteModal({ isOpen: false, complaintId: null })} 
        onSubmit={submitCompleteComplaint} 
        loading={completeLoading} 
      />
      <ImageModal 
        isOpen={imageModal.isOpen} 
        imageUrl={imageModal.imageUrl} 
        onClose={() => setImageModal({ isOpen: false, imageUrl: "" })} 
      />
      <ActivityTimeline
        isOpen={timelineModal.isOpen}
        activities={timelineModal.activities}
        onClose={() => setTimelineModal({ isOpen: false, activities: [] })}
      />
    </div>
  );
}