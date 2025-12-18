import React, { useEffect, useRef, useState } from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonialRefs = useRef([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    testimonialRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Auto slide testimonial
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Patient",
      content: "HealthConnect saved me during an emergency. The hospital finder located the nearest facility in seconds, and the appointment booking was seamless with SMS confirmation.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      role: "Cardiologist",
      content: "The video consultation feature with integrated Google Meet is fantastic. I can easily connect with my patients and the appointment management dashboard is very intuitive.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Patient",
      content: "The tablet recognition feature is amazing! I scanned my medicine and instantly got all the information I needed. No more confusion about medications.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Dr. Anil Verma",
      role: "General Physician",
      content: "As a doctor, I appreciate how this platform bridges the gap between patients and healthcare providers. The medical report summarization helps patients understand their reports better.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-title">
          <h2>What Our Users Say</h2>
          <div className="title-line"></div>
          <p>Trusted by thousands of patients and healthcare professionals across India</p>
        </div>

        <div className="testimonials-container">
          <div className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                ref={el => testimonialRefs.current[index] = el}
                className={`testimonial-card fade-in ${activeTestimonial === index ? 'active' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>{testimonial.content}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${i < testimonial.rating ? 'filled' : ''}`}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${activeTestimonial === index ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>

        {/* <div className="stats-grid">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Happy Patients</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Verified Doctors</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Partner Hospitals</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default Testimonials;