import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Video,
  Bell,
  LogOut,
} from "lucide-react";
import "./DoctorDashboard.css";

function DoctorDashboard({ onLogout }) {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const today = new Date().toISOString().split("T")[0];

      const todayApts = data.filter((apt) => apt.appointment_date === today);
      const pending = data.filter((apt) => apt.status === "pending");
      const approved = data.filter((apt) => apt.status === "confirmed");

      setTodayAppointments(todayApts);
      setPendingRequests(pending);
      setApprovedAppointments(approved);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Update appointment status (Approve / Reject)
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAppointments(); // refresh list
      setSelectedAppointment(null); // close modal
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update appointment");
    }
  };

  const stats = {
    today: todayAppointments.length,
    pending: pendingRequests.length,
    approved: approvedAppointments.length,
    total:
      todayAppointments.length +
      pendingRequests.length +
      approvedAppointments.length,
  };

  const renderAppointmentList = (appointments, showActions = false) => {
    if (appointments.length === 0) {
      return (
        <div className="empty-list">
          <AlertCircle size={48} />
          <p>No appointments</p>
        </div>
      );
    }

    return (
      <div className="appointments-list">
        {appointments.map((apt, index) => (
          <div
            key={apt._id}
            className="appointment-item"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedAppointment(apt)}
          >
            <div className="apt-header">
              <div className="apt-patient">
                <div className="patient-avatar">
                  {apt.patient_name.charAt(0).toUpperCase()}
                </div>
                <div className="patient-details">
                  <h4>{apt.patient_name}</h4>
                  <p className="dept-tag">{apt.department}</p>
                </div>
              </div>
              <div className={`apt-status ${apt.status}`}>{apt.status}</div>
            </div>

            <div className="apt-times">
              <div className="time-info">
                <Calendar size={16} />
                <span>
                  {new Date(apt.appointment_date).toLocaleDateString()}
                </span>
              </div>
              <div className="time-info">
                <Clock size={16} />
                <span>{apt.appointment_time}</span>
              </div>
            </div>

            {showActions && (
              <div className="apt-actions">
                {apt.status === "pending" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(apt._id, "confirmed");
                      }}
                    >
                      Approve
                    </button>

                    <button
                      className="btn-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(apt._id, "cancelled");
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                {apt.status === "confirmed" && (
                  <>
                    <button className="btn-video">Join Call</button>
                    <button className="btn-manage">Manage</button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <div className="doctor-welcome">
            <div className="welcome-icon">👨‍⚕️</div>
            <div>
              <h1>Dr. Dashboard</h1>
              <p>Manage your appointments and consultations</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="notification-bar">
          <Bell size={20} />
          <span className="notification-text">
            You have {stats.pending} pending appointment requests
          </span>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total</span>
            <span className="stat-number">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card stat-today">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Today</span>
            <span className="stat-number">{stats.today}</span>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-number">{stats.pending}</span>
          </div>
        </div>

        <div className="stat-card stat-approved">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Confirmed</span>
            <span className="stat-number">{stats.approved}</span>
          </div>
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            <Calendar size={18} />
            Today's Appointments
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <AlertCircle size={18} />
            Pending Requests
          </button>
          <button
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <CheckCircle size={18} />
            Confirmed Appointments
          </button>
        </div>

        <div className="content-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : (
            <>
              {activeTab === "today" &&
                renderAppointmentList(todayAppointments)}
              {activeTab === "pending" &&
                renderAppointmentList(pendingRequests, true)}
              {activeTab === "approved" &&
                renderAppointmentList(approvedAppointments, true)}
            </>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAppointment(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedAppointment(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Name</span>
                    <span className="value">
                      {selectedAppointment.patient_name}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email</span>
                    <span className="value">
                      {selectedAppointment.patient_email}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone</span>
                    <span className="value">
                      {selectedAppointment.patient_phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Appointment Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">
                      {new Date(
                        selectedAppointment.appointment_date
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time</span>
                    <span className="value">
                      {selectedAppointment.appointment_time}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Department</span>
                    <span className="value">
                      {selectedAppointment.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Symptoms/Reason</h3>
                <p className="symptoms-text">{selectedAppointment.symptoms}</p>
              </div>

              {selectedAppointment.status === "pending" && (
                <div className="action-buttons">
                  <button
                    className="btn btn-approve-large"
                    onClick={() =>
                      updateStatus(selectedAppointment._id, "confirmed")
                    }
                  >
                    Approve Appointment
                  </button>

                  <button
                    className="btn btn-reject-large"
                    onClick={() =>
                      updateStatus(selectedAppointment._id, "cancelled")
                    }
                  >
                    Reject Appointment
                  </button>
                </div>
              )}

              {selectedAppointment.status === "confirmed" && (
                <div className="action-buttons">
                  <button
                    className="btn btn-video-large"
                    onClick={() =>
                      window.open("https://meet.google.com/new", "_blank")
                    }
                  >
                    <Video size={18} />
                    Join Video Consultation
                  </button>

                  <button className="btn btn-manage-large">
                    Manage Meet Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="decorative-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
