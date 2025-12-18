import React, { useEffect, useRef } from 'react';
import './Home.css';

function Home({ onBookAppointment, onDoctorLogin }) {
  const homeRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (homeRef.current) {
      observer.observe(homeRef.current);
    }

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: 'fa-stethoscope',
      title: 'Symptom Analysis',
      description: 'AI-powered symptom analysis with home remedy suggestions',
      color: '#2563EB'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Book Appointments',
      description: 'Seamless appointment booking with SMS confirmations',
      color: '#0D9488'
    },
    {
      icon: 'fa-video',
      title: 'Video Consultations',
      description: 'Connect with doctors via integrated Google Meet',
      color: '#14B8A6'
    },
    {
      icon: 'fa-pills',
      title: 'Medicine Finder',
      description: 'Identify medicines across medical stores and e-commerce',
      color: '#5EEAD4'
    },
    {
      icon: 'fa-camera',
      title: 'Tablet Recognition',
      description: 'Scan tablets and classify them by category',
      color: '#FB7185'
    },
    {
      icon: 'fa-file-medical',
      title: 'Report Summary',
      description: 'Get easy-to-understand summaries of medical reports',
      color: '#1E40AF'
    }
  ];

  return (
    <div className="home-page" ref={homeRef}>
      {/* Animated Background */}
      <div className="home-background">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-circle circle-4"></div>
      </div>

      <div className="container">
        {/* Hero Section */}
        <section className="home-hero fade-in">
          <div className="hero-content-wrapper">
            <div className="hero-text-content">
              <h1 className="home-title">
                Welcome to <span className="title-highlight">MediCare</span>
              </h1>
              <p className="home-subtitle">
                Your complete healthcare solution - from symptoms to treatment, 
                we guide you through every step of your healthcare journey.
              </p>
              
              <div className="home-action-buttons">
                <button 
                  className="btn btn-primary home-action-btn book-btn"
                  onClick={onBookAppointment}
                >
                  <i className="fas fa-calendar-check"></i>
                  <span>Book Appointment</span>
                  <div className="btn-shine"></div>
                </button>
                <button 
                  className="btn btn-secondary home-action-btn doctor-btn"
                  onClick={onDoctorLogin}
                >
                  <i className="fas fa-user-md"></i>
                  <span>Doctor Login</span>
                  <div className="btn-shine"></div>
                </button>
              </div>
            </div>

            <div className="hero-illustration-wrapper">
              <div className="floating-medical-icons">
                <div className="medical-icon icon-1 float-animation">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <div className="medical-icon icon-2 float-animation-delay-1">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="medical-icon icon-3 float-animation-delay-2">
                  <i className="fas fa-ambulance"></i>
                </div>
                <div className="medical-icon icon-4 float-animation-delay-3">
                  <i className="fas fa-prescription-bottle-alt"></i>
                </div>
              </div>
              <div className="main-illustration pulse-animation">
                <div className="illustration-circle circle-gradient-1"></div>
                <div className="illustration-circle circle-gradient-2"></div>
                <div className="illustration-content">
                  <i className="fas fa-user-md main-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="home-features">
          <h2 className="section-heading fade-in">What We Offer</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className="feature-card fade-in-up"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div 
                  className="feature-icon-wrapper"
                  style={{ '--icon-color': feature.color }}
                >
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="home-stats">
          <div className="stats-container">
            <div className="stat-item fade-in">
              <div className="stat-number" data-target="50000">0</div>
              <div className="stat-label">Users Helped</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number" data-target="500">0</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number" data-target="24">0</div>
              <div className="stat-label">24/7 Support</div>
            </div>
            <div className="stat-item fade-in">
              <div className="stat-number" data-target="10000">0</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;

