

import { useState, useEffect } from 'react';
import '../ui/login.css';

// More explicit environment variable handling with fallback
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
console.log("API_BASE_URL:", API_BASE_URL); // Debug log

// API Configuration - add more debugging
const API_ENDPOINTS = {
  hospital: `${API_BASE_URL}/hospital-login/`,
  doctor: `${API_BASE_URL}/doctor-login/`,
  patient: `${API_BASE_URL}/patient-login/`,
  verify2fa: `${API_BASE_URL}/verify-2fa/`
};

// Log all endpoints to verify they're constructed correctly
console.log("API Endpoints:", API_ENDPOINTS);

// Dashboard URLs
const DASHBOARDS = {
  hospital: 'hospital-dashboard/',
  doctor: 'doctor-dashboard/',
  patient: 'patient-dashboard/'
};

function Login() {
  const [currentUserType, setCurrentUserType] = useState('hospital');
  const [web3Account, setWeb3Account] = useState(null);
  const [awaiting2FA, setAwaiting2FA] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    hospital: { username: '', password: '' },
    doctor: { username: '', password: '' },
    patient: { username: '', password: '', verificationCode: '' }
  });
  
  // UI states
  const [loading, setLoading] = useState({
    hospital: false,
    doctor: false,
    patient: false
  });
  
  const [error, setError] = useState({
    hospital: '',
    doctor: '',
    patient: ''
  });
  
  const [success, setSuccess] = useState({
    patient: ''
  });
  
  const [inputFocus, setInputFocus] = useState({});
  
  // MetaMask states
  const [metamaskConnecting, setMetamaskConnecting] = useState({
    hospital: false,
    doctor: false
  });

  useEffect(() => {
    // Check if MetaMask is already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWeb3Account(accounts[0]);
            console.log("MetaMask already connected with account:", accounts[0]);
          }
        })
        .catch(err => console.error("Error checking MetaMask connection:", err));
    }
    
    // Setup input animation handlers
    const inputs = document.querySelectorAll(".input");
    
    const addFocus = (e) => {
      setInputFocus(prev => ({...prev, [e.target.id]: true}));
    };
    
    const removeFocus = (e) => {
      if (e.target.value === "") {
        setInputFocus(prev => ({...prev, [e.target.id]: false}));
      }
    };
    
    inputs.forEach(input => {
      input.addEventListener("focus", addFocus);
      input.addEventListener("blur", removeFocus);
    });
    
    // Cleanup
    return () => {
      inputs.forEach(input => {
        input.removeEventListener("focus", addFocus);
        input.removeEventListener("blur", removeFocus);
      });
    };
  }, []);

  // Handle tab switching
  const setActiveTab = (userType) => {
    setCurrentUserType(userType);
    
    // Clear errors when switching tabs
    setError(prev => ({...prev, [userType]: ''}));
    
    // Reset 2FA state when switching tabs
    if (userType === 'patient') {
      resetPatient2FA();
    }
  };

  // Handle input changes
  const handleInputChange = (userType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [field]: value
      }
    }));
  };

  // Connect MetaMask
  const connectMetaMask = async (userType) => {
    // Reset any previous error
    setError(prev => ({...prev, [userType]: ''}));
    
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Show connecting state
        setMetamaskConnecting(prev => ({...prev, [userType]: true}));
        
        // Request accounts with retries
        let accounts = [];
        let retries = 3;
        
        while (retries > 0 && accounts.length === 0) {
          try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            break;
          } catch (err) {
            // If user rejected, don't retry
            if (err.code === 4001) {
              throw err;
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (accounts.length === 0) {
          throw new Error("Failed to get accounts after retries");
        }
        
        // Get the first account
        const account = accounts[0];
        setWeb3Account(account);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
          if (accounts.length === 0) {
            // User disconnected
            setWeb3Account(null);
          } else {
            // Account changed
            setWeb3Account(accounts[0]);
          }
        });
        
        console.log("MetaMask connected with address:", account);
        return account;
      } catch (error) {
        console.error('MetaMask connection failed:', error);
        setError(prev => ({
          ...prev, 
          [userType]: error.message || 'Failed to connect MetaMask. Please try again.'
        }));
        return null;
      } finally {
        setMetamaskConnecting(prev => ({...prev, [userType]: false}));
      }
    } else {
      setError(prev => ({
        ...prev, 
        [userType]: 'MetaMask is not installed. Please install it first.'
      }));
      return null;
    }
  };

  // Login handler
  const handleLogin = async (userType, e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(prev => ({...prev, [userType]: ''}));
    
    if (userType === 'patient') {
      setSuccess(prev => ({...prev, patient: ''}));
    }
    
    // Show loading
    setLoading(prev => ({...prev, [userType]: true}));

    // Prepare request data
    const requestData = {
      username: formData[userType].username,
      password: formData[userType].password
    };

    // For patient login with 2FA
    if (userType === 'patient' && awaiting2FA) {
      const verificationCode = formData.patient.verificationCode;
      
      if (!verificationCode) {
        setError(prev => ({...prev, patient: 'Please enter the verification code sent to your email.'}));
        setLoading(prev => ({...prev, patient: false}));
        return;
      }
      
      requestData.verification_code = verificationCode;
    }

    // Add wallet address for hospital and doctor
    if (userType !== 'patient') {
      // Check if MetaMask is connected
      if (!web3Account) {
        try {
          // Attempt to get accounts in case MetaMask is connected but web3Account wasn't set
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWeb3Account(accounts[0]);
            requestData.address = accounts[0].toLowerCase();
          } else {
            setError(prev => ({...prev, [userType]: 'Please connect your MetaMask wallet.'}));
            setLoading(prev => ({...prev, [userType]: false}));
            return;
          }
        } catch (error) {
          setError(prev => ({...prev, [userType]: 'Please connect your MetaMask wallet.'}));
          setLoading(prev => ({...prev, [userType]: false}));
          return;
        }
      } else {
        // Ensure address is in the correct format (lowercase for consistency)
        requestData.address = web3Account.toLowerCase();
      }
      console.log("Using wallet address for login:", requestData.address);
    }

    try {
      const endpoint = API_ENDPOINTS[userType];
      console.log(`Making request to ${endpoint}`);
      console.log("Request data:", JSON.stringify(requestData));
      
      // Make API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        credentials: 'include' // Include cookies in the request
      });

      // Log response status for debugging
      console.log(`Response status: ${response.status}`);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Handle HTTP error statuses
        let errorMessage = `Server error: ${response.status}`;
        let responseText = null;
        
        try {
          // Try to get the response text first
          responseText = await response.text();
          console.log("Error response text:", responseText);
          
          // Try to parse as JSON if it looks like JSON
          if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
            const errorData = JSON.parse(responseText);
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please check server configuration.';
          }
        }
        
        throw new Error(errorMessage);
      }

      // Try to get response text before parsing JSON
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      // Parse JSON only if we have a valid response
      const data = responseText ? JSON.parse(responseText) : {};
      console.log("Parsed response:", data);

      // Check if 2FA is required for patient
      if (userType === 'patient' && data.requires_verification) {
        // Show success message and enable 2FA flow
        setSuccess(prev => ({...prev, patient: data.message}));
        setAwaiting2FA(true);
      } else {
        // Store token and ID in cookies
        setCookie('authToken', data.token, 7);

        // Store appropriate ID based on user type
        let id;
        if (userType === 'hospital') {
          setCookie('hospId', data.hospId, 7);
          id = data.hospId;
        } else if (userType === 'doctor') {
          setCookie('docId', data.docId, 7);
          id = data.docId;
        } else {
          setCookie('patId', data.patId, 7);
          id = data.patId;
        }

        // Store user type
        setCookie('userType', userType, 7);

        // Redirect to appropriate dashboard with ID
        const redirectUrl = `/route/${DASHBOARDS[userType]}${id}`;
        console.log(`Redirecting to: ${redirectUrl}`);
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(prev => ({...prev, [userType]: error.message || 'An error occurred. Please try again later.'}));
      
      // Reset 2FA state if there was an error
      if (userType === 'patient' && awaiting2FA) {
        resetPatient2FA();
      }
    } finally {
      // Hide loading indicator
      setLoading(prev => ({...prev, [userType]: false}));
    }
  };

  // Reset 2FA state
  const resetPatient2FA = () => {
    setAwaiting2FA(false);
    setFormData(prev => ({
      ...prev,
      patient: {
        ...prev.patient,
        verificationCode: ''
      }
    }));
  };

  // 2FA verification
  const verifyPatient2FA = async (e) => {
    e.preventDefault();
    
    const verificationCode = formData.patient.verificationCode;
    
    // Clear previous error messages
    setError(prev => ({...prev, patient: ''}));
    
    if (!verificationCode) {
      setError(prev => ({...prev, patient: 'Please enter the verification code sent to your email.'}));
      return;
    }
    
    // Show loading indicator
    setLoading(prev => ({...prev, patient: true}));

    try {
      console.log("Making request to verify 2FA:", API_ENDPOINTS.verify2fa);
      
      // Make API request
      const response = await fetch(API_ENDPOINTS.verify2fa, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ verification_code: verificationCode }),
        credentials: 'include' // Include cookies in the request
      });

      console.log(`2FA verification response status: ${response.status}`);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Handle HTTP error statuses
        let errorMessage = `Server error: ${response.status}`;
        let responseText = null;
        
        try {
          // Try to get the response text first
          responseText = await response.text();
          console.log("Error response text:", responseText);
          
          // Try to parse as JSON if it looks like JSON
          if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
            const errorData = JSON.parse(responseText);
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        
        throw new Error(errorMessage);
      }

      // Try to get response text before parsing JSON
      const responseText = await response.text();
      console.log("2FA response text:", responseText);
      
      // Parse JSON only if we have a valid response
      const data = responseText ? JSON.parse(responseText) : {};
      console.log("Parsed 2FA response:", data);

      // Store token and ID in cookies
      setCookie('authToken', data.token, 7);
      setCookie('patId', data.patId, 7);
      setCookie('userType', 'patient', 7);

      // Redirect to patient dashboard
      const redirectUrl = `/route/${DASHBOARDS.patient}${data.patId}`;
      console.log(`Redirecting to: ${redirectUrl}`);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Verification error:', error);
      setError(prev => ({...prev, patient: error.message || 'An error occurred. Please try again later.'}));
    } finally {
      // Hide loading indicator
      setLoading(prev => ({...prev, patient: false}));
    }
  };

  // Utility function to set cookies
  const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
  };

  return (
    <>
      <div className="backgroundimg">
        <img src="https://i.ibb.co/5ffp7qF/wave.png" alt="wave" />
      </div>
      
      <div className="container">
        <div className="img">
          <img src="https://i.ibb.co/wZCxpzRg/bg.png" alt="bg" />
        </div>
        <div className="login-content">
          <div>
            <img src="https://i.ibb.co/27BtpVrK/avatar.png" alt="avatar" />
            
            <h2 className="title">Welcome</h2>
            
            <div className="tabs">
              <button 
                className={`tab-btn ${currentUserType === 'hospital' ? 'active' : ''}`} 
                onClick={() => setActiveTab('hospital')}
              >
                Hospital
              </button>
              <button 
                className={`tab-btn ${currentUserType === 'doctor' ? 'active' : ''}`} 
                onClick={() => setActiveTab('doctor')}
              >
                Doctor
              </button>
              <button 
                className={`tab-btn ${currentUserType === 'patient' ? 'active' : ''}`} 
                onClick={() => setActiveTab('patient')}
              >
                Patient
              </button>
            </div>
            
            {/* Hospital Login Form */}
            <form 
              className={`form-container ${currentUserType === 'hospital' ? 'active' : ''}`}
              onSubmit={(e) => handleLogin('hospital', e)}
            >
              <div className={`input-div one ${inputFocus['hospital-username'] || formData.hospital.username ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="div">
                  <h5>Hospital ID</h5>
                  <input 
                    type="text" 
                    className="input" 
                    id="hospital-username"
                    value={formData.hospital.username}
                    onChange={(e) => handleInputChange('hospital', 'username', e.target.value)}
                  />
                </div>
              </div>
              <div className={`input-div pass ${inputFocus['hospital-password'] || formData.hospital.password ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input 
                    type="password" 
                    className="input" 
                    id="hospital-password"
                    value={formData.hospital.password}
                    onChange={(e) => handleInputChange('hospital', 'password', e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="button" 
                className="metamask-btn" 
                onClick={() => connectMetaMask('hospital')}
                disabled={metamaskConnecting.hospital}
              >
                <div className="metamask-icon">🦊</div>
                {web3Account ? 'Connected' : metamaskConnecting.hospital ? 'Connecting...' : 'Connect MetaMask'}
              </button>
              {web3Account && <div className="confirmation" style={{display: 'block'}}></div>}
              {web3Account && <div className="metamask-address" style={{display: 'block'}}>Wallet Address: {web3Account}</div>}
              {error.hospital && <div className="error-message" style={{display: 'block'}}>{error.hospital}</div>}
              <button 
                type="submit" 
                className="btn" 
                disabled={loading.hospital}
              >
                {loading.hospital ? 'Loading...' : 'Login'}
              </button>
            </form>
            
            {/* Doctor Login Form */}
            <form 
              className={`form-container ${currentUserType === 'doctor' ? 'active' : ''}`}
              onSubmit={(e) => handleLogin('doctor', e)}
            >
              <div className={`input-div one ${inputFocus['doctor-username'] || formData.doctor.username ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="div">
                  <h5>Doctor ID</h5>
                  <input 
                    type="text" 
                    className="input" 
                    id="doctor-username"
                    value={formData.doctor.username}
                    onChange={(e) => handleInputChange('doctor', 'username', e.target.value)}
                  />
                </div>
              </div>
              <div className={`input-div pass ${inputFocus['doctor-password'] || formData.doctor.password ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input 
                    type="password" 
                    className="input" 
                    id="doctor-password"
                    value={formData.doctor.password}
                    onChange={(e) => handleInputChange('doctor', 'password', e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="button" 
                className="metamask-btn" 
                onClick={() => connectMetaMask('doctor')}
                disabled={metamaskConnecting.doctor}
              >
                <div className="metamask-icon">🦊</div>
                {web3Account ? 'Connected' : metamaskConnecting.doctor ? 'Connecting...' : 'Connect MetaMask'}
              </button>
              {web3Account && <div className="confirmation" style={{display: 'block'}}></div>}
              {web3Account && <div className="metamask-address" style={{display: 'block'}}>Wallet Address: {web3Account}</div>}
              {error.doctor && <div className="error-message" style={{display: 'block'}}>{error.doctor}</div>}
              <button 
                type="submit" 
                className="btn" 
                disabled={loading.doctor}
              >
                {loading.doctor ? 'Loading...' : 'Login'}
              </button>
            </form>
            
            {/* Patient Login Form */}
            <form 
              className={`form-container ${currentUserType === 'patient' ? 'active' : ''}`}
              onSubmit={(e) => handleLogin('patient', e)}
            >
              <div className={`input-div one ${inputFocus['patient-username'] || formData.patient.username ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div">
                  <h5>Patient ID</h5>
                  <input 
                    type="text" 
                    className="input" 
                    id="patient-username"
                    value={formData.patient.username}
                    onChange={(e) => handleInputChange('patient', 'username', e.target.value)}
                  />
                </div>
              </div>
              <div className={`input-div pass ${inputFocus['patient-password'] || formData.patient.password ? 'focus' : ''}`}>
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input 
                    type="password" 
                    className="input" 
                    id="patient-password"
                    value={formData.patient.password}
                    onChange={(e) => handleInputChange('patient', 'password', e.target.value)}
                  />
                </div>
              </div>
              {error.patient && <div className="error-message" style={{display: 'block'}}>{error.patient}</div>}
              {success.patient && <div className="success-message" style={{display: 'block'}}>{success.patient}</div>}
              
              {/* 2FA Verification Section */}
              {awaiting2FA && (
                <div className="verification-container" style={{display: 'block'}}>
                  <div className={`input-div one ${inputFocus['verification-code'] || formData.patient.verificationCode ? 'focus' : ''}`}>
                    <div className="i">
                      <i className="fas fa-key"></i>
                    </div>
                    <div className="div">
                      <h5>Verification Code</h5>
                      <input 
                        type="text" 
                        className="input" 
                        id="verification-code"
                        value={formData.patient.verificationCode}
                        onChange={(e) => handleInputChange('patient', 'verificationCode', e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={verifyPatient2FA}
                    disabled={loading.patient}
                  >
                    Verify
                  </button>
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn" 
                disabled={loading.patient}
              >
                {loading.patient ? 'Loading...' : awaiting2FA ? 'Submit Code' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;