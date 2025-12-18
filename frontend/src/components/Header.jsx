import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ onNavigateToBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <i className="fas fa-heartbeat logo-icon"></i>
            <span className="logo-text">Health<span className="logo-highlight">Connect</span></span>
          </div>
          
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a href="#about" className="nav-link">About</a>
            {/* <button 
              className="btn btn-primary nav-btn"
              onClick={onNavigateToBooking}
            >
              Book Appointment
            </button> */}
          </div>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;