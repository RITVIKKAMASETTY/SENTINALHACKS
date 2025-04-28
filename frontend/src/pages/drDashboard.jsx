import { useState, useEffect } from 'react';
import '../ui/drDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faRightFromBracket, faVolumeUp, faPhone, 
  faMapMarkerAlt, faPhoneAlt, faEnvelope, faPause 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, faTwitter, faGoogle, 
  faInstagram, faLinkedinIn, faGithub 
} from '@fortawesome/free-brands-svg-icons';

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    // Initialize Google Translate
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,kn,te,mr',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    // Add Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Make googleTranslateElementInit available globally
    window.googleTranslateElementInit = googleTranslateElementInit;

    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  useEffect(() => {
    // Function to get cookie value by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // Get the auth token from cookies
    const authToken = getCookie('authToken');
    // In a real application, you'd get the docId from route params or context
    const docId = new URLSearchParams(window.location.search).get('id') || 1; // Fallback to 1

    // Fetch doctor information from the API
    const fetchDoctorInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/doctor-dashboard/${docId}`, {
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
        setDoctorInfo(data.doctor);
        setAppointments(data.appointments || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctor information:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchDoctorInfo();
  }, []);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleSpeaking = () => {
    if (speaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    // Get the main content to read
    const contentToRead = document.querySelector('.main-content').textContent;
    
    const speechObj = new SpeechSynthesisUtterance();
    speechObj.text = contentToRead;
    speechObj.volume = 1;
    speechObj.rate = 1;
    speechObj.pitch = 1;
    
    // Use the language selected in Google Translate if possible
    const currentLang = document.querySelector('.goog-te-combo')?.value || 'en-US';
    speechObj.lang = currentLang;
    
    window.speechSynthesis.speak(speechObj);
    setSpeaking(true);
    setSpeech(speechObj);
    
    speechObj.onend = function() {
      setSpeaking(false);
    };
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="doctor-dashboard">
      {/* Background image */}
      <div className="bg-image">
        <img src="/api/placeholder/1200/800" alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      {/* Hamburger Menu Button */}
      <div className={`hamburger-menu ${sidebarActive ? 'active' : ''}`} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarActive && <div className="overlay" onClick={toggleSidebar}></div>}
      
      {/* Sidebar Navigation */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="logo">
          <div className="logo-icon">+</div>
          <div className="logo-text">AROGYAKOSH</div>
        </div>
        
        <div className="menu-item active">
          <FontAwesomeIcon icon={faUser} />
          <span>Doctor Dashboard</span>
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
          <button id="readAloudBtn" onClick={toggleSpeaking} title="Read page content aloud">
            <FontAwesomeIcon icon={speaking ? faPause : faVolumeUp} /> 
            {speaking ? 'Pause Reading' : 'Read Aloud'}
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Doctor Dashboard</h1>
        </div>
        
        {error && (
          <div className="error">
            Unable to load doctor information. Please try again later.
          </div>
        )}
        
        {loading && (
          <div className="loading">
            Loading doctor information...
          </div>
        )}
        
        {!loading && !error && doctorInfo && (
          <>
            <div className="content-card">
              <h2 className="card-title">Doctor Information</h2>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ marginRight: '20px', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{doctorInfo.name || 'N/A'}</h3>
                  <p style={{ margin: '5px 0', color: '#777' }}>Age: {doctorInfo.age || 'N/A'}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ margin: '5px 0' }}>
                    <FontAwesomeIcon icon={faPhone} /> {doctorInfo.contact || 'N/A'}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {doctorInfo.location || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="content-card">
              <h2 className="card-title">Professional Details</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', width: '30%' }}>License Number</td>
                      <td style={{ padding: '12px' }}>{doctorInfo.license || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="content-card">
              <h2 className="card-title">Upcoming Appointments</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Patient</th>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length > 0 ? (
                      appointments.map((appointment, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{appointment.patientName || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>{appointment.date || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>{appointment.time || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`status-indicator status-${appointment.status?.toLowerCase()}`}></span>
                            {appointment.status || 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '12px', textAlign: 'center', fontStyle: 'italic', color: '#777' }}>
                          No upcoming appointments
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      
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
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            <a href="#"><FontAwesomeIcon icon={faGithub} /></a>
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

export default DoctorDashboard;