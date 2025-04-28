import React, { useState, useEffect } from 'react';
import '../ui/hspDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faHospital, 
  faUserPlus, 
  faUsers, 
  faRightFromBracket, 
  faVolumeUp, 
  faPause, 
  faSearch, 
  faSpinner, 
  faPhoneAlt, 
  faEnvelope, 
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faGoogle, 
  faInstagram, 
  faLinkedinIn, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons';

const HospitalDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hospitalInfo, setHospitalInfo] = useState({
    name: '-',
    license: '-',
    location: '-',
    contact: '-'
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authStatus, setAuthStatus] = useState('unknown');
  
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const startSpeaking = () => {
    if ('speechSynthesis' in window) {
      const contentToRead = document.querySelector('.main-content').textContent;
      const speech = new SpeechSynthesisUtterance();
      speech.text = contentToRead;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.lang = 'en-US';
      
      window.speechSynthesis.speak(speech);
      setSpeaking(true);
      
      speech.onend = function() {
        setSpeaking(false);
      };
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const toggleSpeaking = () => {
    if (speaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  useEffect(() => {
    const hospitalId = window.location.pathname.split('/').pop();
    const authToken = getCookie('authToken');

    // Check hospital auth status
    const checkHospitalAuth = async () => {
      try {
        const response = await fetch(`/check-hospital/${hospitalId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          setAuthStatus('authorized');
        } else if (response.status === 403) {
          setAuthStatus('not_logged_in');
        } else if (response.status === 401) {
          setAuthStatus('unauthorized');
        }
      } catch (error) {
        console.error('Error checking hospital authorization:', error);
      }
    };

    // Load hospital information
    const fetchHospitalInfo = async () => {
      try {
        const response = await fetch(`/hospital-dashboard/${hospitalId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setHospitalInfo({
          name: data.hospital?.name || 'N/A',
          license: data.hospital?.license || 'N/A',
          location: data.hospital?.location || 'N/A',
          contact: data.hospital?.contact || 'N/A'
        });
        
        // Load doctors data
        const doctorsResponse = await fetch(`/doctors/${hospitalId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!doctorsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData.doctors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospital information:', error);
        setError(true);
        setLoading(false);
      }
    };

    checkHospitalAuth();
    fetchHospitalInfo();
  }, []);

  // Utility function to get cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const openAddDoctorModal = () => {
    // This would be implemented with a modal state
    console.log("Open add doctor modal");
  };

  return (
    <div className="dashboard-container">
      {/* Background Image */}
      <div className="bg-image">
        <img src="/api/placeholder/1200/800" alt="background" className="bg-img" />
      </div>
      
      {/* Hamburger Menu Button */}
      <div className={`hamburger-menu ${sidebarActive ? 'active' : ''}`} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* Overlay for mobile */}
      <div 
        className="overlay" 
        style={{ display: sidebarActive ? 'block' : 'none' }}
        onClick={toggleSidebar}
      ></div>
      
      {/* Sidebar Navigation */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="logo">
          <div className="logo-icon">+</div>
          <div className="logo-text">AROGYAKOSH</div>
        </div>
        
        <div className="menu-item">
          <FontAwesomeIcon icon={faHome} />
          <span>Hospital Dashboard</span>
        </div>
        
        <div className="menu-item active">
          <FontAwesomeIcon icon={faHospital} />
          <span>Hospital</span>
        </div>
        
        <div className="menu-item">
          <FontAwesomeIcon icon={faUserPlus} />
          <span>
            <a href="/route/add-patient/" style={{ textDecoration: 'none', color: 'inherit' }}>Add Patients</a>
          </span>
        </div>
        
        <div className="menu-item">
          <FontAwesomeIcon icon={faUsers} />
          <span>
            <a href="/route/hospital-patients/" style={{ textDecoration: 'none', color: 'inherit' }}>View All Patients</a>
          </span>
        </div>
        
        <div className="menu-item">
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>
            <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</a>
          </span>
        </div>
        
        <div className="menu-item">
          <div id="google_translate_element"></div>
        </div>
        
        <div className="menu-item">
          <button id="readAloudBtn" className="read-aloud-btn" onClick={toggleSpeaking}>
            <FontAwesomeIcon icon={speaking ? faPause : faVolumeUp} />
            {speaking ? ' Pause Reading' : ' Read Aloud'}
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Hospital Dashboard</h1>
          {authStatus === 'not_logged_in' && (
            <div id="header-auth">
              <a href="/login" className="btn btn-primary">Login</a>
            </div>
          )}
        </div>
        
        {error && (
          <div className="error">
            Unable to load hospital information. Please try again later.
          </div>
        )}
        
        {loading && (
          <div className="loading">
            <FontAwesomeIcon icon={faSpinner} spin /> Loading hospital information...
          </div>
        )}
        
        {authStatus === 'authorized' && (
          <div className="auth-section">
            <div className="auth-buttons">
              <a href="/route/add-patient/" className="btn btn-primary">
                <FontAwesomeIcon icon={faUserPlus} /> Add Patient
              </a>
              <a href="/route/hospital-patients/" className="btn btn-success">
                <FontAwesomeIcon icon={faUsers} /> See All Patients
              </a>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="content-card">
            <h2 className="card-title">Hospital Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Name</div>
                <div className="info-value">{hospitalInfo.name}</div>
              </div>
              <div className="info-item">
                <div className="info-label">License</div>
                <div className="info-value">{hospitalInfo.license}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Location</div>
                <div className="info-value">{hospitalInfo.location}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Contact</div>
                <div className="info-value">{hospitalInfo.contact}</div>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="content-card">
            <h2 className="card-title">Doctors</h2>
            <div className="search-upload-container">
              <div className="search-container">
                <input type="text" className="search-input" placeholder="Search doctors..." />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </div>
              <button className="upload-btn" onClick={openAddDoctorModal}>
                <FontAwesomeIcon icon={faUserPlus} /> Add Doctor
              </button>
            </div>
            <div className="doctors-container">
              {doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <div key={index} className="doctor-card">
                    <strong>Name:</strong> {doctor.name} <br />
                    <strong>Age:</strong> {doctor.age} <br />
                    <strong>License:</strong> {doctor.license} <br />
                    <strong>Contact:</strong> {doctor.contact} <br />
                    <a href={`/route/doctor-dashboard/${doctor.id}`} className="doctor-link">View Doctor</a>
                  </div>
                ))
              ) : (
                <div className="empty-message">No doctors found.</div>
              )}
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="content-card">
            <h2 className="card-title">Hospital Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faUserPlus} /></div>
                <div className="stat-value">-</div>
                <div className="stat-label">Total Patients</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faHospital} /></div>
                <div className="stat-value">-</div>
                <div className="stat-label">Doctors</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faHospital} /></div>
                <div className="stat-value">-</div>
                <div className="stat-label">Available Beds</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FontAwesomeIcon icon={faHospital} /></div>
                <div className="stat-value">-</div>
                <div className="stat-label">Today's Appointments</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Doctor Modal would be implemented as a component */}
      
      {/* Footer */}
      <footer>
        <div className="footer-container">
          {/* Footer Navigation */}
          <nav className="footer-nav">
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#awards">Awards</a>
            <a href="#help">Help</a>
            <a href="#contact">Contact</a>
          </nav>
          
          {/* Mission Statement */}
          <div className="mission-statement">
            <p>
              AROGYAKOSH provides comprehensive medical care with compassion and expertise.
              Our mission is to deliver high-quality healthcare tailored to individual patient needs.
              We believe in accessible healthcare for all and strive to innovate in providing medical services.
            </p>
          </div>
          
          {/* Social Media Icons */}
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" aria-label="Google">
              <FontAwesomeIcon icon={faGoogle} />
            </a>
            <a href="#" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a href="#" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
          
          {/* Contact Information */}
          <div className="contact-info">
            <div>
              <FontAwesomeIcon icon={faPhoneAlt} /> +1 (555) 123-4567
            </div>
            <div>
              <FontAwesomeIcon icon={faEnvelope} /> info@arogyakosh.com
            </div>
            <div>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Health Street, Medical Center
            </div>
          </div>
          
          {/* Copyright Text */}
          <div className="copyright">
            ©️ 2025 AROGYAKOSH. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HospitalDashboard;