import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ui/index.css';

const Arogyakosh = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="pulse-loader">
          <i className="fas fa-heartbeat"></i>
        </div>
        <h2>Loading Arogyakosh...</h2>
      </div>
    );
  }

  return (
    <div className="arogyakosh-app">
      {/* Healthcare animated background */}
      <div className="animated-background">
        <div className="medical-symbols">
          <i className="fas fa-heartbeat"></i>
          <i className="fas fa-prescription"></i>
          <i className="fas fa-pills"></i>
          <i className="fas fa-dna"></i>
          <i className="fas fa-ambulance"></i>
          <i className="fas fa-stethoscope"></i>
          <i className="fas fa-capsules"></i>
          <i className="fas fa-microscope"></i>
          <i className="fas fa-hospital"></i>
          <i className="fas fa-notes-medical"></i>
        </div>
        <div className="pulse-circles">
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
          <div className="pulse-circle"></div>
        </div>
        <div className="healthline"></div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Arogyakosh:</h1>
          <h1 className="hero-subtitle">Transforming Healthcare</h1>
          <p className="hero-text">Connecting Patients, Doctors, and Hospitals with Cutting-Edge Technology</p>
          <button onClick={handleLogin} className="cta-button">
            Login <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack">
        <h2>Our Technology Stack</h2>
        <div className="tech-cards">
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3>Healthcare AI</h3>
            <p>Advanced AI solutions for medical diagnostics and treatment planning</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Machine Learning</h3>
            <p>Predictive models for personalized patient care</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <h3>Cloud Computing</h3>
            <p>Secure and scalable healthcare infrastructure</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Cybersecurity</h3>
            <p>Robust protection of patient data and medical records</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-link"></i>
            </div>
            <h3>Blockchain</h3>
            <p>Transparent and secure medical record management</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-atom"></i>
            </div>
            <h3>Quantum Computing</h3>
            <p>Advanced computational power for complex medical research</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon">
              <i className="fas fa-microphone-alt"></i>
            </div>
            <h3>Speech Processing</h3>
            <p>Advanced communication tools for healthcare professionals</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Healthcare Solutions</h2>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>Doctor Consultation</h3>
            <p>Connect with specialists instantly</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-hospital"></i>
            </div>
            <h3>Hospital Network</h3>
            <p>Access to top healthcare facilities</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <h3>Medical Records</h3>
            <p>Secure digital health documents</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Mobile Health</h3>
            <p>Healthcare on the go</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-us">
        <div className="about-content">
          <h2>About Arogyakosh</h2>
          <p>AROGYAKOSH provides comprehensive medical care with compassion and expertise. Our mission is to deliver high-quality healthcare tailored to individual patient needs. We believe in accessible healthcare for all and strive to innovate in providing medical services.</p>
          
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Hospitals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <nav className="footer-nav">
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#awards">Awards</a>
            <a href="#help">Help</a>
            <a href="#contact">Contact</a>
          </nav>
          
          <div className="mission-statement">
            <p>
              AROGYAKOSH provides comprehensive medical care with compassion and expertise.
              Our mission is to deliver high-quality healthcare tailored to individual patient needs.
              We believe in accessible healthcare for all and strive to innovate in providing medical services.
            </p>
          </div>
          
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-google"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
          
          <div className="contact-info">
            <div>
              <i className="fas fa-phone-alt"></i> +919620146061
            </div>
            <div>
              <i className="fas fa-envelope"></i> arogyakoshh@gmail.com
            </div>
            <div>
              <i className="fas fa-map-marker-alt"></i> Mumbai
            </div>
          </div>
          
          <div className="copyright">
            ©️ 2025 AROGYAKOSH. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Arogyakosh;