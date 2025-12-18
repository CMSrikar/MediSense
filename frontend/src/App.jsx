import { useState } from "react";

// Landing components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import About from "./components/About";

// Pages
import Home from "./pages/Home";

// Patient
import AppointmentBooking from "./pages/user/AppointmentBooking";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import AppointmentList from "./pages/user/AppointmentList";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AppointmentManagement from "./pages/doctor/AppointmentManagement";
import VideoConsultation from "./pages/doctor/VideoConsultation";

// 🔐 Auth (NEW)
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";

import "./App.css";

function App() {
  const [userRole, setUserRole] = useState("patient");
  const [currentPage, setCurrentPage] = useState("landing");
  const [bookingData, setBookingData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  /* ---------------- Auth Navigation ---------------- */
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setCurrentPage(role === "doctor" ? "dashboard" : "home");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole("patient");
    setCurrentPage("landing");
  };

  /* ---------------- Patient Flow ---------------- */
  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setCurrentPage("confirmation");
  };

  const handleViewAppointments = () => setCurrentPage("list");
  const handleBackToBooking = () => setCurrentPage("booking");

  /* ---------------- Doctor Flow ---------------- */
  const handleManageAppointment = (id) => {
    setSelectedAppointmentId(id);
    setCurrentPage("management");
  };

  const handleStartConsultation = (id) => {
    setSelectedAppointmentId(id);
    setCurrentPage("consultation");
  };

  const handleBackToDashboard = () => setCurrentPage("dashboard");

  /* ---------------- Common Navigation ---------------- */
  const handleNavigateToBooking = () => setCurrentPage("booking");
  const handleNavigateToHome = () => setCurrentPage("home");
  const handleNavigateToLanding = () => setCurrentPage("landing");
  const handleGetStarted = () => setCurrentPage("login");
  const handleDoctorLogin = () => {
    setUserRole("doctor");
    setCurrentPage("dashboard");
  };

  /* ---------------- Landing Page ---------------- */
  const renderLandingPage = () => (
    <>
      <Header onNavigateToBooking={handleNavigateToBooking} />
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <Contact />
      <Footer />

      {/* Floating buttons */}
      <div className="floating-buttons">
        <button
          className="floating-btn chat-btn"
          onClick={handleNavigateToBooking}
        >
          <i className="fas fa-calendar-check"></i>
          <span className="tooltip">Book Appointment</span>
        </button>

        <button className="floating-btn emergency-btn">
          <i className="fas fa-ambulance"></i>
          <span className="tooltip">Emergency</span>
        </button>

        <button className="floating-btn scan-btn">
          <i className="fas fa-camera"></i>
          <span className="tooltip">Scan Tablet</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="app-container">
      {/* -------- LANDING -------- */}
      {currentPage === "landing" && renderLandingPage()}

      {/* -------- AUTH -------- */}
      {currentPage === "login" && (
        <Login
          onLoginSuccess={(role) => {
            setUserRole(role);
            setCurrentPage(role === "doctor" ? "dashboard" : "home");
          }}
          onGoToRegister={() => setCurrentPage("register")}
          onGoToForgot={() => setCurrentPage("forgot")}
        />
      )}

      {currentPage === "register" && (
        <Register
          onGoToLogin={() => setCurrentPage("login")}
          onRegisterSuccess={(role) => {
            setUserRole(role);
            setCurrentPage(role === "doctor" ? "dashboard" : "home");
          }}
        />
      )}

      {currentPage === "forgot" && (
        <ForgotPassword onClose={() => setCurrentPage("login")} />
      )}

      {/* -------- HOME -------- */}
      {currentPage === "home" && (
        <Home
          onBookAppointment={handleNavigateToBooking}
          onDoctorLogin={handleDoctorLogin}
        />
      )}

      {/* -------- PATIENT -------- */}
      {userRole === "patient" && (
        <>
          {currentPage === "booking" && (
            <AppointmentBooking
              onSuccess={handleBookingSuccess}
              onViewAppointments={handleViewAppointments}
              onBackToHome={handleNavigateToHome}
            />
          )}

          {currentPage === "confirmation" && (
            <BookingConfirmation
              bookingData={bookingData}
              onViewAppointments={handleViewAppointments}
              onBackToBooking={handleBackToBooking}
              onBackToHome={handleNavigateToHome}
            />
          )}

          {currentPage === "list" && (
            <AppointmentList
              onBackToBooking={handleBackToBooking}
              onBackToHome={handleNavigateToHome}
            />
          )}
        </>
      )}

      {/* -------- DOCTOR -------- */}
      {userRole === "doctor" && (
        <>
          {currentPage === "dashboard" && (
            <DoctorDashboard
              onLogout={handleLogout}
              onManage={handleManageAppointment}
              onBackToHome={handleNavigateToHome}
            />
          )}

          {currentPage === "management" && (
            <AppointmentManagement
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
              onBackToHome={handleNavigateToHome}
            />
          )}

          {currentPage === "consultation" && (
            <VideoConsultation
              appointmentId={selectedAppointmentId}
              onBack={handleBackToDashboard}
              onBackToHome={handleNavigateToHome}
            />
          )}
        </>
      )}

      {/* -------- BACK BUTTON -------- */}
      {currentPage !== "landing" && (
        <button onClick={handleNavigateToLanding} className="back-home-btn">
          <i className="fas fa-home"></i> Back to Landing
        </button>
      )}
    </div>
  );
}

export default App;
