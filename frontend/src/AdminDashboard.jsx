import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";;
const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];
const PIE_COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#64748B", "#84CC16", "#F97316", "#0EA5E9", "#A855F7", "#14B8A6", "#F43F5E", "#D97706"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showComplaints, setShowComplaints] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");
  const [newRemarks, setNewRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  let user = null;
  try { user = JSON.parse(localStorage.getItem("cci_user") || "null"); } catch { user = null; }

  const loadDashboard = useCallback(async (showRefresh = false) => {
    const token = localStorage.getItem("cci_token");
    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem("cci_user") || "null"); } catch { currentUser = null; }
    if (!token || currentUser?.role !== "admin") {
      navigate("/login", { replace: true });
      setLoading(false);
      return;
    }
    showRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401 || response.status === 403) {
        setError(data?.message || "Admin access denied. Please log in with an admin account.");
        setComplaints([]);
        return;
      }
      if (!response.ok) throw new Error(data?.message || "Could not load complaint records.");
      const records = Array.isArray(data) ? data : Array.isArray(data?.complaints) ? data.complaints : null;
      if (!records) throw new Error("Unexpected complaint response format. Check the backend API.");
      setComplaints(records);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message || "Unable to connect to the backend.");
      setComplaints([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const categories = useMemo(() => complaints.reduce((acc, item) => {
    const name = item.predictedProduct || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}), [complaints]);

  const categoryChartData = useMemo(() => Object.entries(categories)
    .map(([name, count]) => ({ name, value: Number(count) }))
    .filter(item => item.value > 0), [categories]);

  const averageConfidence = useMemo(() => {
    const values = complaints.map(item => Number(item.confidence)).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }, [complaints]);

  const statistics = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(item => (item.status || "Pending") === "Pending").length,
    inProgress: complaints.filter(item => item.status === "In Progress").length,
    resolved: complaints.filter(item => item.status === "Resolved").length,
  }), [complaints]);

  const handleCardClick = status => {
    setSelectedStatus(status);
    setStatusFilter(status);
    setShowComplaints(true);
    setEditingId(null);
  };

  const filteredComplaints = useMemo(() => {
    const search = filter.trim().toLowerCase();
    return complaints.filter(item => {
      const text = String(item.complaint || "").toLowerCase();
      const category = String(item.predictedProduct || "Unknown").toLowerCase();
      const id = String(item._id || item.id || "").toLowerCase();
      const matchesSearch = !search || text.includes(search) || category.includes(search) || id.includes(search);
      const matchesStatus = statusFilter === "All" || (item.status || "Pending") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, filter, statusFilter]);

  async function updateComplaint(item) {
    const id = item._id || item.id;
    if (!id) return setError("This complaint has no valid ID.");
    if (!STATUS_OPTIONS.includes(newStatus)) return setError("Please select a valid status.");
    const token = localStorage.getItem("cci_token");
    if (!token) { navigate("/login", { replace: true }); return; }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/complaints/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status: newStatus, remarks: newRemarks }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Unable to update complaint status.");
      setEditingId(null);
      setNewRemarks("");
      await loadDashboard(true);
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.message || "Unable to update complaint.");
    } finally { setSaving(false); }
  }

  if (loading) return <main className="admin-dashboard dashboard-loading">Loading admin dashboard...</main>;

  return (
    <main className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">CUSTOMER COMPLAINT INTELLIGENCE</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor complaints and ML prediction results.</p>
          <p className="administrator-line">Administrator: {user?.name || user?.email || "Admin"}</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-button" type="button" onClick={() => loadDashboard(true)} disabled={refreshing}>{refreshing ? "Refreshing..." : "Refresh Data"}</button>
          <button className="dashboard-button logout" type="button" onClick={() => { localStorage.removeItem("cci_token"); localStorage.removeItem("cci_user"); navigate("/login", { replace: true }); }}>Log out</button>
        </div>
      </header>

      {error && <div className="dashboard-error" role="alert"><strong>Error:</strong> {error}</div>}

      <section className="stats-grid">
        <button type="button" className={`stat-card ${showComplaints && selectedStatus === "All" ? "active" : ""}`} style={{ "--card-accent": "#5265d9" }} onClick={() => handleCardClick("All")}>
          <span className="stat-card-title">Total Complaints</span><span className="stat-card-value">{statistics.total}</span><span className="stat-card-description">View all complaints →</span>
        </button>
        <div className="stat-card stat-card-static" style={{ "--card-accent": "#8B5CF6" }}>
          <span className="stat-card-title">Complaint Categories</span><span className="stat-card-value">{Object.keys(categories).length}</span><span className="stat-card-description">Unique predicted categories</span>
        </div>
        <div className="stat-card stat-card-static" style={{ "--card-accent": "#06B6D4" }}>
          <span className="stat-card-title">Average Prediction Confidence</span><span className="stat-card-value">{(averageConfidence <= 1 ? averageConfidence * 100 : averageConfidence).toFixed(2)}%</span><span className="stat-card-description">Across available predictions</span>
        </div>
        <button type="button" className={`stat-card ${showComplaints && selectedStatus === "Pending" ? "active" : ""}`} style={{ "--card-accent": "#dc2626" }} onClick={() => handleCardClick("Pending")}>
          <span className="stat-card-title">Pending Complaints</span><span className="stat-card-value status-red">{statistics.pending}</span><span className="stat-card-description">View pending complaints →</span>
        </button>
        <button type="button" className={`stat-card ${showComplaints && selectedStatus === "In Progress" ? "active" : ""}`} style={{ "--card-accent": "#d97706" }} onClick={() => handleCardClick("In Progress")}>
          <span className="stat-card-title">In Progress</span><span className="stat-card-value status-amber">{statistics.inProgress}</span><span className="stat-card-description">View in-progress complaints →</span>
        </button>
        <button type="button" className={`stat-card ${showComplaints && selectedStatus === "Resolved" ? "active" : ""}`} style={{ "--card-accent": "#16a34a" }} onClick={() => handleCardClick("Resolved")}>
          <span className="stat-card-title">Resolved Complaints</span><span className="stat-card-value status-green">{statistics.resolved}</span><span className="stat-card-description">View resolved complaints →</span>
        </button>
      </section>

      <section className="category-chart-card dashboard-section">
        <h2>Complaint Category Distribution</h2>
        <p className="section-description">Visual analysis of complaints classified by the machine learning model.</p>
        {categoryChartData.length === 0 ? (
          <p className="category-legend-empty">{error ? "Complaint categories could not be loaded." : "No complaint records available yet."}</p>
        ) : (
          <>
            <div className="category-chart-layout">
              <div className="category-pie-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={3} stroke="#fff" strokeWidth={2} labelLine={false} label={({ percent }) => percent >= 0.05 ? `${(percent * 100).toFixed(1)}%` : ""}>
                      {categoryChartData.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [Number(value).toLocaleString("en-IN"), name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="category-legend">
                <h3>Complaint Categories</h3>
                {categoryChartData.slice().sort((a, b) => b.value - a.value).map(item => {
                  const colorIndex = categoryChartData.findIndex(category => category.name === item.name);
                  const percentage = statistics.total ? item.value / statistics.total * 100 : 0;
                  return <div className="category-legend-item" key={item.name}>
                    <div className="category-legend-label"><span className="category-legend-dot" style={{ backgroundColor: PIE_COLORS[colorIndex % PIE_COLORS.length] }} /><span>{item.name}</span></div>
                    <span className="category-legend-count">{item.value.toLocaleString("en-IN")} · {percentage.toFixed(1)}%</span>
                  </div>;
                })}
              </div>
            </div>
            <div className="category-total-card"><span>Total Complaints</span><strong>{statistics.total.toLocaleString("en-IN")}</strong></div>
          </>
        )}
      </section>

      <section className="complaints-container dashboard-section">
        <div className="complaints-section-heading">
          <h2>Complaint Records</h2>
          {showComplaints && <div className="active-filter-row">
            <p>Showing: {selectedStatus === "All" ? "All Complaints" : `${selectedStatus} Complaints`}</p>
            <button type="button" className="dashboard-button secondary" onClick={() => { setSelectedStatus("All"); setStatusFilter("All"); setShowComplaints(false); }}>Clear Filter</button>
          </div>}
        </div>
        <div className="complaints-toolbar">
          <div className="complaints-search"><input type="search" placeholder="Search complaints, categories, or IDs..." value={filter} onChange={event => setFilter(event.target.value)} aria-label="Search complaints, categories, or IDs" /></div>
          <div className="complaints-filters"><select value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setSelectedStatus(event.target.value); setShowComplaints(event.target.value !== "All"); }} aria-label="Filter complaints by status">
            <option value="All">All Statuses</option>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
          </select></div>
        </div>
        <p className="complaints-count">Showing {filteredComplaints.length} of {complaints.length} complaints</p>
        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead><tr><th>Complaint</th><th>Predicted Category</th><th>Confidence</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredComplaints.map((item, index) => {
                const id = item._id || item.id || `complaint-${index}`;
                const isEditing = String(editingId) === String(id);
                const confidence = item.confidence != null && Number.isFinite(Number(item.confidence)) ? (Number(item.confidence) <= 1 ? Number(item.confidence) * 100 : Number(item.confidence)) : null;
                const date = item.createdAt && !Number.isNaN(new Date(item.createdAt).getTime()) ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
                return <tr key={id}>
                  <td className="complaint-description">{item.complaint || "No complaint text"}</td>
                  <td><span className="complaint-category">{item.predictedProduct || "Unknown"}</span></td>
                  <td>{confidence === null ? "N/A" : `${confidence.toFixed(2)}%`}</td><td>{date}</td>
                  <td><span className={`status-badge ${item.status === "Resolved" ? "status-resolved" : item.status === "In Progress" ? "status-in-progress" : "status-pending"}`}>{item.status || "Pending"}</span></td>
                  <td>{!isEditing ? <button type="button" className="dashboard-button table-action-button" onClick={() => { setEditingId(id); setNewStatus(item.status || "Pending"); setNewRemarks(item.adminRemarks || ""); setError(""); }}>Update Status</button> :
                    <div className="status-edit-container">
                      <select value={newStatus} onChange={event => setNewStatus(event.target.value)} aria-label="New complaint status">{STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}</select>
                      <textarea placeholder="Admin remarks (optional)" value={newRemarks} onChange={event => setNewRemarks(event.target.value)} rows={2} aria-label="Admin remarks" />
                      <div className="status-edit-actions">
                        <button type="button" disabled={saving} onClick={() => updateComplaint(item)}>{saving ? "Saving..." : "Save"}</button>
                        <button type="button" className="cancel" disabled={saving} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>}
                  </td>
                </tr>;
              })}
              {filteredComplaints.length === 0 && <tr><td colSpan={6} className="complaints-empty">{complaints.length === 0 ? (error ? "Complaints could not be loaded. Check the error above." : "No complaint records available yet.") : "No matching complaints found."}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="dashboard-footer"><span>Customer Complaint Intelligence</span><span>Admin dashboard · Complaint monitoring and classification</span></footer>
    </main>
  );
}
