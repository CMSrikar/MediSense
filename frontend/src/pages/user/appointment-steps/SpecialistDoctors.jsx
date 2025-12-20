import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./SpecialistDoctors.css";

const SpecialistDoctors = ({ selectedProblem, selectedCity, onNext }) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  /* -----------------------------
     Get User Location
  ------------------------------ */
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          reject("Location permission denied");
        }
      );
    });
  };

  /* -----------------------------
     Fetch Nearby Doctors
  ------------------------------ */
  const fetchNearbyDoctors = async () => {
    try {
      let userLocation = null;
      try {
        userLocation = await getUserLocation();
      } catch (locErr) {
        console.warn("Location access denied or unavailable:", locErr);
        // Continue without location
      }

      const res = await api.post("/doctors/nearby", {
        problem: selectedProblem,
        userLocation,
        city: selectedCity // Sent from parent (AppointmentBooking)
      });

      setDoctors(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch nearby doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyDoctors();
  }, []);

  /* -----------------------------
     UI STATES
  ------------------------------ */
  if (loading) {
    return (
      <div className="loading-container">
        <p>📍 Finding nearby specialists...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (doctors.length === 0) {
    return <p>No nearby doctors found</p>;
  }

  return (
    <div className="specialist-container">
      <h2>Nearby Specialists</h2>

      <div className="doctors-list">
        {doctors.map((doc, index) => (
          <div key={index} className="doctor-card">

            {/* Avatar */}
            <div className="doctor-avatar" style={{ background: index % 2 === 0 ? '#0F172A' : '#0D9488' }}>
              {doc.doctorName.charAt(4) || "D"}
            </div>

            {/* Content Middle */}
            <div className="doctor-card-content">
              <div className="doctor-card-header">
                <div className="doctor-info">
                  <h3>{doc.doctorName}</h3>
                  <span className="specialty">{doc.specialization}</span>
                </div>
                <div className="rating">
                  <span className="stars">★ {doc.rating}</span>
                </div>
              </div>

              <div className="doctor-details">
                <div className="detail">
                  <span className="icon">🏥</span>
                  <span>{doc.hospital}</span>
                </div>
                <div className="detail">
                  <span className="icon">📍</span>
                  <span>{doc.distance}</span>
                </div>
                <div className="detail">
                  <span className="icon">💰</span>
                  <span>₹{doc.fees}</span>
                </div>
                {doc.email && (
                  <div className="detail" style={{ gridColumn: '1 / -1' }}>
                    <span className="icon">📧</span>
                    <span style={{ fontSize: '13px', wordBreak: 'break-all' }}>{doc.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Right */}
            <div className="doctor-actions">
              <button
                className="book-slot-btn"
                onClick={() => onNext({ doctorId: doc.doctorId, doctorInfo: doc.doctorInfo || doc })}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialistDoctors;