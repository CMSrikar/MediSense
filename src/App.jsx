import { useState } from 'react';
import AppointmentBooking from './components/AppointmentBooking';
import BookingConfirmation from './components/BookingConfirmation';
import AppointmentList from './components/AppointmentList';

function App() {
  const [currentPage, setCurrentPage] = useState('booking');
  const [bookingData, setBookingData] = useState(null);

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

  return (
    <div className="app-container">
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
    </div>
  );
}

export default App;
