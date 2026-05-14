import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ComplaintReport() {
  const [stats, setStats] = useState({
    pending: 0,
    actionTaken: 0,
    completed: 0,
    closed: 0,
    total: 0
  });
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      setFilteredComplaints(
        complaints.filter((c) => c.status === selectedStatus)
      );
    } else {
      setFilteredComplaints(complaints);
    }
  }, [selectedStatus, complaints]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("API_URL/complaint-stats");
      setStats(response.data);
    } catch (err) {
      setError("Error fetching statistics: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get("API_URL/complaints");
      setComplaints(response.data);
    } catch (err) {
      setError("Error fetching complaints: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, count, color }) => (
    <div className={`${color} text-white p-6 rounded-lg shadow-lg`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Complaint Report Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Section */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Pending"
          count={stats.pending}
          color="bg-yellow-500"
        />
        <StatCard
          title="Action Taken"
          count={stats.actionTaken}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          count={stats.completed}
          color="bg-green-500"
        />
        <StatCard
          title="Closed"
          count={stats.closed}
          color="bg-red-500"
        />
        <StatCard
          title="Total"
          count={stats.total}
          color="bg-purple-500"
        />
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        >
          <option value="">All Complaints</option>
          <option value="Pending">Pending</option>
          <option value="Action Taken">Action Taken</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Complaints History Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-xl font-bold p-4 border-b">Complaint History</h2>

        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No complaints found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Taluk</th>
                <th className="p-3 text-left">GP</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <React.Fragment key={complaint._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{complaint._id.slice(-8)}</td>
                    <td className="p-3 text-sm">{complaint.category}</td>
                    <td className="p-3 text-sm">{complaint.taluk}</td>
                    <td className="p-3 text-sm">{complaint.gramPanchayat}</td>
                    <td className="p-3">
                      <span
                        className={`p-1 rounded text-sm font-semibold text-white ${
                          complaint.status === "Pending"
                            ? "bg-yellow-500"
                            : complaint.status === "Action Taken"
                            ? "bg-blue-500"
                            : complaint.status === "Completed"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          setShowDetails(
                            showDetails === complaint._id ? null : complaint._id
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        {showDetails === complaint._id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                  {showDetails === complaint._id && (
                    <tr className="bg-blue-50">
                      <td colSpan="7" className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold">Remarks:</p>
                            <p className="text-sm">{complaint.remarks || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Location:</p>
                            <p className="text-sm">
                              Lat: {complaint.latitude}, Long: {complaint.longitude}
                            </p>
                          </div>
                          {complaint.image && (
                            <div>
                              <p className="font-semibold">Image:</p>
                              <img
                                src={complaint.image}
                                alt="complaint"
                                className="w-32 h-32 object-cover rounded mt-2"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">Created:</p>
                            <p className="text-sm">
                              {new Date(complaint.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
