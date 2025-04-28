// src/App.jsx
import { useState, useEffect } from 'react';
import '../ui/viewDoc.css';

function App() {
  const [currentTab, setCurrentTab] = useState('patientDoc');
  const [patientRequests, setPatientRequests] = useState([]);
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [loading, setLoading] = useState({ patient: true, hospital: true });
  const [error, setError] = useState({ patient: null, hospital: null });
  const [notification, setNotification] = useState({ message: '', isError: false, visible: false });

  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

  // Helper function for making authenticated API requests
  const makeAuthRequest = async (url, method = 'GET', body = null) => {
    const authToken = getCookie('authToken');
    const csrftoken = getCookie('csrftoken');
    
    const headers = {
      'Authorization': `Token ${authToken}`,
      'Content-Type': 'application/json'
    };
    
    if (csrftoken) {
      headers['X-CSRFToken'] = csrftoken;
    }
    
    const options = {
      method,
      headers,
      credentials: 'include'
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${url}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    return response.json();
  };

  // Function to get cookie by name
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Function to fetch patient document requests
  const fetchPatientRequests = async () => {
    setLoading(prev => ({ ...prev, patient: true }));
    setError(prev => ({ ...prev, patient: null }));
    
    try {
      const data = await makeAuthRequest('/patient-req-list/');
      setPatientRequests(data);
    } catch (error) {
      setError(prev => ({ ...prev, patient: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, patient: false }));
    }
  };

  // Function to fetch hospital document requests
  const fetchHospitalRequests = async () => {
    setLoading(prev => ({ ...prev, hospital: true }));
    setError(prev => ({ ...prev, hospital: null }));
    
    try {
      const data = await makeAuthRequest('/hospital-request-list/');
      setHospitalRequests(data);
    } catch (error) {
      setError(prev => ({ ...prev, hospital: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, hospital: false }));
    }
  };

  // Function to handle patient document access change
  const changePatientAccess = async (requestId) => {
    try {
      await makeAuthRequest('/change-patient-access/', 'POST', {
        doc: requestId
      });
      
      showNotification('Access permission updated successfully');
      fetchPatientRequests(); // Refresh the list
    } catch (error) {
      showNotification(error.message, true);
    }
  };

  // Function to handle hospital document access change
  const changeHospitalAccess = async (docId, userId) => {
    try {
      await makeAuthRequest('/change-hospital-access/', 'POST', {
        doc: docId,
        user: userId
      });
      
      showNotification('Access permission updated successfully');
      fetchHospitalRequests(); // Refresh the list
    } catch (error) {
      showNotification(error.message, true);
    }
  };

  // Function to decline patient document request
  const declinePatientRequest = async (requestId) => {
    try {
      await makeAuthRequest('/decline-patient-req/', 'POST', {
        id: requestId
      });
      
      showNotification('Request declined successfully');
      fetchPatientRequests(); // Refresh the list
    } catch (error) {
      showNotification(error.message, true);
    }
  };

  // Function to decline hospital document request
  const declineHospitalRequest = async (requestId) => {
    try {
      await makeAuthRequest('/decline-hospital-request/', 'POST', {
        id: requestId
      });
      
      showNotification('Request declined successfully');
      fetchHospitalRequests(); // Refresh the list
    } catch (error) {
      showNotification(error.message, true);
    }
  };

  // Function to show notification
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError, visible: true });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Helper function for status text
  const getStatusText = (sanctioned, declined) => {
    if (declined) return 'Declined';
    if (sanctioned) return 'Approved';
    return 'Pending';
  };

  // Helper function for status class
  const getStatusClass = (sanctioned, declined) => {
    if (declined) return 'status-declined';
    if (sanctioned) return 'status-approved';
    return 'status-pending';
  };

  // Function to switch tabs
  const switchTab = (tab) => {
    setCurrentTab(tab);
    
    // Fetch data when switching to tab
    if (tab === 'patientDoc') {
      fetchPatientRequests();
    } else if (tab === 'hospitalDoc') {
      fetchHospitalRequests();
    }
  };

  // Initialize the page
  useEffect(() => {
    fetchPatientRequests();
    // Also fetch hospital requests initially
    fetchHospitalRequests();
  }, []);

  return (
    <div className="container">
      <h1>Document Access Management</h1>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${currentTab === 'patientDoc' ? 'tab-active' : ''}`} 
          onClick={() => switchTab('patientDoc')}
        >
          Patient Document Requests
        </button>
        <button 
          className={`tab ${currentTab === 'hospitalDoc' ? 'tab-active' : ''}`} 
          onClick={() => switchTab('hospitalDoc')}
        >
          Hospital Document Requests
        </button>
      </div>
      
      {/* Patient Document Requests Section */}
      <div className={`request-section ${currentTab !== 'patientDoc' ? 'hidden' : ''}`}>
        {loading.patient ? (
          <p className="message">Loading patient document requests...</p>
        ) : error.patient ? (
          <p className="error-message">{error.patient}</p>
        ) : patientRequests.length === 0 ? (
          <p className="message">No patient document requests found</p>
        ) : (
          <div className="request-list">
            {patientRequests.map(req => (
              <div className="request-card" key={req.id}>
                <div className="request-info">
                  <h3>{req.doc.title || 'Document ' + req.doc.name}</h3>
                  <p>Requested by: {req.to.username || 'User ' + req.to.username}</p>
                  <p>Status: 
                    <span className={getStatusClass(req.sanctioned, req.declined)}>
                      {getStatusText(req.sanctioned, req.declined)}
                    </span>
                  </p>
                </div>
                <div className="action-buttons">
                  {!req.declined && (
                    <>
                      <button 
                        onClick={() => changePatientAccess(req.id)}
                        className={req.sanctioned ? 'btn-revoke' : 'btn-approve'}
                      >
                        {req.sanctioned ? 'Revoke' : 'Approve'}
                      </button>
                      {!req.sanctioned && (
                        <button 
                          onClick={() => declinePatientRequest(req.id)}
                          className="btn-decline"
                        >
                          Decline
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hospital Document Requests Section */}
      <div className={`request-section ${currentTab !== 'hospitalDoc' ? 'hidden' : ''}`}>
        {loading.hospital ? (
          <p className="message">Loading hospital document requests...</p>
        ) : error.hospital ? (
          <p className="error-message">{error.hospital}</p>
        ) : hospitalRequests.length === 0 ? (
          <p className="message">No hospital document requests found</p>
        ) : (
          <div className="request-list">
            {hospitalRequests.map(req => (
              <div className="request-card" key={req.id}>
                <div className="request-info">
                  <h3>{req.doc.title || 'Document ' + req.doc.name}</h3>
                  <p>Hospital: {req.doc.hospitalLedger?.hospital?.name || 'Unknown'}</p>
                  <p>Requested by: {req.to.username}</p>
                  <p>Status: 
                    <span className={getStatusClass(req.sanctioned, req.declined)}>
                      {getStatusText(req.sanctioned, req.declined)}
                    </span>
                  </p>
                </div>
                <div className="action-buttons">
                  {!req.declined && (
                    <>
                      <button 
                        onClick={() => changeHospitalAccess(req.id, req.to.id)}
                        className={req.sanctioned ? 'btn-revoke' : 'btn-approve'}
                      >
                        {req.sanctioned ? 'Revoke' : 'Approve'}
                      </button>
                      {!req.sanctioned && (
                        <button 
                          onClick={() => declineHospitalRequest(req.id)}
                          className="btn-decline"
                        >
                          Decline
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Notification */}
      {notification.visible && (
        <div className={`notification ${notification.isError ? 'notification-error' : 'notification-success'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;