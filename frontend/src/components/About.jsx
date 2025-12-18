import React, { useEffect, useRef } from 'react';
import './About.css';

function About() {
  const aboutRefs = useRef([]);
  
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
    aboutRefs.current.forEach((ref) => {
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

  const teamMembers = [
    {
      name: 'Dr. Arjun Sharma',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      description: '15+ years experience in healthcare management'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      description: 'AI & Healthcare Tech Specialist'
    },
    {
      name: 'Rohan Mehta',
      role: 'Product Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: '10+ years in healthcare product development'
    },
    {
      name: 'Dr. Ananya Reddy',
      role: 'Clinical Advisor',
      image: 'https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=300&h=300&fit=crop&crop=face',
      description: 'Senior Physician & Digital Health Expert'
    }
  ];

  const milestones = [
    { year: '2021', title: 'Founded', description: 'HealthConnect was founded with a vision to revolutionize healthcare access' },
    { year: '2022', title: 'First Launch', description: 'Launched MVP with basic appointment booking and symptom checker' },
    { year: '2023', title: 'AI Integration', description: 'Integrated AI for symptom analysis and home remedies' },
    { year: '2024', title: 'National Expansion', description: 'Expanded to 50+ cities across India with 500+ partner doctors' }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title">
          <h2>About HealthConnect</h2>
          <div className="title-line"></div>
          <p>Revolutionizing healthcare through technology and compassion</p>
        </div>

        <div className="about-content">
          <div 
            ref={el => aboutRefs.current[0] = el}
            className="about-text"
          >
            <h3>Our Mission</h3>
            <p>
              At HealthConnect, we believe that access to quality healthcare should be a fundamental right, not a privilege. 
              Our mission is to bridge the gap between patients and healthcare providers through innovative technology solutions 
              that make healthcare accessible, affordable, and efficient for everyone.
            </p>
            
            <h3>Our Vision</h3>
            <p>
              We envision a world where every individual can access reliable healthcare guidance within minutes, 
              connect with verified medical professionals seamlessly, and receive personalized treatment plans 
              that consider their unique health needs and circumstances.
            </p>
          </div>

          <div 
            ref={el => aboutRefs.current[1] = el}
            className="about-stats"
          >
            <div className="about-stats simple-stats">
  <div className="simple-stat-card primary">
    <div className="icon">👥</div>
    <h3>50,000+</h3>
    <p>Patients Served Across India</p>
  </div>

  <div className="simple-stat-card secondary">
    <div className="icon">👨‍⚕️</div>
    <h3>500+</h3>
    <p>Verified & Trusted Doctors</p>
  </div>
</div>

          </div>
        </div>

        <div className="team-section">
          <h3 
            ref={el => aboutRefs.current[2] = el}
            className="team-title fade-in"
          >
            Meet Our Team
          </h3>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                ref={el => aboutRefs.current[3 + index] = el}
                className="team-member fade-in"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                  <div className="member-overlay">
                    <div className="social-icons">
                      <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="milestones-section">
          <h3 
            ref={el => aboutRefs.current[7] = el}
            className="milestones-title fade-in"
          >
            Our Journey
          </h3>
          <div className="milestones-timeline">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                ref={el => aboutRefs.current[8 + index] = el}
                className="milestone fade-in"
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="milestone-year">{milestone.year}</div>
                <div className="milestone-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="values-section">
          <h3 
            ref={el => aboutRefs.current[12] = el}
            className="values-title fade-in"
          >
            Our Core Values
          </h3>
          <div className="values-grid">
            {[
              { icon: 'fas fa-heart', title: 'Compassion', desc: 'We treat every user with empathy and understanding' },
              { icon: 'fas fa-shield-alt', title: 'Trust & Safety', desc: 'Your health data is protected with enterprise-grade security' },
              { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Continuously improving with cutting-edge technology' },
              { icon: 'fas fa-users', title: 'Accessibility', desc: 'Making healthcare available to everyone, everywhere' }
            ].map((value, index) => (
              <div
                key={index}
                ref={el => aboutRefs.current[13 + index] = el}
                className="value-card fade-in"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="value-icon">
                  <i className={value.icon}></i>
                </div>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;