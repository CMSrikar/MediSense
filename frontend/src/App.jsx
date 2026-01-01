import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
import Home from "./pages/UserHomePage";

// Reports
import ReportSummarization from "./pages/user/ReportSummarization";

// Patient
import AppointmentBooking from "./pages/user/AppointmentBooking";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import AppointmentList from "./pages/user/AppointmentList";
import Remedies from "./pages/user/Remedies";
import Tests from "./pages/LabTest/Tests";
import { CartProvider } from "./context/CartContext.jsx";
import Medicines from "./pages/Medicine/Medicines";
import Cart from "./pages/Medicine/Cart";
import Checkout from "./pages/Medicine/Checkout";
import OrderSuccess from "./pages/Medicine/OrderSuccess";
// import VideoConsultation from "./pages/user/appointment-steps/VideoConsultation.jsx";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AppointmentManagement from "./pages/doctor/AppointmentManagement";
import VideoConsultation from "./pages/doctor/VideoConsultation";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState("patient");
  const [currentPage, setCurrentPage] = useState("landing");
  const [bookingData, setBookingData] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  /* ================= URL → STATE SYNC ================= */
  useEffect(() => {
    const path = location.pathname;

    switch (path) {
      case "/":
        setCurrentPage("landing");
        break;
      case "/login":
        setCurrentPage("login");
        break;
      case "/register":
        setCurrentPage("register");
        break;
      case "/forgot-password":
        setCurrentPage("forgot");
        break;
      case "/home":
        setCurrentPage("home");
        break;
      case "/booking":
        setCurrentPage("booking");
        break;
      case "/appointments":
        setCurrentPage("list");
        break;
      case "/confirmation":
        setCurrentPage("confirmation");
        break;
      case "/remedies":
        setCurrentPage("remedies");
        break;
      case "/reports":
        setCurrentPage("reports");
        break;
      case "/lab-test":
        setCurrentPage("lab-test");
        break;
      case "/medicines":
        setCurrentPage("medicines");
        break;
      case "/cart":
        setCurrentPage("cart");
        break;
      case "/checkout":
        setCurrentPage("checkout");
        break;
      case "/order-success":
        setCurrentPage("order-success");
        break;
      case "/doctor/dashboard":
        setCurrentPage("dashboard");
        break;
      case "/doctor/management":
        setCurrentPage("management");
        break;
      case "/doctor/consultation":
        setCurrentPage("consultation");
        break;
      default:
        setCurrentPage("landing");
    }
  }, [location.pathname]);

  /* ================= STATE → URL HELPERS ================= */
  const go = (page, url) => {
    setCurrentPage(page);
    navigate(url);
  };

  /* ================= AUTH ================= */
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    go(
      role === "doctor" ? "dashboard" : "home",
      role === "doctor" ? "/doctor/dashboard" : "/home"
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole("patient");
    go("landing", "/");
  };

  /* ================= PATIENT ================= */
  const handleBookingSuccess = (data) => {
    setBookingData(data);
    go("confirmation", "/confirmation");
  };

  /* ================= LANDING PAGE ================= */
  const renderLandingPage = () => (
    <>
      <Header onNavigateToBooking={() => go("booking", "/booking")} />
      <Hero onGetStarted={() => go("login", "/login")} />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );

  return (
    <CartProvider>
      <div className="app-container">
        {/* -------- LANDING -------- */}
        {currentPage === "landing" && renderLandingPage()}

        {/* -------- AUTH -------- */}
        {currentPage === "login" && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => go("register", "/register")}
            onGoToForgot={() => go("forgot", "/forgot-password")}
          />
        )}

        {currentPage === "register" && (
          <Register
            onGoToLogin={() => go("login", "/login")}
            onRegisterSuccess={(role) =>
              handleLoginSuccess(role === "hospital" ? "doctor" : "patient")
            }
          />
        )}

        {currentPage === "forgot" && (
          <ForgotPassword onClose={() => go("login", "/login")} />
        )}

        {/* -------- HOME -------- */}
        {currentPage === "home" && (
          <Home
            onBookAppointment={() => {
              setUserRole("patient");
              go("booking", "/booking");
            }}
            onDoctorLogin={() => {
              setUserRole("doctor");
              go("dashboard", "/doctor/dashboard");
            }}
          />
        )}

        {/* -------- PATIENT -------- */}
        {userRole === "patient" && (
          <>
            {currentPage === "booking" && (
              <AppointmentBooking
                onSuccess={handleBookingSuccess}
                onViewAppointments={() => go("list", "/appointments")}
                onBackToHome={() => go("home", "/home")}
              />
            )}

            {currentPage === "confirmation" && (
              <BookingConfirmation
                bookingData={bookingData}
                onViewAppointments={() => go("list", "/appointments")}
                onBackToBooking={() => go("booking", "/booking")}
                onBackToHome={() => go("home", "/home")}
              />
            )}

            {currentPage === "list" && (
              <AppointmentList
                onBackToBooking={() => go("booking", "/booking")}
                onBackToHome={() => go("home", "/home")}
              />
            )}

            {currentPage === "remedies" && (
              <Remedies
                onBackToHome={() => go("home", "/home")}
                onBookAppointment={() => go("booking", "/booking")}
              />
            )}

            {currentPage === "reports" && <ReportSummarization />}

            {currentPage === "lab-test" && <Tests />}

            {currentPage === "medicines" && <Medicines />}
            {currentPage === "cart" && <Cart />}
            {currentPage === "checkout" && <Checkout />}
            {currentPage === "order-success" && <OrderSuccess />}

            {/* {currentPage === "video-consultation" && (
            <VideoConsultation
              appointmentId={selectedAppointmentId}
              onBack={() => go("list", "/appointments")}
              onBackToHome={() => go("home", "/home")}
            />
          )} */}
          </>
        )}

        {/* -------- DOCTOR -------- */}
        {userRole === "doctor" && (
          <>
            {currentPage === "dashboard" && (
              <DoctorDashboard
                onLogout={handleLogout}
                onManage={(id) => {
                  setSelectedAppointmentId(id);
                  go("management", "/doctor/management");
                }}
                onBackToHome={() => go("home", "/home")}
              />
            )}

            {currentPage === "management" && (
              <AppointmentManagement
                appointmentId={selectedAppointmentId}
                onBack={() => go("dashboard", "/doctor/dashboard")}
                onBackToHome={() => go("home", "/home")}
              />
            )}

            {currentPage === "consultation" && (
              <VideoConsultation
                appointmentId={selectedAppointmentId}
                onBack={() => go("dashboard", "/doctor/dashboard")}
                onBackToHome={() => go("home", "/home")}
              />
            )}
          </>
        )}
      </div>
    </CartProvider>
  );
}

export default App;
