// /pages/user/appointment-steps/SlotSelection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SlotSelection.css';

const SlotSelection = ({ selectedDoctor, doctorInfo, onSuccess }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationType, setConsultationType] = useState('in-person'); // Default
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Patient Details State
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        if (!selectedDate) return;

        const response = await fetch(`http://localhost:5000/api/slots?doctorId=${selectedDoctor}&date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDoctor && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleSlotSelect = (period) => {
    setSelectedTime(period);
    // Find the actual slot object from availableSlots
    const slotObj = availableSlots.find(s => s.time === period);

    if (slotObj) {
      setSelectedSlot({
        ...slotObj,
        displayDate: new Date(selectedDate).toDateString()
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (selectedSlot) {
      // Validate all 3 fields as required
      if (!patientDetails.name.trim() || !patientDetails.email.trim() || !patientDetails.phone.trim()) {
        alert("Please fill in all required details (Name, Email, Phone).");
        return;
      }

      setProcessing(true); // Start buffering
      try {
        const payload = {
          doctorId: selectedDoctor,
          slotId: selectedSlot._id,
          consultationType,
          patient: patientDetails, // Sending full object
          symptoms: "Checkup" // Can add symptoms input later if needed
        };

        const response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const bookingData = await response.json();
          // Add some display info for the confirmation page
          bookingData.doctor = doctorInfo;
          bookingData.slot = { ...selectedSlot, date: selectedSlot.displayDate };
          // Ensure patient details are passed for display
          bookingData.patient = patientDetails;

          localStorage.setItem('lastBooking', JSON.stringify(bookingData));

          // buffer delay for user experience processing feel
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(bookingData);
            } else {
              navigate('/booking-confirmed');
            }
          }, 1500);

        } else {
          alert('Failed to book appointment');
          setProcessing(false);
        }
      } catch (error) {
        console.error("Booking error:", error);
        alert('Error processing booking');
        setProcessing(false);
      }
    }
  };

  return (
    <div className="slot-container">
      <div className="slot-header">
        <h1>🗓️ Select Appointment Slot</h1>
        <div className="doctor-info">
          <h2>{doctorInfo?.name}</h2>
          <p>{doctorInfo?.clinic}</p>
        </div>
      </div>

      {/* Step 1: Choose Date */}
      <div className="section">
        <h3>📅 Select Date</h3>
        <div className="date-picker-container">
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
              setSelectedSlot(null);
            }}
          />
        </div>
      </div>

      {/* Step 2: Choose Time Period */}
      <div className="section">
        <h3>⏰ Select Period {loading && '(Loading...)'}</h3>
        {availableSlots.length === 0 && !loading ? (
          <p className="no-slots">No slots available for this date.</p>
        ) : (
          <div className="period-selection-grid">
            {['Morning', 'Afternoon', 'Evening'].map(period => {
              // Find if slot exists for this period
              const slot = availableSlots.find(s => s.time === period);
              const isBooked = slot && slot.isBooked;
              const exists = !!slot;

              return (
                <button
                  key={period}
                  className={`period-card ${selectedTime === period ? 'selected' : ''} ${!exists || isBooked ? 'disabled' : ''}`}
                  disabled={!exists || isBooked}
                  onClick={() => exists && !isBooked && handleSlotSelect(period)}
                >
                  <div className="period-icon">
                    {period === 'Morning' && '🌅'}
                    {period === 'Afternoon' && '☀️'}
                    {period === 'Evening' && '🌙'}
                  </div>
                  <div className="period-name">{period}</div>
                  <div className="period-status">
                    {!exists ? 'Unavailable' : isBooked ? 'Booked' : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 3: Choose Consultation Type */}
      <div className="section">
        <h3>🎯 Consultation Type</h3>
        <div className="consultation-type">
          <div
            className={`type-card ${consultationType === 'in-person' ? 'selected' : ''}`}
            onClick={() => setConsultationType('in-person')}
          >
            <div className="type-icon">🏥</div>
            <h4>In-Person Visit</h4>
            <p>Visit clinic for checkup</p>
            <div className="type-features">
              <span>✓ Physical exam</span>
              <span>✓ Lab tests</span>
            </div>
          </div>

          <div
            className={`type-card video ${consultationType === 'video' ? 'selected' : ''}`}
            onClick={() => setConsultationType('video')}
          >
            <div className="type-icon">📱</div>
            <h4>Video Consultation</h4>
            <p>Google Meet video call</p>
            <div className="type-features">
              <span>✓ Instant link</span>
              <span>✓ No travel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Patient Details */}
      <div className="section">
        <h3>👤 Your Details</h3>
        <div className="patient-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name (Required)"
            value={patientDetails.name}
            onChange={handleInputChange}
            className="patient-input"
            disabled={processing}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address (Required)"
            value={patientDetails.email}
            onChange={handleInputChange}
            className="patient-input"
            disabled={processing}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (Required)"
            value={patientDetails.phone}
            onChange={handleInputChange}
            className="patient-input"
            disabled={processing}
          />
        </div>
      </div>

      {/* Selected Slot Info */}
      {selectedSlot && (
        <div className="selected-info">
          <h3>Selected Appointment</h3>
          <div className="appointment-details">
            <div className="detail">
              <span>Date:</span>
              <strong>{selectedSlot.displayDate}</strong>
            </div>
            <div className="detail">
              <span>Time:</span>
              <strong>{selectedSlot.time} ({selectedSlot.period})</strong>
            </div>
            <div className="detail">
              <span>Type:</span>
              <strong className={`type-badge ${consultationType}`}>
                {consultationType === 'video' ? '📱 Video Call' : '🏥 In-Person'}
              </strong>
            </div>
            <div className="detail">
              <span>Doctor:</span>
              <strong>{doctorInfo?.name}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        className={`confirm-btn ${selectedSlot ? 'active' : ''}`}
        onClick={handleConfirm}
        disabled={!selectedSlot || processing}
        style={{ cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}
      >
        {processing ? 'Processing Appointment...' : (selectedSlot
          ? `Confirm ${consultationType === 'video' ? 'Video' : 'In-Person'} Appointment`
          : 'Select a time slot')}
      </button>
    </div>
  );
};

export default SlotSelection;