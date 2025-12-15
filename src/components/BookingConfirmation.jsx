import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Stethoscope, FileText, Download, Send } from 'lucide-react';
import './BookingConfirmation.css';

function BookingConfirmation({ bookingData, onViewAppointments, onBackToBooking }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    setShowConfetti(true);
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2
    }));
    setConfettiPieces(pieces);

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const content = `
APPOINTMENT CONFIRMATION
========================

Booking ID: ${bookingData.id.slice(0, 8).toUpperCase()}
Status: ${bookingData.status.toUpperCase()}

PATIENT DETAILS
---------------
Name: ${bookingData.patient_name}
Email: ${bookingData.patient_email}
Phone: ${bookingData.patient_phone}

APPOINTMENT DETAILS
------------------
Date: ${new Date(bookingData.appointment_date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}
Time: ${bookingData.appointment_time}
Department: ${bookingData.department}
Doctor: ${bookingData.doctor_name}

SYMPTOMS/REASON
--------------
${bookingData.symptoms}

Please arrive 15 minutes before your scheduled time.
Bring a valid ID and any relevant medical records.

Thank you for choosing our healthcare services!
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${bookingData.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSendSMS = () => {
    alert('SMS confirmation sent to ' + bookingData.patient_phone);
  };

  return (
    <div className="confirmation-container">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className="confetti"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="confirmation-content">
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <CheckCircle size={80} />
          </div>
          <div className="success-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>

        <h1 className="confirmation-title">Appointment Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your appointment has been successfully booked. We've sent a confirmation to your email.
        </p>

        <div className="booking-id-card">
          <span className="booking-id-label">Booking ID</span>
          <span className="booking-id-value">{bookingData.id.slice(0, 8).toUpperCase()}</span>
          <div className="status-badge">
            <span className="status-dot"></span>
            {bookingData.status}
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-card">
            <div className="detail-icon calendar-icon">
              <Calendar size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Appointment Date</span>
              <span className="detail-value">
                {new Date(bookingData.appointment_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon clock-icon">
              <Clock size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Time Slot</span>
              <span className="detail-value">{bookingData.appointment_time}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon doctor-icon">
              <Stethoscope size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Doctor</span>
              <span className="detail-value">{bookingData.doctor_name}</span>
              <span className="detail-subdesc">{bookingData.department}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon patient-icon">
              <User size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Patient Name</span>
              <span className="detail-value">{bookingData.patient_name}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon email-icon">
              <Mail size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <span className="detail-value">{bookingData.patient_email}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon phone-icon">
              <Phone size={24} />
            </div>
            <div className="detail-content">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{bookingData.patient_phone}</span>
            </div>
          </div>
        </div>

        <div className="symptoms-card">
          <div className="symptoms-header">
            <FileText size={20} />
            <span>Symptoms / Reason for Visit</span>
          </div>
          <p className="symptoms-text">{bookingData.symptoms}</p>
        </div>

        <div className="action-buttons">
          <button onClick={handleDownload} className="action-btn download-btn">
            <Download size={20} />
            Download Details
          </button>
          <button onClick={handleSendSMS} className="action-btn sms-btn">
            <Send size={20} />
            Send SMS
          </button>
        </div>

        <div className="navigation-buttons">
          <button onClick={onViewAppointments} className="nav-btn primary-btn">
            View All Appointments
          </button>
          <button onClick={onBackToBooking} className="nav-btn secondary-btn">
            Book Another Appointment
          </button>
        </div>

        <div className="info-box">
          <div className="info-icon">ℹ️</div>
          <div className="info-text">
            <strong>Important:</strong> Please arrive 15 minutes before your scheduled time.
            Bring a valid ID and any relevant medical records or previous prescriptions.
          </div>
        </div>
      </div>

      <div className="decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
