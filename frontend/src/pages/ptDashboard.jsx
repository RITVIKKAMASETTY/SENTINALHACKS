// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import '../ui/ptDashboard.css';

// // Font Awesome import
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faUser, faUserDoctor, faUniversalAccess, faMessage, 
//   faEye, faRightFromBracket, faVolumeUp, faPause, faSearch, 
//   faEdit, faTrash, faLock, faUnlock, faEllipsisV, faPlus,
//   faFilePdf, faFileImage, faFileWord, faFileExcel, faFlask,
//   faPrescription, faFileMedical, faFileInvoiceDollar, faSignature,
//   faNotesMedical, faFileMedicalAlt, faPhoneAlt, faEnvelope, faMapMarkerAlt
// } from '@fortawesome/free-solid-svg-icons';
// import { 
//   faFacebookF, faTwitter, faGoogle, faInstagram, faLinkedinIn, faGithub 
// } from '@fortawesome/free-brands-svg-icons';

// // Import Configuration
// const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

// // Utility Functions
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return '';
// };

// const getDocumentIcon = (docType) => {
//   const iconMap = {
//     'pdf': faFilePdf,
//     'image': faFileImage,
//     'doc': faFileWord,
//     'xls': faFileExcel,
//     'lab': faFlask,
//     'prescription': faPrescription,
//     'report': faFileMedical,
//     'insurance': faFileInvoiceDollar,
//     'consent': faSignature,
//     'history': faNotesMedical
//   };
//   return iconMap[docType?.toLowerCase()] || faFileMedicalAlt;
// };

// // Toast Component
// const Toast = ({ message, type, onClose }) => {
//   const toastRef = useRef(null);

//   useEffect(() => {
//     const toast = toastRef.current;
//     if (toast) {
//       setTimeout(() => {
//         toast.classList.add('show');
//       }, 10);
//     }
//   }, []);

//   return (
//     <div className={`toast ${type}`} ref={toastRef}>
//       <div className="toast-icon">
//         {type === 'success' && '✓'}
//         {type === 'error' && '✕'}
//         {type === 'info' && 'ℹ'}
//         {type === 'warning' && '⚠'}
//       </div>
//       <div className="toast-content">
//         <span className="toast-message">{message}</span>
//         <button className="toast-close" onClick={onClose}>×</button>
//       </div>
//       <div className="toast-progress">
//         <div className="toast-progress-bar" style={{ animationDuration: '3000ms' }}></div>
//       </div>
//     </div>
//   );
// };

// // Toast Container Component
// const ToastContainer = ({ toasts, removeToast }) => {
//   return (
//     <div id="toast-container" className="toast-container">
//       {toasts.map((toast, index) => (
//         <Toast 
//           key={index}
//           message={toast.message}
//           type={toast.type}
//           onClose={() => removeToast(index)}
//         />
//       ))}
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ isActive, onOverlayClick }) => {
//   return (
//     <>
//       <div className="overlay" id="overlay" onClick={onOverlayClick} style={{ display: isActive ? 'block' : 'none' }}></div>
//       <div className={`sidebar ${isActive ? 'active' : ''}`} id="sidebar">
//         <div className="logo">
//           <div className="logo-icon">+</div>
//           <div className="logo-text">AROGYAKOSH</div>
//         </div>
        
//         <div className="menu-item active">
//           <FontAwesomeIcon icon={faUser} />
//           <span>Patient Dashboard</span>
//         </div>
        
//         <div className="menu-item">
//           <FontAwesomeIcon icon={faUserDoctor} />
//           <span>
//             <a href="/chat_page" style={{ textDecoration: 'none', color: 'inherit' }}>Virtual Doctor</a>
//           </span>
//         </div>

//         <div className="menu-item">
//           <FontAwesomeIcon icon={faUniversalAccess} />
//           <span>
//             <a href="/access" style={{ textDecoration: 'none', color: 'inherit' }}>View Request Access</a>
//           </span>
//         </div>
        
//         <div className="menu-item">
//           <FontAwesomeIcon icon={faMessage} />
//           <span>
//             <a href="/community" style={{ textDecoration: 'none', color: 'inherit' }}>Community</a>
//           </span>
//         </div>
        
//         <div className="menu-item">
//           <FontAwesomeIcon icon={faEye} />
//           <span>
//             <a href="https://d7d5-2401-4900-61b3-9c34-412e-3b80-b926-274.ngrok-free.app/" style={{ textDecoration: 'none', color: 'inherit' }}>VibeSync</a>
//           </span>
//         </div>
        
//         <div className="menu-item">
//           <FontAwesomeIcon icon={faRightFromBracket} />
//           <span>
//             <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</a>
//           </span>
//         </div>
        
//         <div id="google_translate_element"></div>
        
//         <div className="menu-item">
//           <button id="readAloudBtn" title="Read page content aloud">
//             <FontAwesomeIcon icon={faVolumeUp} /> Read Aloud
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // Document Card Component
// const DocumentCard = ({ doc, isUserAuthorized, onToggleVisibility, onConfirmDelete }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     setIsMenuOpen(!isMenuOpen);
//   };
  
//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       setIsMenuOpen(false);
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);
  
//   return (
//     <div className="document-card" data-id={doc.id}>
//       {isUserAuthorized && (
//         <div className="document-menu">
//           <FontAwesomeIcon 
//             icon={faEllipsisV} 
//             className="menu-trigger" 
//             onClick={toggleMenu} 
//           />
//           <div className={`document-menu-options ${isMenuOpen ? 'active' : ''}`}>
//             <div 
//               className="menu-option edit-option" 
//               onClick={() => onToggleVisibility(doc.id, doc.isHospital)}
//             >
//               <FontAwesomeIcon icon={faEdit} /> {doc.isPrivate ? 'Make Public' : 'Make Private'}
//             </div>
//             <div 
//               className="menu-option delete-option" 
//               onClick={() => onConfirmDelete(doc.id, doc.isHospital)}
//             >
//               <FontAwesomeIcon icon={faTrash} /> Delete
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="document-icon">
//         <FontAwesomeIcon icon={getDocumentIcon(doc.type || 'unknown')} />
//       </div>
//       <div className="document-title">{doc.title}</div>
//       <div className="document-date">{doc.date}</div>
//       <div className="document-visibility">
//         <FontAwesomeIcon icon={doc.isPrivate ? faLock : faUnlock} /> {doc.isPrivate ? 'Private' : 'Public'}
//       </div>
//       <DocumentAccessControl 
//         docId={doc.id} 
//         isHospital={doc.isHospital} 
//       />
//     </div>
//   );
// };

// // Document Access Control Component
// const DocumentAccessControl = ({ docId, isHospital }) => {
//   const [accessStatus, setAccessStatus] = useState('loading');
//   const authToken = getCookie('authToken');
//   const { id: patientId } = useParams();
  
//   useEffect(() => {
//     checkDocumentAccess();
//   }, [docId, isHospital]);
  
//   const checkDocumentAccess = async () => {
//     setAccessStatus('loading');
//     try {
//       const endpoint = isHospital 
//         ? `${BASE_URL}/hospital-document-check/${docId}`
//         : `${BASE_URL}/patient-document-access/${docId}`;
        
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Authorization': authToken ? `Token ${authToken}` : ''
//         }
//       });
      
//       if (response.status === 200) {
//         setAccessStatus('granted');
//       } else if (response.status === 401 || response.status === 403) {
//         setAccessStatus('denied');
//       } else {
//         setAccessStatus('error');
//       }
//     } catch (error) {
//       console.error(`Error checking document access for ID ${docId}:`, error);
//       setAccessStatus('error');
//     }
//   };
  
//   const viewDocument = async () => {
//     try {
//       setAccessStatus('loading');
      
//       const endpoint = isHospital
//         ? `${BASE_URL}/hospital-documents-view/${docId}/`
//         : `${BASE_URL}/patients/${patientId}/documents/${docId}/`;
      
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Token ${authToken}`
//         }
//       });
      
//       if (response.status === 401 || response.status === 403) {
//         setAccessStatus('denied');
//         throw new Error("Not authorized to view this document");
//       }
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch document: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.url) {
//         setAccessStatus('granted');
//         window.open(data.url, '_blank');
//       } else {
//         throw new Error('No URL in response');
//       }
//     } catch (error) {
//       console.error(`Error viewing document ${docId}:`, error);
//       setAccessStatus('error');
      
//       if (error.message === "Not authorized to view this document") {
//         alert("You don't have permission to view this document. Please request access.");
//       } else {
//         alert('Error accessing document. Please try again.');
//       }
//     }
//   };
  
//   const requestAccess = async () => {
//     try {
//       const endpoint = isHospital
//         ? `${BASE_URL}/create-hospital-req/`
//         : `${BASE_URL}/create-patient-req/`;
      
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Token ${authToken}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ doc: docId })
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === 'success') {
//           alert('Access request submitted successfully');
//         } else if (data.message) {
//           alert(data.message);
//         } else {
//           alert('Failed to submit access request');
//         }
//       } else {
//         throw new Error('Failed to submit access request');
//       }
//     } catch (error) {
//       console.error(`Error requesting access for document ${docId}:`, error);
//       alert('Error requesting access');
//     }
//   };
  
//   const renderButton = () => {
//     switch (accessStatus) {
//       case 'loading':
//         return <div className="loading">Checking access...</div>;
//       case 'granted':
//         return (
//           <button className="doc-btn view-btn" onClick={viewDocument}>
//             View Document
//           </button>
//         );
//       case 'denied':
//         return (
//           <button className="doc-btn request-btn" onClick={requestAccess}>
//             Request Access
//           </button>
//         );
//       case 'error':
//         return (
//           <button className="doc-btn error-btn" onClick={checkDocumentAccess}>
//             Retry Access Check
//           </button>
//         );
//       default:
//         return <div className="error">Unknown status</div>;
//     }
//   };
  
//   return (
//     <div 
//       id={`${isHospital ? 'hospital' : 'patient'}-access-control-${docId}`} 
//       className="document-access-control"
//     >
//       {renderButton()}
//     </div>
//   );
// };

// // Delete Confirmation Modal Component
// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
//   const [verificationCode, setVerificationCode] = useState('');
  
//   if (!isOpen) return null;
  
//   return (
//     <div id="delete-verification-modal" className="modal" style={{ display: 'block' }}>
//       <div className="modal-content">
//         <span className="close-modal" onClick={onClose}>×</span>
//         <h2>Confirm Document Deletion</h2>
//         <p>Please enter your verification code to delete this document:</p>
//         <input 
//           type="password" 
//           id="verification-code" 
//           className="verification-input" 
//           placeholder="Verification Code"
//           value={verificationCode}
//           onChange={(e) => setVerificationCode(e.target.value)}
//         />
//         <div className="modal-buttons">
//           <button id="cancel-delete" className="btn btn-secondary" onClick={onClose}>
//             Cancel
//           </button>
//           <button 
//             id="confirm-delete" 
//             className="btn btn-danger" 
//             onClick={() => onConfirm(verificationCode)}
//           >
//             Delete Document
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Document Slider Component
// const DocumentSlider = ({ title, documents, isUserAuthorized, onToggleVisibility, onConfirmDelete }) => {
//   const sliderRef = useRef(null);

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   return (
//     <>
//       <h3>{title}</h3>
//       <div className="slider-container">
//         <button className="slider-arrow left" onClick={scrollLeft}>←</button>
//         <div className="slider" id={`${title.toLowerCase().replace(/\s+/g, '-')}-slider`} ref={sliderRef}>
//           {documents.length > 0 ? (
//             documents.map((doc) => (
//               <DocumentCard 
//                 key={doc.id}
//                 doc={doc}
//                 isUserAuthorized={isUserAuthorized}
//                 onToggleVisibility={onToggleVisibility}
//                 onConfirmDelete={onConfirmDelete}
//               />
//             ))
//           ) : (
//             <p className="empty-message">No {title.toLowerCase()} found.</p>
//           )}
//         </div>
//         <button className="slider-arrow right" onClick={scrollRight}>→</button>
//       </div>
//     </>
//   );
// };

// // Patient Information Component
// const PatientInfo = ({ patient }) => {
//   return (
//     <div className="content-card">
//       <h2 className="card-title">Patient Information</h2>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <div style={{ marginRight: '20px', marginBottom: '10px' }}>
//           <h3 style={{ margin: 0, fontSize: '18px' }}>{patient.name || ''}</h3>
//           <p style={{ margin: '5px 0', color: '#777' }}>{patient.age || ''}</p>
//           <p style={{ margin: '5px 0' }}>{patient.bloodGroup || ''}</p>
//           <p style={{ margin: '5px 0' }}>Contact: {patient.contact || ''}</p>
//           <p style={{ margin: '5px 0' }}>Emergency Contact: {patient.emergencyContact || ''}</p>
//           <p style={{ margin: '5px 0' }}>Address: {patient.address || ''}</p>
//         </div>
//         <div className="qr-code-section">
//           <div className="qr-code-title">PATIENT QR CODE</div>
//           <img 
//             id="patient-qr-code" 
//             className="qr-code" 
//             alt="Patient QR Code" 
//             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=patient:${patient.id}`}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Auth Section Component
// const AuthSection = ({ isUserAuthorized, isLoading, onAddDocument }) => {
//   const navigate = useNavigate();
  
//   const redirectToLogin = () => {
//     localStorage.setItem('redirectAfterLogin', window.location.href);
//     navigate('/login');
//   };
  
//   if (isLoading) {
//     return <div className="loading">Checking authorization...</div>;
//   }
  
//   if (isUserAuthorized) {
//     return (
//       <button className="add-doc-btn" onClick={onAddDocument}>
//         <FontAwesomeIcon icon={faPlus} /> Add Document
//       </button>
//     );
//   }
  
//   return (
//     <>
//       <div className="error">You need to log in to access this patient's dashboard</div>
//       <button className="login-btn" onClick={redirectToLogin}>
//         Login
//       </button>
//     </>
//   );
// };

// // Footer Component
// const Footer = () => {
//   return (
//     <footer>
//       <div className="footer-container">
//         <nav className="footer-nav">
//           <a href="#about">About Us</a>
//           <a href="#services">Services</a>
//           <a href="#awards">Awards</a>
//           <a href="#help">Help</a>
//           <a href="#contact">Contact</a>
//         </nav>
        
//         <div className="mission-statement">
//           <p>
//             AROGYAKOSH provides comprehensive medical care with compassion and expertise.
//             Our mission is to deliver high-quality healthcare tailored to individual patient needs.
//             We believe in accessible healthcare for all and strive to innovate in providing medical services.
//           </p>
//         </div>
        
//         <div className="social-icons">
//           <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
//           <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
//           <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
//           <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
//           <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
//           <a href="#"><FontAwesomeIcon icon={faGithub} /></a>
//         </div>
        
//         <div className="contact-info">
//           <div>
//             <FontAwesomeIcon icon={faPhoneAlt} /> +919620146061
//           </div>
//           <div>
//             <FontAwesomeIcon icon={faEnvelope} /> arogyakoshh@gmail.com
//           </div>
//           <div>
//             <FontAwesomeIcon icon={faMapMarkerAlt} /> Mumbai
//           </div>
//         </div>
        
//         <div className="copyright">
//           ©️ 2025 AROGYAKOSH. All Rights Reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// // Main Patient Dashboard Component
// const PatientDashboard = () => {
//   const { id: patientId } = useParams();
//   const navigate = useNavigate();
//   const [sidebarActive, setSidebarActive] = useState(false);
//   const [patient, setPatient] = useState({});
//   const [personalDocs, setPersonalDocs] = useState([]);
//   const [hospitalDocs, setHospitalDocs] = useState([]);
//   const [isUserAuthorized, setIsUserAuthorized] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [toasts, setToasts] = useState([]);
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     docId: null,
//     isHospital: null
//   });
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const speechRef = useRef(null);
  
//   // Toggle sidebar
//   const toggleSidebar = () => {
//     setSidebarActive(!sidebarActive);
//   };
  
//   // Check patient authorization
//   const checkPatientAuth = async () => {
//     setIsCheckingAuth(true);
//     const authTimeout = setTimeout(() => {
//       console.log("Auth check timed out - showing fallback UI");
//       setIsUserAuthorized(false);
//       setIsCheckingAuth(false);
//     }, 3000);
    
//     try {
//       const authToken = getCookie('authToken');
//       if (!authToken || authToken.length < 10) {
//         clearTimeout(authTimeout);
//         setIsUserAuthorized(false);
//         setIsCheckingAuth(false);
//         return;
//       }
      
//       const response = await fetch(`${BASE_URL}/check-patient/${patientId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Token ${authToken}`
//         }
//       });
      
//       clearTimeout(authTimeout);
//       if (response.status === 200) {
//         setIsUserAuthorized(true);
//       } else if (response.status === 401 || response.status === 403) {
//         setIsUserAuthorized(false);
//       } else {
//         setIsUserAuthorized(false);
//         showToast("Access denied. Please contact support.", "error");
//       }
//     } catch (error) {
//       clearTimeout(authTimeout);
//       console.error("Error checking patient authorization:", error);
//       setIsUserAuthorized(false);
//       showToast("Connection error. Please try again.", "error");
//     } finally {
//       setIsCheckingAuth(false);
//     }
//   };
  
//   // Fetch patient details
//   const fetchPatientDetails = async () => {
//     try {
//       const authToken = getCookie('authToken');
//       const response = await fetch(`${BASE_URL}/patient-dashboard/${patientId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': authToken ? `Token ${authToken}` : ''
//         }
//       });
      
//       if (response.status === 401 || response.status === 403) {
//         setIsUserAuthorized(false);
//         await checkPatientAuth();
//         return;
//       }
      
//       const data = await response.json();
//       if (data.patient) {
//         setPatient({
//           ...data.patient,
//           id: patientId // Ensure patient ID is included
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching patient details:", error);
//     }
//   };
  
//   // Fetch patient documents
//   const fetchPatientDocuments = async () => {
//     try {
//       const authToken = getCookie('authToken');
//       const response = await fetch(`${BASE_URL}/patient-documents/${patientId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': authToken ? `Token ${authToken}` : ''
//         }
//       });
      
//       if (response.status === 401 || response.status === 403) {
//         setIsUserAuthorized(false);
//         await checkPatientAuth();
//         return;
//       }
      
//       const data = await response.json();
      
//       if (data.patient) {
//         const formattedPersonalDocs = data.patient.map(doc => ({
//           id: doc.id,
//           title: doc.name || 'Unnamed Document',
//           date: new Date(doc.added).toLocaleDateString(),
//           type: doc.type || 'unknown',
//           isPrivate: doc.isPrivate || false,
//           isHospital: false
//         }));
//         setPersonalDocs(formattedPersonalDocs);
//       }
      
//       if (data.hospital) {
//         const formattedHospitalDocs = data.hospital.map(doc => ({
//           id: doc.id,
//           title: doc.name || 'Unnamed Document',
//           date: new Date(doc.added).toLocaleDateString(),
//           type: doc.type || 'unknown',
//           isPrivate: doc.isPrivate || false,
//           isHospital: true
//         }));
//         setHospitalDocs(formattedHospitalDocs);
//       }
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//       showToast("Error fetching documents.", "error");
//     }
//   };
  
//   // Add document handler
//   const handleAddDocument = () => {
//     if (!isUserAuthorized || !validateAuthToken()) {
//       showToast("Authorization failed. Please log in again to add documents.", "error");
//       redirectToLogin();
//       return;
//     }
//     navigate(`/patient-upload/?patient=${patientId}`);
//   };
  
//   // Toggle visibility handler
//   const handleToggleVisibility = async (docId, isHospital) => {
//     try {
//       if (!isUserAuthorized || !validateAuthToken()) {
//         showToast("Authorization failed. Please log in again.", "error");
//         redirectToLogin();
//         return;
//       }
      
//       const apiUrl = isHospital 
//         ? `${BASE_URL}/change-hospital-document/`
//         : `${BASE_URL}/change-patient-document/`;
      
//       const authToken = getCookie('authToken');
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': getCookie('csrftoken'),
//           'Authorization': `Token ${authToken}`
//         },
//         credentials: 'same-origin',
//         body: JSON.stringify({ doc: docId })
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Request failed with status ${response.status}: ${errorText}`);
//       }
      
//       const data = await response.json();
//       showToast(`Visibility toggled successfully for ${isHospital ? 'hospital' : 'patient'} document`, 'success');
      
//       await fetchPatientDocuments();
//     } catch (error) {
//       console.error(`Error toggling visibility for document ${docId}:`, error);
//       if (error.message.includes('404')) {
//         showToast("The server could not find the requested endpoint.", "error");
//       } else {
//         showToast("Failed to toggle document visibility.", "error");
//       }
//     }
//   };
  
//   // Confirm delete handler
//   const handleConfirmDelete = (docId, isHospital) => {
//     if (!isUserAuthorized || !validateAuthToken()) {
//       showToast("Authorization failed. Please log in again.", "error");
//       redirectToLogin();
//       return;
//     }
//     setDeleteModal({
//       isOpen: true,
//       docId,
//       isHospital
//     });
//   };
  
//   // Delete document handler
//   const handleDeleteDocument = async (verificationCode) => {
//     const { docId, isHospital } = deleteModal;
    
//     if (!isUserAuthorized || !validateAuthToken()) {
//       showToast("Authorization failed. Please log in again.", "error");
//       redirectToLogin();
//       return;
//     }
    
//     if (!verificationCode || verificationCode.trim() === '') {
//       showToast("Verification code is required.", "error");
//       return;
//     }
    
//     try {
//       const authToken = getCookie('authToken');
//       const apiEndpoint = isHospital
//         ? `${BASE_URL}/delete-hospital-document/`
//         : `${BASE_URL}/delete-patient-document/`;
      
//       const response = await fetch(apiEndpoint, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Token ${authToken}`,
//           'Content-Type': 'application/json',
//           'X-CSRFToken': getCookie('csrftoken')
//         },
//         credentials: 'same-origin',
//         body: JSON.stringify({
//           doc: docId,
//           verification_code: verificationCode
//         })
//       });
      
//       if (response.status === 401 || response.status === 403) {
//         if (response.status === 403) {
//           showToast('Invalid verification code. Document not deleted.', 'error');
//         } else {
//           setIsUserAuthorized(false);
//           showToast("Your session has expired. Please log in again.", "error");
//           redirectToLogin();
//         }
//         return;
//       }
      
//       if (!response.ok) {
//         throw new Error('Failed to delete document');
//       }
      
//       const data = await response.json();
      
//       if (data.status === 'success') {
//         showToast('Document deleted successfully', 'success');
//         await fetchPatientDocuments();
//       } else {
//         showToast('Failed to delete document', 'error');
//       }
//     } catch (error) {
//       console.error(`Error deleting document ${docId}:`, error);
//       showToast('Error deleting document', 'error');
//     } finally {
//       setDeleteModal({ isOpen: false, docId: null, isHospital: null });
//     }
//   };
  
//   // Toast management
//   const showToast = (message, type = 'success') => {
//     const newToast = { message, type };
//     setToasts(prev => [...prev, newToast]);
    
//     setTimeout(() => {
//       setToasts(prev => prev.filter(t => t !== newToast));
//     }, 3400); // 3000ms duration + 400ms for animation
//   };
  
//   const removeToast = (index) => {
//     setToasts(prev => prev.filter((_, i) => i !== index));
//   };
  
//   // Text-to-speech functionality
//   const toggleSpeech = () => {
//     if (isSpeaking) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       speechRef.current = null;
//     } else {
//       const contentToRead = document.querySelector('.main-content')?.textContent;
//       if (contentToRead) {
//         const speech = new SpeechSynthesisUtterance();
//         speech.text = contentToRead;
//         speech.volume = 1;
//         speech.rate = 1;
//         speech.pitch = 1;
//         const currentLang = document.querySelector('.goog-te-combo')?.value || 'en-US';
//         speech.lang = currentLang;
//         speech.onend = () => {
//           setIsSpeaking(false);
//           speechRef.current = null;
//         };
//         speechRef.current = speech;
//         window.speechSynthesis.speak(speech);
//         setIsSpeaking(true);
//       }
//     }
//   };
  
//   // Validate auth token
//   const validateAuthToken = () => {
//     const authToken = getCookie('authToken');
//     return authToken && authToken.length > 10;
//   };
  
//   // Redirect to login
//   const redirectToLogin = () => {
//     localStorage.setItem('redirectAfterLogin', window.location.href);
//     navigate('/login');
//   };
  
//   // Filter documents based on search query
//   const filteredPersonalDocs = personalDocs.filter(doc => 
//     doc.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   const filteredHospitalDocs = hospitalDocs.filter(doc => 
//     doc.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );
  
//   // Handle language preference for Google Translate
//   const saveLangPreference = () => {
//     setTimeout(() => {
//       const translateSelect = document.querySelector('.goog-te-combo');
//       if (translateSelect) {
//         translateSelect.addEventListener('change', () => {
//           localStorage.setItem('preferredLanguage', translateSelect.value);
//         });
//         const savedLang = localStorage.getItem('preferredLanguage');
//         if (savedLang) {
//           translateSelect.value = savedLang;
//           translateSelect.dispatchEvent(new Event('change'));
//         }
//       }
//     }, 1000);
//   };
  
//   // Initialize data on component mount
//   useEffect(() => {
//     if (!patientId) {
//       console.error("No patient ID provided");
//       showToast("Error: No patient ID provided", "error");
//       return;
//     }
    
//     checkPatientAuth();
//     fetchPatientDetails();
//     fetchPatientDocuments();
    
//     // Google Translate API setup
//     const googleTranslateScript = document.createElement('script');
//     googleTranslateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     googleTranslateScript.type = "text/javascript";
//     document.body.appendChild(googleTranslateScript);
    
//     window.googleTranslateElementInit = function() {
//       new window.google.translate.TranslateElement({
//         pageLanguage: 'en',
//         includedLanguages: 'hi,mr,kn,ta,en',
//         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
//       }, 'google_translate_element');
//       saveLangPreference();
//     };
    
//     // Check authentication status every 5 minutes
//     const authInterval = setInterval(checkPatientAuth, 300000);
    
//     // Cleanup on unmount
//     return () => {
//       clearInterval(authInterval);
//       window.speechSynthesis.cancel();
//       speechRef.current = null;
//     };
//   }, [patientId]);
  
//   return (
//     <div className="dashboard-container">
//       {/* Background Image */}
//       <div className="bg-image">
//         <img src="/api/placeholder/1200/800" alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//       </div>
      
//       {/* Hamburger Menu Button */}
//       <div 
//         className="hamburger-menu" 
//         id="hamburger-menu" 
//         onClick={toggleSidebar}
//       >
//         <span></span>
//         <span></span>
//         <span></span>
//       </div>
      
//       {/* Sidebar Navigation */}
//       <Sidebar 
//         isActive={sidebarActive} 
//         onOverlayClick={() => setSidebarActive(false)}
//       />
      
//       {/* Toast Container */}
//       <ToastContainer 
//         toasts={toasts} 
//         removeToast={removeToast}
//       />
      
//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal 
//         isOpen={deleteModal.isOpen}
//         onClose={() => setDeleteModal({ isOpen: false, docId: null, isHospital: null })}
//         onConfirm={handleDeleteDocument}
//       />
      
//       {/* Main Content Area */}
//       <div className="main-content" id="main-content">
//         <div className="header">
//           <h1 className="page-title">Patient Documents</h1>
          
//           <button 
//             id="readAloudBtn" 
//             title="Read page content aloud"
//             onClick={toggleSpeech}
//           >
//             <FontAwesomeIcon icon={isSpeaking ? faPause : faVolumeUp} />
//             {isSpeaking ? ' Pause Reading' : ' Read Aloud'}
//           </button>
//         </div>
        
//         {/* Patient Information */}
//         <PatientInfo patient={patient} />
        
//         {/* Search and Authorization Section */}
//         <div className="content-card">
//           <div className="search-upload-container">
//             <div className="search-container">
//               <FontAwesomeIcon icon={faSearch} className="search-icon" />
//               <input 
//                 type="text" 
//                 className="search-input" 
//                 placeholder="Search documents..." 
//                 id="document-search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div id="auth-section" className="auth-section">
//               <AuthSection 
//                 isUserAuthorized={isUserAuthorized}
//                 isLoading={isCheckingAuth}
//                 onAddDocument={handleAddDocument}
//               />
//             </div>
//           </div>
          
//           <h2 className="card-title">Patient Documents</h2>
          
//           <DocumentSlider 
//             title="Personal Documents"
//             documents={filteredPersonalDocs}
//             isUserAuthorized={isUserAuthorized}
//             onToggleVisibility={handleToggleVisibility}
//             onConfirmDelete={handleConfirmDelete}
//           />
          
//           <DocumentSlider 
//             title="Hospital Documents"
//             documents={filteredHospitalDocs}
//             isUserAuthorized={isUserAuthorized}
//             onToggleVisibility={handleToggleVisibility}
//             onConfirmDelete={handleConfirmDelete}
//           />
//         </div>
//       </div>
      
//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default PatientDashboard;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../ui/ptDashboard.css';

const PatientDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({});
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [hospitalDocuments, setHospitalDocuments] = useState([]);
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

  // Get cookie helper function
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  // Validate auth token
  const validateAuthToken = () => {
    const authToken = getCookie('authToken');
    return authToken && authToken.length > 10; // Basic validation
  };

  // Redirect to login
  const redirectToLogin = () => {
    localStorage.setItem('redirectAfterLogin', window.location.href);
    navigate('/route/login/');
  };

  // Show toast notification
  const showToast = (message, type = 'success', duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let iconHtml = '';
    switch(type) {
      case 'success':
        iconHtml = '✓';
        break;
      case 'error':
        iconHtml = '✕';
        break;
      case 'info':
        iconHtml = 'ℹ';
        break;
      case 'warning':
        iconHtml = '⚠';
        break;
    }
    
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = iconHtml;
    
    // Create content container
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      removeToast(toast);
    });
    
    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'toast-progress';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress-bar';
    progressBar.style.animationDuration = `${duration}ms`;
    
    progressContainer.appendChild(progressBar);
    
    // Assemble toast
    toastContent.appendChild(messageSpan);
    toastContent.appendChild(closeButton);
    toast.appendChild(icon);
    toast.appendChild(toastContent);
    toast.appendChild(progressContainer);
    
    // Add to container
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Set auto-dismiss timer
    setTimeout(() => {
      removeToast(toast);
    }, duration);
    
    return toast;
  };

  const removeToast = (toast) => {
    toast.classList.remove('show');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  };

  // Get document icon based on type
  const getDocumentIcon = (docType) => {
    const iconMap = {
      'pdf': 'fa-file-pdf',
      'image': 'fa-file-image',
      'doc': 'fa-file-word',
      'xls': 'fa-file-excel',
      'lab': 'fa-flask',
      'prescription': 'fa-prescription',
      'report': 'fa-file-medical',
      'insurance': 'fa-file-invoice-dollar',
      'consent': 'fa-signature',
      'history': 'fa-notes-medical'
    };
    return iconMap[docType.toLowerCase()] || 'fa-file-medical-alt';
  };

  // Check patient authorization
  const checkPatientAuth = async () => {
    setAuthLoading(true);
    
    // Basic client-side validation first
    const authToken = getCookie('authToken');
    console.log("Auth Token:", authToken);
    if (!authToken || authToken.length < 10) {
      setIsUserAuthorized(false);
      setAuthLoading(false);
      console.log("2");
      return;
    }
    console.log(`Authorization : Token ${authToken}`);
    try {
      const response = await fetch(`${baseUrl}/check-patient/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`
        }
      });
      console.log("Response:", response.status);
      if (response.status === 200) {
        setIsUserAuthorized(true);
        console.log("if");
        fetchPatientDocuments(); // Refresh document list
      } else {
        console.log("else");
        setIsUserAuthorized(false);

      }
    } catch (error) {
      console.log("catched");
      console.error("Error checking patient authorization:", error);
      setIsUserAuthorized(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch patient details
  const fetchPatientDetails = async () => {
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(`${baseUrl}/patient-dashboard/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': authToken ? `Token ${authToken}` : ''
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        setIsUserAuthorized(false);
        return;
      }
      
      const data = await response.json();
      if (data && data.patient) {
        setPatientDetails(data.patient);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  // Fetch patient documents
  const fetchPatientDocuments = async () => {
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(`${baseUrl}/patient-documents/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': authToken ? `Token ${authToken}` : ''
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        setIsUserAuthorized(false);
        return;
      }
      
      const data = await response.json();
      
      if (data) {
        if (data.patient && data.patient.length > 0) {
          setPersonalDocuments(data.patient.map(doc => ({
            id: doc.id,
            title: doc.name || 'Unnamed Document',
            date: new Date(doc.added).toLocaleDateString(),
            icon: getDocumentIcon(doc.type || 'unknown'),
            isPrivate: doc.isPrivate || false,
            isHospital: false,
            type: doc.type || 'unknown'
          })));
        } else {
          setPersonalDocuments([]);
        }
        
        if (data.hospital && data.hospital.length > 0) {
          setHospitalDocuments(data.hospital.map(doc => ({
            id: doc.id,
            title: doc.name || 'Unnamed Document',
            date: new Date(doc.added).toLocaleDateString(),
            icon: getDocumentIcon(doc.type || 'unknown'),
            isPrivate: doc.isPrivate || false,
            isHospital: true,
            type: doc.type || 'unknown'
          })));
        } else {
          setHospitalDocuments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setPersonalDocuments([]);
      setHospitalDocuments([]);
    }
  };

  // Toggle document visibility
  const toggleVisibility = async (documentId, isHospital) => {
    if (!isUserAuthorized || !validateAuthToken()) {
      console.error("Unauthorized attempt to toggle document visibility");
      alert("Authorization failed. Please log in again.");
      redirectToLogin();
      return;
    }
    
    const apiUrl = isHospital 
      ? `${baseUrl}/change-hospital-document/` 
      : `${baseUrl}/change-patient-document/`;
    
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
          'Authorization': `Token ${authToken}`
        },
        credentials: 'same-origin',
        body: JSON.stringify({ doc: documentId })
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      showToast(`Visibility toggled successfully for ${isHospital ? 'hospital' : 'patient'} document ${documentId}`, 'success', 3000);
      
      // Refresh document lists
      fetchPatientDocuments();
    } catch (error) {
      console.error(`Error toggling visibility:`, error.message);
      alert('An error occurred while toggling document visibility.');
    }
  };

  // Confirm document deletion
  const confirmDelete = (docId, isHospital) => {
    if (!isUserAuthorized || !validateAuthToken()) {
      console.error("Unauthorized attempt to delete document");
      alert("Authorization failed. Please log in again to delete documents.");
      redirectToLogin();
      return;
    }
    
    // Check if modal already exists
    let modal = document.getElementById('delete-verification-modal');
    
    if (!modal) {
      // Create modal if it doesn't exist
      const modalDiv = document.createElement('div');
      modalDiv.innerHTML = `
        <div id="delete-verification-modal" class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Confirm Document Deletion</h2>
            <p>Please enter your verification code to delete this document:</p>
            <input type="password" id="verification-code" class="verification-input" placeholder="Verification Code">
            <div class="modal-buttons">
              <button id="cancel-delete" class="btn btn-secondary">Cancel</button>
              <button id="confirm-delete" class="btn btn-danger">Delete Document</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalDiv.firstElementChild);
      modal = document.getElementById('delete-verification-modal');
    }
    
    // Get buttons
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal on X click
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
    
    // Close modal on Cancel click
    cancelBtn.onclick = function() {
      modal.style.display = 'none';
    };
    
    // Handle Delete confirmation
    confirmBtn.onclick = function() {
      const verificationCode = document.getElementById('verification-code').value;
      deleteDocument(docId, verificationCode, isHospital);
      modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  };

  // Delete document
  const deleteDocument = async (docId, verificationCode, isHospital) => {
    if (!isUserAuthorized || !validateAuthToken()) {
      console.error("Unauthorized attempt to delete document");
      alert("Authorization failed. Please log in again to delete documents.");
      redirectToLogin();
      return;
    }
    
    if (!verificationCode || verificationCode.trim() === '') {
      alert("Verification code is required.");
      return;
    }
    
    const authToken = getCookie('authToken');
    const apiEndpoint = isHospital
      ? `${baseUrl}/delete-hospital-document/`
      : `${baseUrl}/delete-patient-document/`;
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doc: docId,
          verification_code: verificationCode
        })
      });
      
      if (response.status === 401 || response.status === 403) {
        if (response.status === 403 && verificationCode) {
          alert('Invalid verification code. Document not deleted.');
        } else {
          setIsUserAuthorized(false);
          alert("Your session has expired. Please log in again.");
          redirectToLogin();
        }
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          alert('Document deleted successfully');
          fetchPatientDocuments(); // Refresh document lists
        } else {
          alert('Failed to delete document');
        }
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error(`Error deleting document ${docId}:`, error);
      alert('Error deleting document');
    }
  };

  // View patient document
  const viewPatientDocument = async (docId) => {
    const authToken = getCookie('authToken');
    
    if (!authToken || authToken.length < 10) {
      alert("You need to be logged in to view this document");
      redirectToLogin();
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/patients/${id}/documents/${docId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error("Not authorized to view this document");
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No URL in response');
      }
    } catch (error) {
      console.error(`Error viewing patient document ${docId}:`, error);
      
      if (error.message === "Not authorized to view this document") {
        alert("You don't have permission to view this document. Please request access.");
      } else {
        alert('Error accessing document. Please try again.');
      }
    }
  };

  // View hospital document
  const viewHospitalDocument = async (docId) => {
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(`${baseUrl}/hospital-documents-view/${docId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hospital document: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No URL in response');
      }
    } catch (error) {
      console.error(`Error viewing hospital document ${docId}:`, error);
      alert('Error accessing hospital document');
    }
  };

  // Request patient access
  const requestPatientAccess = async (docId) => {
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(`${baseUrl}/create-patient-req/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doc: docId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          alert('Access request submitted successfully');
        } else if (data.message) {
          alert(data.message);
        } else {
          alert('Failed to submit access request');
        }
      } else {
        throw new Error('Failed to submit access request');
      }
    } catch (error) {
      console.error(`Error requesting access for patient document ${docId}:`, error);
      alert('Error requesting access');
    }
  };

  // Request hospital access
  const requestHospitalAccess = async (docId) => {
    const authToken = getCookie('authToken');
    
    try {
      const response = await fetch(`${baseUrl}/create-hospital-req/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doc: docId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          alert('Hospital document access request submitted successfully');
        } else if (data.message) {
          alert(data.message);
        } else {
          alert('Failed to submit hospital document access request');
        }
      } else {
        throw new Error('Failed to submit hospital document access request');
      }
    } catch (error) {
      console.error(`Error requesting access for hospital document ${docId}:`, error);
      alert('Error requesting hospital document access');
    }
  };

  // Add document function
  const addDocument = () => {
    if (!isUserAuthorized || !validateAuthToken()) {
      console.error("Unauthorized attempt to add document");
      alert("Authorization failed. Please log in again to add documents.");
      redirectToLogin();
      return;
    }
    navigate(`/route/patient-upload/?patient=${id}`);
  };

  // Document card component
  const DocumentCard = ({ doc }) => {
    const [accessStatus, setAccessStatus] = useState('loading');
    
    useEffect(() => {
      checkDocumentAccess(doc.id, doc.isHospital);
    }, [doc.id, doc.isHospital]);
    
    const checkDocumentAccess = async (docId, isHospital) => {
      const authToken = getCookie('authToken');
      const endpoint = isHospital 
        ? `${baseUrl}/hospital-document-check/${docId}` 
        : `${baseUrl}/patient-document-access/${docId}`;
        
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': authToken ? `Token ${authToken}` : ''
          }
        });
        
        if (response.status === 200) {
          setAccessStatus('granted');
        } else if (response.status === 401 || response.status === 403) {
          setAccessStatus('denied');
        } else {
          setAccessStatus('error');
        }
      } catch (error) {
        console.error(`Error checking document access for ID ${docId}:`, error);
        setAccessStatus('error');
      }
    };
    
    // Render access control buttons based on status
    const renderAccessControl = () => {
      switch (accessStatus) {
        case 'loading':
          return <div className="loading">Checking access...</div>;
        case 'granted':
          return (
            <button 
              className="doc-btn view-btn" 
              onClick={() => doc.isHospital ? viewHospitalDocument(doc.id) : viewPatientDocument(doc.id)}
            >
              View Document
            </button>
          );
        case 'denied':
          return (
            <button 
              className="doc-btn request-btn" 
              onClick={() => doc.isHospital ? requestHospitalAccess(doc.id) : requestPatientAccess(doc.id)}
            >
              Request Access
            </button>
          );
        case 'error':
          return (
            <button 
              className="doc-btn error-btn" 
              onClick={() => checkDocumentAccess(doc.id, doc.isHospital)}
            >
              Retry Access Check
            </button>
          );
        default:
          return null;
      }
    };
    
    return (
      <div className="document-card" data-id={doc.id}>
        {isUserAuthorized && (
          <div className="document-menu">
            <i className="fas fa-ellipsis-v menu-trigger"></i>
            <div className="document-menu-options">
              <div 
                className="menu-option edit-option" 
                onClick={() => toggleVisibility(doc.id, doc.isHospital)}
              >
                <i className="fas fa-edit"></i> {doc.isPrivate ? 'Make Public' : 'Make Private'}
              </div>
              <div 
                className="menu-option delete-option" 
                onClick={() => confirmDelete(doc.id, doc.isHospital)}
              >
                <i className="fas fa-trash"></i> Delete
              </div>
            </div>
          </div>
        )}
        <div className="document-icon">
          <i className={`fas ${doc.icon}`}></i>
        </div>
        <div className="document-title">{doc.title}</div>
        <div className="document-date">{doc.date}</div>
        <div className="document-visibility">
          {doc.isPrivate ? 
            <><i className="fas fa-lock"></i> Private</> : 
            <><i className="fas fa-unlock"></i> Public</>
          }
        </div>
        <div 
          id={`${doc.isHospital ? 'hospital' : 'patient'}-access-control-${doc.id}`} 
          className="document-access-control"
        >
          {renderAccessControl()}
        </div>
      </div>
    );
  };

  // Filter documents by search term
  const filterDocuments = (documents) => {
    if (!searchTerm) return documents;
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Initialize component
  useEffect(() => {
    if (!id) {
      console.error("No patient ID provided");
      alert("Error: No patient ID provided");
      return;
    }
    
    checkPatientAuth();
    fetchPatientDetails();
    fetchPatientDocuments();
    
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Check authentication status every 5 minutes
    const authCheckInterval = setInterval(checkPatientAuth, 300000);
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [id]);

  return (
    <div className="main-content" id="main-content">
      <div className="header">
        <h1 className="page-title">Patient Documents</h1>
      </div>
      
      <div className="content-card">
        <h2 className="card-title">Patient Information</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '20px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>
              <span id="patient-name">{patientDetails.name || ''}</span>
            </h3>
            <p style={{ margin: '5px 0', color: '#777' }}>
              <span id="patient-age">{patientDetails.age || ''}</span>
            </p>
            <p style={{ margin: '5px 0' }}>
              <span id="patient-blood-group">{patientDetails.bloodGroup || ''}</span>
            </p>
            <p style={{ margin: '5px 0' }}>
              Contact: <span id="patient-contact">{patientDetails.contact || ''}</span>
            </p>
            <p style={{ margin: '5px 0' }}>
              Emergency Contact: <span id="patient-emergency-contact">
                {patientDetails.emergencyContact || ''}
              </span>
            </p>
            <p style={{ margin: '5px 0' }}>
              Address: <span id="patient-address">{patientDetails.address || ''}</span>
            </p>
          </div>
          <div className="qr-code-section">
            <div className="qr-code-title">PATIENT QR CODE</div>
            <img 
              id="patient-qr-code" 
              className="qr-code" 
              alt="Patient QR Code" 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=patient:${id}`}
            />
          </div>
        </div>
      </div>
      
      <div className="content-card">
        <div className="search-upload-container">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search documents..." 
              id="document-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div id="auth-section" className="auth-section">
            {authLoading ? (
              <div className="loading">Checking authorization...</div>
            ) : isUserAuthorized ? (
              <button className="add-doc-btn" onClick={addDocument}>
                <i className="fas fa-plus"></i> Add Document
              </button>
            ) : (
              <>
                <div className="error">You need to log in to access this patient's dashboard</div>
                <button className="login-btn" onClick={redirectToLogin}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
        
        <h2 className="card-title">Patient Documents</h2>
        
        <h3>Personal Documents</h3>
        <div className="slider-container">
          <button className="slider-btn prev-btn" onClick={() => document.getElementById('personal-slider').scrollBy({ left: -300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider" id="personal-slider">
            {filterDocuments(personalDocuments).length > 0 ? (
              filterDocuments(personalDocuments).map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))
            ) : (
              <p className="empty-message">No personal documents found.</p>
            )}
          </div>
          <button className="slider-btn next-btn" onClick={() => document.getElementById('personal-slider').scrollBy({ left: 300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <h3>Hospital Documents</h3>
        <div className="slider-container">
          <button className="slider-btn prev-btn" onClick={() => document.getElementById('hospital-slider').scrollBy({ left: -300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider" id="hospital-slider">
            {filterDocuments(hospitalDocuments).length > 0 ? (
              filterDocuments(hospitalDocuments).map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))
            ) : (
              <p className="empty-message">No hospital documents found.</p>
            )}
          </div>
          <button className="slider-btn next-btn" onClick={() => document.getElementById('hospital-slider').scrollBy({ left: 300, behavior: 'smooth' })}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div id="toast-container" className="toast-container"></div>
    </div>
  );
};

export default PatientDashboard;