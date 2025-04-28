// import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileLines, faCloudUploadAlt, faUpload, faFile } from '@fortawesome/free-solid-svg-icons';
// import '../ui/PatienUpload.css'; // We'll define the styles separately

// function DocumentUpload() {
//   const [fileName, setFileName] = useState('');
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [statuses, setStatuses] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef(null);
//   const formRef = useRef(null);
//   const dropAreaRef = useRef(null);

//   useEffect(() => {
//     // Fetch document statuses when component mounts
//     fetchDocumentStatuses();
    
//     // Set up interval for periodic status updates
//     const statusInterval = setInterval(fetchDocumentStatuses, 30000);
    
//     // Clean up interval on component unmount
//     return () => clearInterval(statusInterval);
//   }, []);

//   useEffect(() => {
//     const dropArea = dropAreaRef.current;
    
//     if (!dropArea) return;
    
//     const preventDefaults = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//     };
    
//     const highlight = () => {
//       setIsDragging(true);
//     };
    
//     const unhighlight = () => {
//       setIsDragging(false);
//     };
    
//     const handleDrop = (e) => {
//       preventDefaults(e);
//       unhighlight();
      
//       const dt = e.dataTransfer;
//       const files = dt.files;
      
//       if (files.length) {
//         fileInputRef.current.files = files;
//         setFileName(files[0].name);
//       }
//     };
    
//     // Add event listeners for drag and drop
//     ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, preventDefaults, false);
//     });
    
//     ['dragenter', 'dragover'].forEach(eventName => {
//       dropArea.addEventListener(eventName, highlight, false);
//     });
    
//     ['dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, unhighlight, false);
//     });
    
//     dropArea.addEventListener('drop', handleDrop, false);
    
//     // Clean up event listeners
//     return () => {
//       ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, preventDefaults);
//       });
      
//       ['dragenter', 'dragover'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, highlight);
//       });
      
//       ['dragleave', 'drop'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, unhighlight);
//       });
      
//       dropArea.removeEventListener('drop', handleDrop);
//     };
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFileName(e.target.files[0].name);
//     } else {
//       setFileName('');
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
    
//     // Clear previous messages
//     setMessage({ text: '', type: '' });
    
//     const formData = new FormData(e.target);
//     const token = getCookie("authToken");
    
//     if (!token) {
//       setMessage({ text: "Authentication token not found.", type: 'error-message' });
//       return;
//     }
    
//     try {
//       const response = await fetch('http://localhost:8000/upload/', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Token ' + token
//         },
//         body: formData
//       });
      
//       if (response.ok) {
//         const result = await response.json();
        
//         // Show success message
//         setMessage({ text: result.message || "File uploaded successfully!", type: 'success-message' });
        
//         // Reset form
//         formRef.current.reset();
//         setFileName('');
        
//         // Refresh document statuses
//         fetchDocumentStatuses();
//       } else {
//         const errorResult = await response.json();
//         setMessage({ text: errorResult.error || "An error occurred during upload.", type: 'error-message' });
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setMessage({ text: 'Network error: ' + error.message, type: 'error-message' });
//     }
//   };

//   const fetchDocumentStatuses = async () => {
//     const token = getCookie("authToken");
    
//     if (!token) {
//       setStatuses([]);
//       return;
//     }
    
//     try {
//       const response = await fetch('http://localhost:8000/document-processes/', {
//         method: 'GET',
//         headers: {
//           'Authorization': 'Token ' + token,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch statuses');
//       }
      
//       const statusData = await response.json();
//       setStatuses(statusData);
//     } catch (error) {
//       console.error('Error fetching document statuses:', error);
//     }
//   };

//   const getCookie = (name) => {
//     let cookies = document.cookie.split('; ');
//     for (let cookie of cookies) {
//       let [key, value] = cookie.split('=');
//       if (key === name) return value;
//     }
//     return null;
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <div className="icon-container">
//           <FontAwesomeIcon icon={faFileLines} />
//         </div>
//         <h2>Document Upload</h2>
//       </div>
      
//       <div className="content">
//         <form ref={formRef} id="uploadForm" encType="multipart/form-data" onSubmit={handleUpload}>
//           <div className="input-group">
//             <label htmlFor="name">File Name</label>
//             <input type="text" id="name" name="name" placeholder="Enter a name for your file" required />
//           </div>
          
//           <div 
//             className={`file-upload ${isDragging ? 'dragging' : ''}`} 
//             id="dropArea"
//             ref={dropAreaRef}
//           >
//             <div className="file-upload-content">
//               <div className="upload-icon">
//                 <FontAwesomeIcon icon={faCloudUploadAlt} />
//               </div>
//               <div className="upload-text">
//                 <p className="primary-text">Drag & drop your file here or</p>
//                 <p className="secondary-text">click to browse</p>
//               </div>
//               <p className="file-info">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
//               {fileName && (
//                 <p id="fileNameDisplay" className="selected-file">{fileName}</p>
//               )}
//             </div>
//             <input 
//               type="file" 
//               id="file" 
//               name="file" 
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               required
//             />
//           </div>
          
//           <div className="checkbox-container">
//             <input 
//               type="checkbox" 
//               id="generateSummary" 
//               name="generateSummary" 
//               value="true" 
//               defaultChecked
//             />
//             <label htmlFor="generateSummary">Generate a concise summary of this document</label>
//           </div>
//           <p className="checkbox-info">AROGYAKOSH will create a brief summary of your document to help with indexing and retrieval</p>
          
//           {message.text && (
//             <div id="message" className={message.type}>
//               {message.text}
//             </div>
//           )}
          
//           <button type="submit" className="upload-button">
//             <FontAwesomeIcon icon={faUpload} />
//             Upload to AROGYAKOSH
//           </button>
//         </form>
//       </div>

//       <div className="status-section">
//         <h3>Document Processing Status</h3>
//         <div className="status-list" id="documentStatusList">
//           {statuses.length === 0 ? (
//             <p>No documents in processing.</p>
//           ) : (
//             statuses.map((status, index) => {
//               const normalizedStatus = status.status.toLowerCase();
//               let badgeClass = 'pending';
              
//               if (normalizedStatus === 'completed') badgeClass = 'completed';
//               if (normalizedStatus === 'processing') badgeClass = 'processing';
//               if (normalizedStatus === 'failed') badgeClass = 'failed';
              
//               return (
//                 <div 
//                   key={index} 
//                   className={`status-item ${normalizedStatus === 'processing' ? 'pulse' : ''}`}
//                 >
//                   <div className="status-item-left">
//                     <div className="file-icon">
//                       <FontAwesomeIcon icon={faFile} />
//                     </div>
//                     <div className="file-details">
//                       <span className="file-name">{status.file_name}</span>
//                     </div>
//                     <span className={`status-badge ${badgeClass}`}>
//                       {status.status.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DocumentUpload;
// import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileLines, faCloudUploadAlt, faUpload, faFile, faTimes, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
// import '../ui/PatienUpload.css';

// function DocumentUpload() {
//   const [fileName, setFileName] = useState('');
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [statuses, setStatuses] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showHealthPopup, setShowHealthPopup] = useState(false);
//   const [healthAnalysis, setHealthAnalysis] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const fileInputRef = useRef(null);
//   const formRef = useRef(null);
//   const dropAreaRef = useRef(null);
//   const [monitoredDocument, setMonitoredDocument] = useState(null);
  
//   // Groq API key
//   const groqApiKey = "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";

//   useEffect(() => {
//     // Fetch document statuses when component mounts
//     fetchDocumentStatuses();
    
//     // Set up interval for periodic status updates
//     const statusInterval = setInterval(fetchDocumentStatuses, 30000);
    
//     // Clean up interval on component unmount
//     return () => clearInterval(statusInterval);
//   }, []);

//   useEffect(() => {
//     const dropArea = dropAreaRef.current;
    
//     if (!dropArea) return;
    
//     const preventDefaults = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//     };
    
//     const highlight = () => {
//       setIsDragging(true);
//     };
    
//     const unhighlight = () => {
//       setIsDragging(false);
//     };
    
//     const handleDrop = (e) => {
//       preventDefaults(e);
//       unhighlight();
      
//       const dt = e.dataTransfer;
//       const files = dt.files;
      
//       if (files.length) {
//         fileInputRef.current.files = files;
//         setFileName(files[0].name);
//       }
//     };
    
//     // Add event listeners for drag and drop
//     ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, preventDefaults, false);
//     });
    
//     ['dragenter', 'dragover'].forEach(eventName => {
//       dropArea.addEventListener(eventName, highlight, false);
//     });
    
//     ['dragleave', 'drop'].forEach(eventName => {
//       dropArea.addEventListener(eventName, unhighlight, false);
//     });
    
//     dropArea.addEventListener('drop', handleDrop, false);
    
//     // Clean up event listeners
//     return () => {
//       ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, preventDefaults);
//       });
      
//       ['dragenter', 'dragover'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, highlight);
//       });
      
//       ['dragleave', 'drop'].forEach(eventName => {
//         dropArea.removeEventListener(eventName, unhighlight);
//       });
      
//       dropArea.removeEventListener('drop', handleDrop);
//     };
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFileName(e.target.files[0].name);
//     } else {
//       setFileName('');
//     }
//   };

//   // Function to analyze document content using Groq API
//   const analyzeDocument = async (documentContent, fileType) => {
//     setIsAnalyzing(true);
    
//     try {
//       const prompt = `
//         This is a ${fileType} medical document: ${documentContent}
        
//         Please analyze this document and provide the following in JSON format:
//         1. A health score from 1-100
//         2. A summary of key findings (max 3 bullet points)
//         3. Diet recommendations based on the results (max 3 items)
//         4. Lifestyle recommendations (max 3 items)
        
//         Format your response as valid JSON with these keys: healthScore, summary, dietRecommendations, lifestyleRecommendations
//       `;

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${groqApiKey}`
//         },
//         body: JSON.stringify({
//           model: "llama3-70b-8192",
//           messages: [{ role: "user", content: prompt }],
//           temperature: 0.5,
//           max_tokens: 1000
//         })
//       });

//       if (!response.ok) {
//         throw new Error("Failed to analyze document");
//       }

//       const result = await response.json();
//       const analysisText = result.choices[0].message.content;
      
//       // Parse the JSON result from the AI response
//       const analysisJson = JSON.parse(analysisText);
      
//       setHealthAnalysis(analysisJson);
//       setShowHealthPopup(true);
//     } catch (error) {
//       console.error("Error analyzing document:", error);
//       setMessage({ text: "Failed to analyze document: " + error.message, type: "error-message" });
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
    
//     // Clear previous messages
//     setMessage({ text: '', type: '' });
    
//     const formData = new FormData(e.target);
//     const token = getCookie("authToken");
    
//     if (!token) {
//       setMessage({ text: "Authentication token not found.", type: 'error-message' });
//       return;
//     }
    
//     try {
//       // First upload the document to the server
//       const response = await fetch('http://localhost:8000/upload/', {
//         method: 'POST',
//         headers: {
//           'Authorization': 'Token ' + token
//         },
//         body: formData
//       });
      
//       if (response.ok) {
//         const result = await response.json();
        
//         // Set the message and update statuses as before
//         setMessage({ text: result.message || "File uploaded successfully!", type: 'success-message' });
        
//         const newDocumentStatus = {
//           file_name: formData.get('name') || fileName,
//           status: 'processing'
//         };
        
//         setStatuses(prevStatuses => [newDocumentStatus, ...prevStatuses]);
        
//         // If generateSummary is checked, set this document as the one to monitor
//         if (formData.get('generateSummary') === 'true') {
//           setMonitoredDocument(newDocumentStatus.file_name);
//         }
        
//         // Reset form
//         formRef.current.reset();
//         setFileName('');
        
//         // Refresh document statuses after a short delay
//         setTimeout(fetchDocumentStatuses, 2000);
//       } else {
//         const errorResult = await response.json();
//         setMessage({ text: errorResult.error || "An error occurred during upload.", type: 'error-message' });
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setMessage({ text: 'Network error: ' + error.message, type: 'error-message' });
//     }
//   };

//   const fetchDocumentStatuses = async () => {
//     const token = getCookie("authToken");
    
//     if (!token) {
//       setStatuses([]);
//       return;
//     }
    
//     try {
//       const response = await fetch('http://localhost:8000/document-processes/', {
//         method: 'GET',
//         headers: {
//           'Authorization': 'Token ' + token,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch statuses');
//       }
//       const statusData = await response.json();
//   setStatuses(statusData);
//   if (monitoredDocument) {
//     const monitoredDoc = statusData.find(
//       doc => doc.file_name === monitoredDocument && doc.status.toLowerCase() === 'completed'
//     );
    
//     if (monitoredDoc) {
//       // Document has completed processing, now perform analysis
//       simulateDocumentAnalysis(monitoredDocument);
//       // Reset monitored document
//       setMonitoredDocument(null);
//     }
//     }} catch (error) {
//       console.error('Error fetching document statuses:', error);
//     }
//   };

//   const getCookie = (name) => {
//     let cookies = document.cookie.split('; ');
//     for (let cookie of cookies) {
//       let [key, value] = cookie.split('=');
//       if (key === name) return value;
//     }
//     return null;
//   };
//   const simulateDocumentAnalysis = async (documentName) => {
//     setIsAnalyzing(true);
    
//     try {
//       // Simulate document content based on file name
//       let documentContent;
      
//       if (documentName.toLowerCase().includes('blood')) {
//         documentContent = `
//           BLOOD TEST RESULTS
//           Patient: John Doe
//           Date: 2025-04-28
          
//           Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)
//           White Blood Cells: 7,500/μL (Normal: 4,500-11,000)
//           Platelets: 250,000/μL (Normal: 150,000-450,000)
//           Glucose (fasting): 105 mg/dL (Normal: 70-99)
//           Total Cholesterol: 210 mg/dL (Desirable: <200)
//           LDL Cholesterol: 130 mg/dL (Optimal: <100)
//           HDL Cholesterol: 45 mg/dL (Low: <40 for men, <50 for women)
//           Triglycerides: 160 mg/dL (Normal: <150)
//         `;
//       } else {
//         documentContent = `
//           GENERAL HEALTH ASSESSMENT
//           Patient: Jane Smith
//           Date: 2025-04-28
          
//           Blood Pressure: 128/82 mmHg
//           Heart Rate: 75 bpm
//           BMI: 26.4
//           Physical Activity: 2 times per week
//           Smoking Status: Non-smoker
//           Alcohol Consumption: Moderate (5 drinks/week)
//           Sleep: 6.5 hours/night average
//         `;
//       }
      
//       // Analyze with Groq API
//       await analyzeDocument(documentContent, "application/pdf"); // Assuming PDF for simplicity
//     } catch (error) {
//       console.error("Error during document analysis:", error);
//       setMessage({ text: "Failed to analyze document: " + error.message, type: "error-message" });
//     }
//   };

//   const closeHealthPopup = () => {
//     setShowHealthPopup(false);
//   };

//   // Function to determine health score color
//   const getHealthScoreColor = (score) => {
//     if (score >= 80) return "#28a745"; // Green
//     if (score >= 60) return "#ffc107"; // Yellow
//     return "#dc3545"; // Red
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <div className="icon-container">
//           <FontAwesomeIcon icon={faFileLines} />
//         </div>
//         <h2>Document Upload</h2>
//       </div>
      
//       <div className="content">
//         <form ref={formRef} id="uploadForm" encType="multipart/form-data" onSubmit={handleUpload}>
//           <div className="input-group">
//             <label htmlFor="name">File Name</label>
//             <input type="text" id="name" name="name" placeholder="Enter a name for your file" required />
//           </div>
          
//           <div
//             className={`file-upload ${isDragging ? 'dragging' : ''}`}
//             id="dropArea"
//             ref={dropAreaRef}
//           >
//             <div className="file-upload-content">
//               <div className="upload-icon">
//                 <FontAwesomeIcon icon={faCloudUploadAlt} />
//               </div>
//               <div className="upload-text">
//                 <p className="primary-text">Drag & drop your file here or</p>
//                 <p className="secondary-text">click to browse</p>
//               </div>
//               <p className="file-info">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
//               {fileName && (
//                 <p id="fileNameDisplay" className="selected-file">{fileName}</p>
//               )}
//             </div>
//             <input
//               type="file"
//               id="file"
//               name="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               required
//             />
//           </div>
          
//           <div className="checkbox-container">
//             <input
//               type="checkbox"
//               id="generateSummary"
//               name="generateSummary"
//               value="true"
//               defaultChecked
//             />
//             <label htmlFor="generateSummary">Generate a concise summary of this document</label>
//           </div>
//           <p className="checkbox-info">AROGYAKOSH will create a brief summary of your document to help with indexing and retrieval</p>
          
//           {message.text && (
//             <div id="message" className={message.type}>
//               {message.text}
//             </div>
//           )}
          
//           <button type="submit" className="upload-button" disabled={isAnalyzing}>
//             <FontAwesomeIcon icon={faUpload} />
//             {isAnalyzing ? 'Analyzing...' : 'Upload to AROGYAKOSH'}
//           </button>
//         </form>
//       </div>

//       <div className="status-section">
//         <h3>Document Processing Status</h3>
//         <div className="status-list" id="documentStatusList">
//           {statuses.length === 0 ? (
//             <p>No documents in processing.</p>
//           ) : (
//             statuses.map((status, index) => {
//               const normalizedStatus = status.status.toLowerCase();
//               let badgeClass = 'pending';
              
//               if (normalizedStatus === 'completed') badgeClass = 'completed';
//               if (normalizedStatus === 'processing') badgeClass = 'processing';
//               if (normalizedStatus === 'failed') badgeClass = 'failed';
              
//               return (
//                 <div
//                   key={`status-${index}-${status.file_name}`}
//                   className={`status-item ${normalizedStatus === 'processing' ? 'pulse' : ''}`}
//                 >
//                   <div className="status-item-left">
//                     <div className="file-icon">
//                       <FontAwesomeIcon icon={faFile} />
//                     </div>
//                     <div className="file-details">
//                       <span className="file-name">{status.file_name}</span>
//                     </div>
//                     <span className={`status-badge ${badgeClass}`}>
//                       {status.status.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Health Analysis Popup */}
//       {showHealthPopup && healthAnalysis && (
//         <div className="health-popup-overlay">
//           <div className="health-popup">
//             <div className="health-popup-header">
//               <h3>
//                 <FontAwesomeIcon icon={faHeartbeat} /> Health Analysis Results
//               </h3>
//               <button className="close-button" onClick={closeHealthPopup}>
//                 <FontAwesomeIcon icon={faTimes} />
//               </button>
//             </div>
            
//             <div className="health-popup-content">
//               <div className="health-score-container">
//                 <div 
//                   className="health-score" 
//                   style={{ 
//                     backgroundColor: getHealthScoreColor(healthAnalysis.healthScore),
//                     boxShadow: `0 0 15px ${getHealthScoreColor(healthAnalysis.healthScore)}`
//                   }}
//                 >
//                   {healthAnalysis.healthScore}
//                 </div>
//                 <p className="health-score-label">Health Score</p>
//               </div>
              
//               <div className="health-sections">
//                 <div className="health-section">
//                   <h4>Summary</h4>
//                   <ul>
//                     {Array.isArray(healthAnalysis.summary) 
//                       ? healthAnalysis.summary.map((item, index) => (
//                           <li key={index}>{item}</li>
//                         ))
//                       : <li>{healthAnalysis.summary}</li>
//                     }
//                   </ul>
//                 </div>
                
//                 <div className="health-section">
//                   <h4>Diet Recommendations</h4>
//                   <ul>
//                     {Array.isArray(healthAnalysis.dietRecommendations)
//                       ? healthAnalysis.dietRecommendations.map((item, index) => (
//                           <li key={index}>{item}</li>
//                         ))
//                       : <li>{healthAnalysis.dietRecommendations}</li>
//                     }
//                   </ul>
//                 </div>
                
//                 <div className="health-section">
//                   <h4>Lifestyle Recommendations</h4>
//                   <ul>
//                     {Array.isArray(healthAnalysis.lifestyleRecommendations)
//                       ? healthAnalysis.lifestyleRecommendations.map((item, index) => (
//                           <li key={index}>{item}</li>
//                         ))
//                       : <li>{healthAnalysis.lifestyleRecommendations}</li>
//                     }
//                   </ul>
//                 </div>
//               </div>
//             </div>
            
//             <div className="health-popup-footer">
//               <button className="action-button" onClick={closeHealthPopup}>Close</button>
//               <button className="action-button primary">Save Report</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DocumentUpload;
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faCloudUploadAlt, faUpload, faFile, faTimes, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import '../ui/PatienUpload.css';

function DocumentUpload() {
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [statuses, setStatuses] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showHealthPopup, setShowHealthPopup] = useState(false);
  const [healthAnalysis, setHealthAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [monitoredDocument, setMonitoredDocument] = useState(null);
  
  // Groq API key
  const groqApiKey = "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";

  useEffect(() => {
    // Fetch document statuses when component mounts
    fetchDocumentStatuses();
    
    // Set up interval for periodic status updates
    const statusInterval = setInterval(fetchDocumentStatuses, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(statusInterval);
  }, []);

  // Add another useEffect to monitor status changes and trigger analysis
  useEffect(() => {
    if (monitoredDocument) {
      const completedDoc = statuses.find(
        doc => doc.file_name === monitoredDocument && doc.status.toLowerCase() === 'completed'
      );
      
      if (completedDoc) {
        // Document has completed processing, now perform analysis
        simulateDocumentAnalysis(monitoredDocument);
        // Reset monitored document
        setMonitoredDocument(null);
      }
    }
  }, [statuses, monitoredDocument]);

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    
    if (!dropArea) return;
    
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const highlight = () => {
      setIsDragging(true);
    };
    
    const unhighlight = () => {
      setIsDragging(false);
    };
    
    const handleDrop = (e) => {
      preventDefaults(e);
      unhighlight();
      
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length) {
        fileInputRef.current.files = files;
        setFileName(files[0].name);
      }
    };
    
    // Add event listeners for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Clean up event listeners
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, preventDefaults);
      });
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unhighlight);
      });
      
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  // Function to analyze document content using Groq API
  const analyzeDocument = async (documentContent, fileType) => {
    setIsAnalyzing(true);
    
    try {
      const prompt = `
        This is a ${fileType} medical document: ${documentContent}
        
        Please analyze this document and provide the following in JSON format:
        1. A health score from 1-100
        2. A summary of key findings (max 3 bullet points)
        3. Diet recommendations based on the results (max 3 items)
        4. Lifestyle recommendations (max 3 items)
        
        Format your response as valid JSON with these keys: healthScore, summary, dietRecommendations, lifestyleRecommendations
      `;

      // For testing purposes, let's bypass the actual API call and use mock data
      // Remove this mock and uncomment the actual API call in production
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze document");
      }

      const result = await response.json();
      const analysisText = result.choices[0].message.content;
      
      // Parse the JSON result from the AI response
      const analysisJson = JSON.parse(analysisText);

      
      // Mock data for testing
      // const analysisJson = {
      //   healthScore: 78,
      //   summary: [
      //     "Slightly elevated glucose level (105 mg/dL) indicating pre-diabetes risk",
      //     "Total cholesterol (210 mg/dL) is above desirable levels",
      //     "LDL cholesterol is moderately elevated (130 mg/dL)"
      //   ],
      //   dietRecommendations: [
      //     "Reduce simple carbohydrate intake and increase fiber-rich foods",
      //     "Include omega-3 rich foods like fatty fish, walnuts, and flaxseeds",
      //     "Limit saturated fats and increase consumption of plant sterols"
      //   ],
      //   lifestyleRecommendations: [
      //     "Incorporate at least 150 minutes of moderate-intensity exercise weekly",
      //     "Consider regular cholesterol monitoring every 3-6 months",
      //     "Practice stress management techniques like meditation"
      //   ]
      // };
      
      setHealthAnalysis(analysisJson);
      setShowHealthPopup(true);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setMessage({ text: "Failed to analyze document: " + error.message, type: "error-message" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage({ text: '', type: '' });
    
    const formData = new FormData(e.target);
    const token = getCookie("authToken");
    
    if (!token) {
      setMessage({ text: "Authentication token not found.", type: 'error-message' });
      return;
    }
    
    try {
      // First upload the document to the server
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        headers: {
          'Authorization': 'Token ' + token
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Set the message and update statuses as before
        setMessage({ text: result.message || "File uploaded successfully!", type: 'success-message' });
        
        const documentName = formData.get('name') || fileName;
        
        const newDocumentStatus = {
          file_name: documentName,
          status: 'processing'
        };
        
        setStatuses(prevStatuses => [newDocumentStatus, ...prevStatuses]);
        
        // If generateSummary is checked, set this document as the one to monitor
        if (formData.get('generateSummary') === 'true') {
          setMonitoredDocument(documentName);
          
          // For demo purposes, simulate completion after 2 seconds
          setTimeout(() => {
            setStatuses(prevStatuses => 
              prevStatuses.map(status => 
                status.file_name === documentName 
                  ? {...status, status: 'completed'} 
                  : status
              )
            );
          }, 2000);
        }
        
        // Reset form
        formRef.current.reset();
        setFileName('');
        
        // Refresh document statuses after a short delay
        setTimeout(fetchDocumentStatuses, 2000);
      } else {
        const errorResult = await response.json();
        setMessage({ text: errorResult.error || "An error occurred during upload.", type: 'error-message' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: 'Network error: ' + error.message, type: 'error-message' });
    }
  };

  const fetchDocumentStatuses = async () => {
    const token = getCookie("authToken");
    
    if (!token) {
      setStatuses([]);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/document-processes/', {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statuses');
      }
      
      const statusData = await response.json();
      setStatuses(statusData);
      
      // Document monitoring moved to separate useEffect
    } catch (error) {
      console.error('Error fetching document statuses:', error);
    }
  };

  const getCookie = (name) => {
    let cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      let [key, value] = cookie.split('=');
      if (key === name) return value;
    }
    return null;
  };
  
  const simulateDocumentAnalysis = async (documentName) => {
    console.log("Starting analysis for document:", documentName);
    setIsAnalyzing(true);
    
    try {
      // Simulate document content based on file name
      let documentContent;
      
      if (documentName.toLowerCase().includes('blood')) {
        documentContent = `
          BLOOD TEST RESULTS
          Patient: John Doe
          Date: 2025-04-28
          
          Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)
          White Blood Cells: 7,500/μL (Normal: 4,500-11,000)
          Platelets: 250,000/μL (Normal: 150,000-450,000)
          Glucose (fasting): 105 mg/dL (Normal: 70-99)
          Total Cholesterol: 210 mg/dL (Desirable: <200)
          LDL Cholesterol: 130 mg/dL (Optimal: <100)
          HDL Cholesterol: 45 mg/dL (Low: <40 for men, <50 for women)
          Triglycerides: 160 mg/dL (Normal: <150)
        `;
      } else {
        documentContent = `
          GENERAL HEALTH ASSESSMENT
          Patient: Jane Smith
          Date: 2025-04-28
          
          Blood Pressure: 128/82 mmHg
          Heart Rate: 75 bpm
          BMI: 26.4
          Physical Activity: 2 times per week
          Smoking Status: Non-smoker
          Alcohol Consumption: Moderate (5 drinks/week)
          Sleep: 6.5 hours/night average
        `;
      }
      
      // Analyze with Groq API
      await analyzeDocument(documentContent, "application/pdf"); // Assuming PDF for simplicity
    } catch (error) {
      console.error("Error during document analysis:", error);
      setMessage({ text: "Failed to analyze document: " + error.message, type: "error-message" });
    }
  };

  const closeHealthPopup = () => {
    setShowHealthPopup(false);
  };

  // Function to determine health score color
  const getHealthScoreColor = (score) => {
    if (score >= 80) return "#28a745"; // Green
    if (score >= 60) return "#ffc107"; // Yellow
    return "#dc3545"; // Red
  };

  return (
    <div className="container">
   
      
      <div className="content">
        <form ref={formRef} id="uploadForm" encType="multipart/form-data" onSubmit={handleUpload}>
          <div className="input-group">
            <label htmlFor="name">File Name</label>
            <input type="text" id="name" name="name" placeholder="Enter a name for your file" required />
          </div>
          
          <div
            className={`file-upload ${isDragging ? 'dragging' : ''}`}
            id="dropArea"
            ref={dropAreaRef}
          >
            <div className="file-upload-content">
              <div className="upload-icon">
                <FontAwesomeIcon icon={faCloudUploadAlt} />
              </div>
              <div className="upload-text">
                <p className="primary-text">Drag & drop your file here or</p>
                <p className="secondary-text">click to browse</p>
              </div>
              <p className="file-info">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
              {fileName && (
                <p id="fileNameDisplay" className="selected-file">{fileName}</p>
              )}
            </div>
            <input
              type="file"
              id="file"
              name="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              required
            />
          </div>
          
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="generateSummary"
              name="generateSummary"
              value="true"
              defaultChecked
            />
            <label htmlFor="generateSummary">Generate a concise summary of this document</label>
          </div>
          <p className="checkbox-info">AROGYAKOSH will create a brief summary of your document to help with indexing and retrieval</p>
          
          {message.text && (
            <div id="message" className={message.type}>
              {message.text}
            </div>
          )}
          
          <button type="submit" className="upload-button" disabled={isAnalyzing}>
            <FontAwesomeIcon icon={faUpload} />
            {isAnalyzing ? 'Analyzing...' : 'Upload to AROGYAKOSH'}
          </button>
        </form>
      </div>

      <div className="status-section">
        <h3>Document Processing Status</h3>
        <div className="status-list" id="documentStatusList">
          {statuses.length === 0 ? (
            <p>No documents in processing.</p>
          ) : (
            statuses.map((status, index) => {
              const normalizedStatus = status.status.toLowerCase();
              let badgeClass = 'pending';
              
              if (normalizedStatus === 'completed') badgeClass = 'completed';
              if (normalizedStatus === 'processing') badgeClass = 'processing';
              if (normalizedStatus === 'failed') badgeClass = 'failed';
              
              return (
                <div
                  key={`status-${index}-${status.file_name}`}
                  className={`status-item ${normalizedStatus === 'processing' ? 'pulse' : ''}`}
                >
                  <div className="status-item-left">
                    <div className="file-icon">
                      <FontAwesomeIcon icon={faFile} />
                    </div>
                    <div className="file-details">
                      <span className="file-name">{status.file_name}</span>
                    </div>
                    <span className={`status-badge ${badgeClass}`}>
                      {status.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Health Analysis Popup */}
      {showHealthPopup && healthAnalysis && (
        <div className="health-popup-overlay">
          <div className="health-popup">
            <div className="health-popup-header">
              <h3>
                <FontAwesomeIcon icon={faHeartbeat} /> Health Analysis Results
              </h3>
              <button className="close-button" onClick={closeHealthPopup}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="health-popup-content">
              <div className="health-score-container">
                <div 
                  className="health-score" 
                  style={{ 
                    backgroundColor: getHealthScoreColor(healthAnalysis.healthScore),
                    boxShadow: `0 0 15px ${getHealthScoreColor(healthAnalysis.healthScore)}`
                  }}
                >
                  {healthAnalysis.healthScore}
                </div>
                <p className="health-score-label">Health Score</p>
              </div>
              
              <div className="health-sections">
                <div className="health-section">
                  <h4>Summary</h4>
                  <ul>
                    {Array.isArray(healthAnalysis.summary) 
                      ? healthAnalysis.summary.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      : <li>{healthAnalysis.summary}</li>
                    }
                  </ul>
                </div>
                
                <div className="health-section">
                  <h4>Diet Recommendations</h4>
                  <ul>
                    {Array.isArray(healthAnalysis.dietRecommendations)
                      ? healthAnalysis.dietRecommendations.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      : <li>{healthAnalysis.dietRecommendations}</li>
                    }
                  </ul>
                </div>
                
                <div className="health-section">
                  <h4>Lifestyle Recommendations</h4>
                  <ul>
                    {Array.isArray(healthAnalysis.lifestyleRecommendations)
                      ? healthAnalysis.lifestyleRecommendations.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))
                      : <li>{healthAnalysis.lifestyleRecommendations}</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="health-popup-footer">
              <button className="action-button" onClick={closeHealthPopup}>Close</button>
              <button className="action-button primary">Save Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;