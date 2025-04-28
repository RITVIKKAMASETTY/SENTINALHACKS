import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faCloudUploadAlt, faUpload, faFile } from '@fortawesome/free-solid-svg-icons';
import './'; // We'll define the styles separately

function DocumentUpload() {
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [statuses, setStatuses] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    // Fetch document statuses when component mounts
    fetchDocumentStatuses();
    
    // Set up interval for periodic status updates
    const statusInterval = setInterval(fetchDocumentStatuses, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(statusInterval);
  }, []);

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
      const response = await fetch('/upload/', {
        method: 'POST',
        headers: {
          'Authorization': 'Token ' + token
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        setMessage({ text: result.message || "File uploaded successfully!", type: 'success-message' });
        
        // Reset form
        formRef.current.reset();
        setFileName('');
        
        // Refresh document statuses
        fetchDocumentStatuses();
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
      const response = await fetch('/document-processes/', {
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

  return (
    <div className="container">
      <div className="header">
        <div className="icon-container">
          <FontAwesomeIcon icon={faFileLines} />
        </div>
        <h2>Document Upload</h2>
      </div>
      
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
          
          <button type="submit" className="upload-button">
            <FontAwesomeIcon icon={faUpload} />
            Upload to AROGYAKOSH
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
                  key={index} 
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
    </div>
  );
}

export default DocumentUpload;