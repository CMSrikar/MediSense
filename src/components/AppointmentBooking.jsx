import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Stethoscope, FileText, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AppointmentBooking.css';

const departments = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'ENT',
  'Ophthalmology'
];

const doctors = {
  'General Medicine': ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Priya Sharma'],
  'Cardiology': ['Dr. Robert Williams', 'Dr. Emily Davis', 'Dr. Arjun Mehta'],
  'Dermatology': ['Dr. Lisa Anderson', 'Dr. James Wilson', 'Dr. Anjali Patel'],
  'Pediatrics': ['Dr. Maria Garcia', 'Dr. David Lee', 'Dr. Sneha Reddy'],
  'Orthopedics': ['Dr. John Smith', 'Dr. Rachel Brown', 'Dr. Vikram Singh'],
  'Neurology': ['Dr. Amanda Taylor', 'Dr. Christopher Moore', 'Dr. Kavya Rao'],
  'ENT': ['Dr. Jennifer White', 'Dr. Daniel Harris', 'Dr. Ravi Kumar'],
  'Ophthalmology': ['Dr. Patricia Martin', 'Dr. Steven Clark', 'Dr. Meera Gupta']
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM'
];

function AppointmentBooking({ onSuccess, onViewAppointments }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    appointment_date: '',
    appointment_time: '',
    department: '',
    doctor_name: '',
    symptoms: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim()) newErrors.patient_name = 'Name is required';
    if (!formData.patient_email.trim()) {
      newErrors.patient_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.patient_email)) {
      newErrors.patient_email = 'Invalid email format';
    }
    if (!formData.patient_phone.trim()) {
      newErrors.patient_phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.patient_phone.replace(/\D/g, ''))) {
      newErrors.patient_phone = 'Phone must be 10 digits';
    }
    if (!formData.appointment_date) newErrors.appointment_date = 'Date is required';
    if (!formData.appointment_time) newErrors.appointment_time = 'Time is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.doctor_name) newErrors.doctor_name = 'Doctor is required';
    if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([formData])
        .select()
        .maybeSingle();

      if (error) throw error;

      onSuccess(data);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { doctor_name: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-container">
      <div className="booking-header">
        <div className="header-content">
          <div className="pulse-icon">
            <Activity size={48} />
          </div>
          <h1 className="header-title">Book Your Appointment</h1>
          <p className="header-subtitle">Fill in your details and we'll take care of the rest</p>
        </div>
        <button onClick={onViewAppointments} className="view-appointments-btn">
          View My Appointments
        </button>
      </div>

      <div className="booking-card">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-grid">
            {/* Patient Name */}
            <div className={`form-group ${focusedField === 'patient_name' ? 'focused' : ''} ${errors.patient_name ? 'error' : ''}`}>
              <label htmlFor="patient_name" className="form-label">
                <User size={18} />
                Full Name
              </label>
              <input
                type="text"
                id="patient_name"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('patient_name')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.patient_name && <span className="error-message">{errors.patient_name}</span>}
            </div>

            {/* Email */}
            <div className={`form-group ${focusedField === 'patient_email' ? 'focused' : ''} ${errors.patient_email ? 'error' : ''}`}>
              <label htmlFor="patient_email" className="form-label">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="patient_email"
                name="patient_email"
                value={formData.patient_email}
                onChange={handleChange}
                onFocus={() => setFocusedField('patient_email')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                placeholder="your.email@example.com"
              />
              {errors.patient_email && <span className="error-message">{errors.patient_email}</span>}
            </div>

            {/* Phone */}
            <div className={`form-group ${focusedField === 'patient_phone' ? 'focused' : ''} ${errors.patient_phone ? 'error' : ''}`}>
              <label htmlFor="patient_phone" className="form-label">
                <Phone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                id="patient_phone"
                name="patient_phone"
                value={formData.patient_phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('patient_phone')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                placeholder="1234567890"
              />
              {errors.patient_phone && <span className="error-message">{errors.patient_phone}</span>}
            </div>

            {/* Department */}
            <div className={`form-group ${focusedField === 'department' ? 'focused' : ''} ${errors.department ? 'error' : ''}`}>
              <label htmlFor="department" className="form-label">
                <Stethoscope size={18} />
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onFocus={() => setFocusedField('department')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            {/* Doctor */}
            <div className={`form-group ${focusedField === 'doctor_name' ? 'focused' : ''} ${errors.doctor_name ? 'error' : ''}`}>
              <label htmlFor="doctor_name" className="form-label">
                <User size={18} />
                Select Doctor
              </label>
              <select
                id="doctor_name"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('doctor_name')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                disabled={!formData.department}
              >
                <option value="">Select Doctor</option>
                {formData.department && doctors[formData.department]?.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
              {errors.doctor_name && <span className="error-message">{errors.doctor_name}</span>}
            </div>

            {/* Date */}
            <div className={`form-group ${focusedField === 'appointment_date' ? 'focused' : ''} ${errors.appointment_date ? 'error' : ''}`}>
              <label htmlFor="appointment_date" className="form-label">
                <Calendar size={18} />
                Appointment Date
              </label>
              <input
                type="date"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                onFocus={() => setFocusedField('appointment_date')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                min={today}
              />
              {errors.appointment_date && <span className="error-message">{errors.appointment_date}</span>}
            </div>

            {/* Time */}
            <div className={`form-group ${focusedField === 'appointment_time' ? 'focused' : ''} ${errors.appointment_time ? 'error' : ''}`}>
              <label htmlFor="appointment_time" className="form-label">
                <Clock size={18} />
                Time Slot
              </label>
              <select
                id="appointment_time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                onFocus={() => setFocusedField('appointment_time')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.appointment_time && <span className="error-message">{errors.appointment_time}</span>}
            </div>

            {/* Symptoms */}
            <div className={`form-group full-width ${focusedField === 'symptoms' ? 'focused' : ''} ${errors.symptoms ? 'error' : ''}`}>
              <label htmlFor="symptoms" className="form-label">
                <FileText size={18} />
                Symptoms / Reason for Visit
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                onFocus={() => setFocusedField('symptoms')}
                onBlur={() => setFocusedField(null)}
                className="form-input"
                rows="4"
                placeholder="Please describe your symptoms or reason for consultation..."
              />
              {errors.symptoms && <span className="error-message">{errors.symptoms}</span>}
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Booking...
              </>
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>

      <div className="decorative-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
