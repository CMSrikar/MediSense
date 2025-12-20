import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Stethoscope, FileText, Download, Send, Video, Link as LinkIcon, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './BookingConfirmation.css';

function BookingConfirmation({ bookingData, onViewAppointments, onBackToBooking }) {
  // Fallback to localStorage if bookingData prop is lost (e.g. on reload)
  const safeBookingData = bookingData || JSON.parse(localStorage.getItem('lastBooking') || 'null');

  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [isVideoConsultation, setIsVideoConsultation] = useState(false);

  if (!safeBookingData) {
    return (
      <div className="confirmation-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <h2>No booking details found</h2>
        <button onClick={onBackToBooking} className="nav-btn primary-btn" style={{ marginTop: '20px' }}>
          Go to Booking
        </button>
      </div>
    );
  }

  useEffect(() => {
    setShowConfetti(true);
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2
    }));
    setConfettiPieces(pieces);

    // Check if it's a video consultation
    const storedBooking = JSON.parse(localStorage.getItem('lastBooking') || '{}');
    if (storedBooking.consultationType === 'video') {
      setIsVideoConsultation(true);
    }

    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 72, 182); // Blueish
    doc.text("Booking Confirmation", 105, 20, { align: "center" });

    // Appointment Info
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });

    // Doctor & Hospital Section
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Doctor & Hospital Details", 14, 45);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 48, 196, 48);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Doctor: ${safeBookingData.doctor_name || safeBookingData.doctor?.name || 'Dr. Not specified'}`, 14, 58);
    doc.text(`Department: ${safeBookingData.department || 'General Physician'}`, 14, 65);
    doc.text(`Hospital: ${safeBookingData.doctor?.hospital || safeBookingData.hospitalName || 'Main Hospital'}`, 110, 58);
    doc.text(`Address: ${safeBookingData.clinic_address || safeBookingData.doctor?.location || 'Bhimavaram'}`, 110, 65);

    // Patient Section
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Patient Details", 14, 85);
    doc.line(14, 88, 196, 88);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${safeBookingData.patient?.name || safeBookingData.patient_name || 'Not specified'}`, 14, 98);
    doc.text(`Phone: ${safeBookingData.patient?.phone || safeBookingData.patient_phone || 'Not specified'}`, 110, 98);
    doc.text(`Email: ${safeBookingData.patient?.email || safeBookingData.patient_email || 'Not specified'}`, 14, 105);

    // Table for details
    const tableBody = [
      ['Appointment Date', safeBookingData.appointment_date ? new Date(safeBookingData.appointment_date).toLocaleDateString() : (safeBookingData.slot?.displayDate || 'N/A')],
      ['Time Slot', safeBookingData.appointment_time || safeBookingData.slot?.time || 'N/A'],
      ['Consultation Type', isVideoConsultation ? 'Video Consultation' : 'In-Person Visit'],
      ['Symptoms / Note', safeBookingData.symptoms || 'General Checkup']
    ];



    autoTable(doc, {
      startY: 115,
      head: [['Description', 'Details']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [40, 72, 182] },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // Instructions
    const finalY = doc.lastAutoTable.finalY || 150;

    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text("Instructions", 14, finalY + 15);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const instructions = isVideoConsultation
      ? ["1. Join the video link 5 minutes before scheduled time.", "2. Ensure you have a stable internet connection.", "3. Have your medical history ready if needed."]
      : ["1. Please arrive 15 minutes prior to your appointment.", "2. Bring a valid ID proof and this confirmation (digital or print).", "3. Wear a mask if required by safety protocols."];

    instructions.forEach((line, index) => {
      doc.text(line, 14, finalY + 23 + (index * 6));
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing our healthcare services.", 105, 280, { align: "center" });

    doc.save(`appointment-${safeBookingData._id ? safeBookingData._id.slice(0, 8) : 'confirmation'}.pdf`);
  };

  const handleSendSMS = () => {
    alert('SMS confirmation sent to ' + (safeBookingData.patient_phone || 'your phone number'));
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

        <h1 className="confirmation-title">
          📧 Mail Sent Successfully
        </h1>
        <p className="confirmation-subtitle">
          Your appointment request has been sent to the hospital. We have notified them via email.
        </p>

        {/* Booking ID section removed as per request */}
        <div className={`status-badge ${isVideoConsultation ? 'video-status' : ''}`} style={{ margin: '0 auto 20px auto', display: 'table' }}>
          <span className="status-dot"></span>
          {isVideoConsultation ? 'Video Call' : (safeBookingData.status || 'Confirmed')}
        </div>

        {/* Consultation Type Badge */}
        <div className="consultation-type-badge">
          <div className={`type-indicator ${isVideoConsultation ? 'video-type' : 'inperson-type'}`}>
            {isVideoConsultation ? (
              <>
                <Video size={18} />
                <span>Video Consultation</span>
              </>
            ) : (
              <>
                <Stethoscope size={18} />
                <span>In-Person Visit</span>
              </>
            )}
          </div>
        </div>

        {/* Replaced 6-block grid with User Choice Summary */}
        <div className="booking-summary-card">
          <h3>📝 Booking Summary</h3>

          <div className="summary-row">
            <div className="summary-item">
              <span className="label">Doctor</span>
              <span className="value">{safeBookingData.doctor_name || safeBookingData.doctor?.name || 'Dr. Not specified'}</span>
              <span className="sub-value">{safeBookingData.department || 'General Physician'}</span>
            </div>

            <div className="summary-item">
              <span className="label">Hospital</span>
              <span className="value">{safeBookingData.doctor?.hospital || safeBookingData.hospitalName || 'Main Hospital'}</span>
              <span className="sub-value">{safeBookingData.clinic_address || safeBookingData.doctor?.location || 'Bhimavaram'}</span>
            </div>
          </div>

          <div className="summary-row">
            <div className="summary-item">
              <span className="label">Date & Time</span>
              <span className="value">
                {safeBookingData.appointment_date
                  ? new Date(safeBookingData.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                  : (safeBookingData.slot?.displayDate || safeBookingData.slot?.date || 'Date N/A')}
              </span>
              <span className="sub-value">
                {safeBookingData.appointment_time || safeBookingData.slot?.time || 'Time N/A'}
                {safeBookingData.slot?.period ? ` (${safeBookingData.slot.period})` : ''}
              </span>
            </div>

            <div className="summary-item">
              <span className="label">Problem / Symptoms</span>
              <span className="value">{safeBookingData.symptoms || 'General Checkup'}</span>
            </div>
          </div>
        </div>





        <div className="action-buttons">
          <button onClick={handleDownload} className="action-btn download-btn">
            <Download size={20} />
            Download Details
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

        <div className={`info-box ${isVideoConsultation ? 'video-info' : ''}`}>
          <div className="info-icon">ℹ️</div>
          <div className="info-text">
            <strong>Important:</strong> Please wait for further instructions regarding your appointment via email or SMS.
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