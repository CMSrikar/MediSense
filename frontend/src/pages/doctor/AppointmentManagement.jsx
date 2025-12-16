import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Link as LinkIcon, Save, X } from 'lucide-react';
import './AppointmentManagement.css';

function AppointmentManagement({ appointmentId, onBack }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetLink, setMeetLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/appointments/${appointmentId}`
    );
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch appointment");

    setAppointment(data);
    setMeetLink(data?.meet_link || "");
  } catch (error) {
    console.error("Error fetching appointment:", error);
    setMessage("Failed to load appointment");
  } finally {
    setLoading(false);
  }
};


  const handleStatusUpdate = async (newStatus) => {
  setActionLoading(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/appointments/${appointmentId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to update status");

    setAppointment(data);
    setMessage(`Appointment ${newStatus}!`);
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Error updating appointment:", error);
    setMessage("Failed to update appointment");
  } finally {
    setActionLoading(false);
  }
};


  const handleSaveMeetLink = async () => {
  if (!meetLink.trim() || !meetLink.includes("meet.google.com")) {
    setMessage("Please enter a valid Google Meet link");
    return;
  }

  setActionLoading(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/appointments/${appointmentId}/meet-link`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meet_link: meetLink }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to save meet link");

    setAppointment(data);
    setIsEditing(false);
    setMessage("Meet link saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Error saving meet link:", error);
    setMessage("Failed to save meet link");
  } finally {
    setActionLoading(false);
  }
};


  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="management-container">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="error-state">
          <p>Appointment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <button onClick={onBack} className="back-btn">
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {message && (
        <div className={`message-toast ${message.includes('success') || message.includes('successfully') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}

      <div className="management-card">
        <div className="management-header">
          <h1>Manage Appointment</h1>
          <div className={`status-badge ${appointment.status}`}>
            {appointment.status}
          </div>
        </div>

        <div className="patient-card">
          <div className="patient-header">
            <div className="patient-avatar">
              {appointment.patient_name.charAt(0).toUpperCase()}
            </div>
            <div className="patient-info">
              <h2>{appointment.patient_name}</h2>
              <p className="dept">{appointment.department}</p>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Appointment Details</h3>
          <div className="details-grid">
            <div className="detail">
              <span className="label">Date</span>
              <span className="value">
                {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="detail">
              <span className="label">Time</span>
              <span className="value">{appointment.appointment_time}</span>
            </div>
            <div className="detail">
              <span className="label">Email</span>
              <span className="value">{appointment.patient_email}</span>
            </div>
            <div className="detail">
              <span className="label">Phone</span>
              <span className="value">{appointment.patient_phone}</span>
            </div>
          </div>
        </div>

        <div className="symptoms-section">
          <h3>Symptoms / Reason for Visit</h3>
          <p className="symptoms">{appointment.symptoms}</p>
        </div>

        {appointment.status === 'pending' && (
          <div className="actions-section pending-actions">
            <h3>Take Action</h3>
            <div className="action-buttons">
              <button
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={actionLoading}
                className="btn btn-approve"
              >
                <CheckCircle size={20} />
                Approve Appointment
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={actionLoading}
                className="btn btn-reject"
              >
                <XCircle size={20} />
                Reject Appointment
              </button>
            </div>
          </div>
        )}

        {appointment.status === 'confirmed' && (
          <div className="meet-link-section">
            <h3>Google Meet Link</h3>

            {!isEditing ? (
              <div className="meet-link-display">
                {appointment.meet_link ? (
                  <div className="link-box">
                    <LinkIcon size={20} />
                    <a href={appointment.meet_link} target="_blank" rel="noopener noreferrer" className="link">
                      {appointment.meet_link}
                    </a>
                    <button
                      onClick={() => window.open(appointment.meet_link, '_blank')}
                      className="btn btn-join"
                    >
                      Join Call
                    </button>
                  </div>
                ) : (
                  <div className="no-link">
                    <p>No Meet link added yet</p>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-edit"
                >
                  {appointment.meet_link ? 'Edit Link' : 'Add Link'}
                </button>
              </div>
            ) : (
              <div className="meet-link-input-section">
                <input
                  type="text"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="input-field"
                />
                <div className="input-actions">
                  <button
                    onClick={handleSaveMeetLink}
                    disabled={actionLoading}
                    className="btn btn-save"
                  >
                    <Save size={18} />
                    Save Link
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setMeetLink(appointment.meet_link || '');
                    }}
                    className="btn btn-cancel"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {appointment.status === 'completed' && (
          <div className="completion-section">
            <div className="completion-icon">✓</div>
            <h3>Appointment Completed</h3>
            <p>This appointment has been marked as completed.</p>
          </div>
        )}

        {appointment.status === 'cancelled' && (
          <div className="cancellation-section">
            <div className="cancellation-icon">✕</div>
            <h3>Appointment Cancelled</h3>
            <p>This appointment has been cancelled.</p>
          </div>
        )}
      </div>

      <div className="decorative">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
}

export default AppointmentManagement;
