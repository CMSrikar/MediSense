import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, Search, Filter, ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock as ClockPending, Video, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AppointmentList.css';

function AppointmentList({ onBackToBooking }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update appointment status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} />;
      case 'completed':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <XCircle size={20} />;
      case 'pending':
      default:
        return <ClockPending size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <button onClick={onBackToBooking} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1 className="appointments-title">My Appointments</h1>
          <p className="appointments-subtitle">Track and manage all your appointments</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">
            <ClockPending size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>

        <div className="stat-card stat-confirmed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Confirmed</span>
            <span className="stat-value">{stats.confirmed}</span>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by patient, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Calendar size={80} />
          </div>
          <h3>No Appointments Found</h3>
          <p>
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'You haven\'t booked any appointments yet'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button onClick={onBackToBooking} className="book-now-btn">
              Book Your First Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="appointments-grid">
          {filteredAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={`appointment-card ${selectedAppointment?.id === appointment.id ? 'selected' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="card-header">
                <div className={`status-badge ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span>{appointment.status}</span>
                </div>
                <span className="booking-id">#{appointment.id.slice(0, 8).toUpperCase()}</span>
              </div>

              <div className="card-body">
                <div className="patient-info">
                  <div className="patient-avatar">
                    {appointment.patient_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="patient-name">{appointment.patient_name}</h3>
                    <p className="patient-contact">{appointment.patient_email}</p>
                  </div>
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <Calendar size={16} />
                    <span>
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div className="detail-row">
                    <Stethoscope size={16} />
                    <span>{appointment.doctor_name}</span>
                  </div>
                  <div className="detail-row department-tag">
                    {appointment.department}
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {appointment.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(appointment.id, 'confirmed');
                    }}
                    className="action-btn confirm-btn"
                  >
                    Confirm
                  </button>
                )}
                {appointment.status === 'confirmed' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://meet.google.com/new', '_blank');
                      }}
                      className="action-btn video-btn"
                    >
                      <Video size={16} />
                      Join Call
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, 'completed');
                      }}
                      className="action-btn complete-btn"
                    >
                      Complete
                    </button>
                  </>
                )}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(appointment.id, 'cancelled');
                    }}
                    className="action-btn cancel-btn"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(appointment.id);
                  }}
                  className="action-btn delete-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={() => setSelectedAppointment(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className={`modal-status ${getStatusColor(selectedAppointment.status)}`}>
                {getStatusIcon(selectedAppointment.status)}
                <span>{selectedAppointment.status.toUpperCase()}</span>
              </div>

              <div className="modal-section">
                <h4>Patient Information</h4>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <User size={18} />
                    <span>{selectedAppointment.patient_name}</span>
                  </div>
                  <div className="modal-info-item">
                    <span>📧</span>
                    <span>{selectedAppointment.patient_email}</span>
                  </div>
                  <div className="modal-info-item">
                    <span>📱</span>
                    <span>{selectedAppointment.patient_phone}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Appointment Information</h4>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <Calendar size={18} />
                    <span>
                      {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <Clock size={18} />
                    <span>{selectedAppointment.appointment_time}</span>
                  </div>
                  <div className="modal-info-item">
                    <Stethoscope size={18} />
                    <span>{selectedAppointment.doctor_name}</span>
                  </div>
                  <div className="modal-info-item">
                    <span>🏥</span>
                    <span>{selectedAppointment.department}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Symptoms / Reason</h4>
                <p className="symptoms-text">{selectedAppointment.symptoms}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="decorative-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
}

export default AppointmentList;
