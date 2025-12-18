import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

function Contact() {
  const contactRefs = useRef([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all refs
    contactRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
        // Check if element is already in viewport
        const rect = ref.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          ref.classList.add('visible');
        }
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: 'fa-phone',
      title: 'Emergency Helpline',
      details: ['24/7 Support: 1800-123-4567', 'WhatsApp: +91 9876543210'],
      color: '#FB7185'
    },
    {
      icon: 'fa-envelope',
      title: 'Email Support',
      details: ['support@healthconnect.com', 'info@healthconnect.com'],
      color: '#1E40AF'
    },
    {
      icon: 'fa-map-marker-alt',
      title: 'Headquarters',
      details: ['123 Health Street', 'Medical District, Bangalore', 'Karnataka 560001'],
      color: '#0D9488'
    },
    {
      icon: 'fa-clock',
      title: 'Business Hours',
      details: ['Monday - Friday: 8 AM - 10 PM', 'Saturday - Sunday: 9 AM - 8 PM'],
      color: '#8B5CF6'
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <div className="title-line"></div>
          <p>Have questions? We're here to help you with your healthcare journey</p>
        </div>

        <div className="contact-info-wrapper">
          <div className="contact-info">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                ref={el => contactRefs.current[index] = el}
                className="info-card fade-in"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="info-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3>{item.title}</h3>
                {item.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="contact-content">

          <div 
            ref={el => contactRefs.current[4] = el}
            className="contact-form-container slide-in-right"
          >
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>Fill out the form below and our team will get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className="form-input"
                />
                <i className="fas fa-user input-icon"></i>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="form-input"
                  />
                  <i className="fas fa-envelope input-icon"></i>
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="form-input"
                  />
                  <i className="fas fa-phone input-icon"></i>
                </div>
              </div>

              <div className="form-group">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Subject</option>
                  <option value="appointment">Appointment Booking</option>
                  <option value="technical">Technical Support</option>
                  <option value="emergency">Emergency Assistance</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
                <i className="fas fa-chevron-down select-icon"></i>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows="5"
                  required
                  className="form-textarea"
                ></textarea>
                <i className="fas fa-comment textarea-icon"></i>
              </div>

              {submitSuccess && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;