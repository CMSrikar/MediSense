import React, { useEffect, useRef } from "react";
import "./Hero.css";

function Hero({ onGetStarted }) {
  const heroRef = useRef(null);
  const illustrationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (illustrationRef.current) observer.observe(illustrationRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          {/* LEFT CONTENT */}
          <div ref={heroRef} className="hero-text fade-in">
            <h1 className="hero-title">
              Your Complete <span className="hero-highlight">Healthcare</span>{" "}
              Solution
            </h1>

            <p className="hero-subtitle">
              From symptoms to treatment, we guide you through every step of
              your healthcare journey with AI-powered assistance, instant
              remedies, and seamless doctor connections.
            </p>

            <div className="hero-buttons">
              {/* ✅ GET STARTED → LOGIN / REGISTER */}
              <button
                type="button"
                onClick={() => {
                  console.log("Get Started clicked");
                  onGetStarted && onGetStarted();
                }}
                className="btn btn-primary hero-btn get-started-btn"
              >
                <i className="fas fa-rocket"></i> Get Started
              </button>

              <button type="button" className="btn btn-outline hero-btn">
                <i className="fas fa-download"></i> Download App
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3>50K+</h3>
                <p>Users Helped</p>
              </div>
              <div className="stat">
                <h3>500+</h3>
                <p>Doctors</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div
            ref={illustrationRef}
            className="hero-illustration slide-in-right"
          >
            <div className="floating-elements">
              <div className="element element-1 float">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div
                className="element element-2 float"
                style={{ animationDelay: "1s" }}
              >
                <i className="fas fa-pills"></i>
              </div>
              <div
                className="element element-3 float"
                style={{ animationDelay: "2s" }}
              >
                <i className="fas fa-hospital"></i>
              </div>
              <div
                className="element element-4 float"
                style={{ animationDelay: "3s" }}
              >
                <i className="fas fa-video"></i>
              </div>
            </div>

            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="screen-content">
                  <div className="symptom-input">
                    <i className="fas fa-search"></i>
                    <span>Enter your symptoms...</span>
                  </div>

                  <div className="remedy-card pulse">
                    <i className="fas fa-leaf"></i>
                    <div>
                      <h4>Home Remedy</h4>
                      <p>Based on your symptoms</p>
                    </div>
                  </div>

                  <div className="doctor-card">
                    <i className="fas fa-user-md"></i>
                    <div>
                      <h4>Dr. Sarah Johnson</h4>
                      <p>Available for consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
