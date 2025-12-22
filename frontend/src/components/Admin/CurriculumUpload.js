import React, { useState } from 'react';
import { uploadCurriculum } from '../../services/curriculumService';
import './Admin.css';

const CurriculumUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.md')) {
        setMessage('Please select a markdown (.md) file');
        setMessageType('error');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
      setMessageType('');
    }
  };

  const loadTemplate = async (templateName, displayName) => {
    setLoadingTemplate(true);
    setMessage('');
    setMessageType('');
    
    try {
      // Fetch the template file
      const response = await fetch(`/${templateName}.md`);
      if (!response.ok) {
        throw new Error('Failed to load template');
      }
      const content = await response.text();
      
      // Create a File object from the content
      const blob = new Blob([content], { type: 'text/markdown' });
      const templateFile = new File([blob], `${templateName}.md`, { type: 'text/markdown' });
      
      // Set the file and upload it
      setFile(templateFile);
      
      // Create a form and submit it programmatically
      const formData = new FormData();
      formData.append('file', templateFile);
      
      setLoading(true);
      const uploadResponse = await uploadCurriculum(templateFile);
      setMessage(`Template "${displayName}" uploaded successfully! Keywords: ${uploadResponse.keywords.join(', ')}`);
      setMessageType('success');
      setFile(null);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setMessage(`Failed to load template: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
      setLoadingTemplate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file to upload');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await uploadCurriculum(file);
      setMessage(`Uploaded successfully! Keywords: ${response.keywords.join(', ')}`);
      setMessageType('success');
      setFile(null);
      // Reset file input
      e.target.reset();
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Upload failed';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Curriculum Upload</h2>
      
      {/* Template Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555' }}>
          Quick Upload Templates:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadTemplate('mathematics_curriculum', 'Mathematics')}
            disabled={loading || loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || loadingTemplate) ? 'not-allowed' : 'pointer',
              opacity: (loading || loadingTemplate) ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {(loading || loadingTemplate) ? 'Loading...' : 'Mathematics'}
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('science_curriculum', 'Science')}
            disabled={loading || loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || loadingTemplate) ? 'not-allowed' : 'pointer',
              opacity: (loading || loadingTemplate) ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {(loading || loadingTemplate) ? 'Loading...' : 'Science'}
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('computer_science_curriculum', 'Computer Science')}
            disabled={loading || loadingTemplate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || loadingTemplate) ? 'not-allowed' : 'pointer',
              opacity: (loading || loadingTemplate) ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {(loading || loadingTemplate) ? 'Loading...' : 'Computer Science'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
          Click a template button to quickly upload a predefined curriculum. Or upload your own file below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="curriculum-file">Upload Curriculum (Markdown)</label>
          <input
            id="curriculum-file"
            type="file"
            accept=".md"
            onChange={handleFileChange}
            disabled={loading || loadingTemplate}
          />
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading || !file || loadingTemplate}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default CurriculumUpload;
