import { useState } from 'react';
import AppointmentBooking from './pages/user/AppointmentBooking';
import BookingConfirmation from './pages/user/BookingConfirmation';
import AppointmentList from './pages/user/AppointmentList';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentManagement from './pages/doctor/AppointmentManagement';
import VideoConsultation from './pages/doctor/VideoConsultation';

function App() {
  const [userRole, setUserRole] = useState('patient');
  const [currentPage, setCurrentPage] = useState('booking');
  const [bookingData, setBookingData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setCurrentPage('confirmation');
  };

  const handleViewAppointments = () => {
    setCurrentPage('list');
  };

  const handleBackToBooking = () => {
    setCurrentPage('booking');
  };

  const handleSwitchRole = (role) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole('patient');
    setCurrentPage('booking');
  };

  const handleManageAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentPage('management');
  };

  const handleStartConsultation = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setCurrentPage('consultation');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="app-container">
      {userRole === 'patient' ? (
        <>
          {currentPage === 'booking' && (
            <AppointmentBooking
              onSuccess={handleBookingSuccess}
              onViewAppointments={handleViewAppointments}
            />
          )}
          {currentPage === 'confirmation' && (
            <BookingConfirmation
              bookingData={bookingData}
              onViewAppointments={handleViewAppointments}
              onBackToBooking={handleBackToBooking}
            />
          )}
          {currentPage === 'list' && (
            <AppointmentList
              onBackToBooking={handleBackToBooking}
            />
          )}
        </>
      ) : (
        <>
          {currentPage === 'dashboard' && (
            <DoctorDashboard
              onLogout={handleLogout}
            />
          )}
          {currentPage === 'management' && (
            <AppointmentManagement
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
            />
          )}
          {currentPage === 'consultation' && (
            <VideoConsultation
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
            />
          )}
        </>
      )}

      {userRole === 'patient' && (
        <button
          onClick={() => handleSwitchRole('doctor')}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '0.75rem 1.5rem',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '600',
            zIndex: '999'
          }}
        >
          👨‍⚕️ Doctor Login
        </button>
      )}
    </div>
  );
}

export default App;