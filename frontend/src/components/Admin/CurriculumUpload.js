import React, { useState } from 'react';
import { uploadCurriculum } from '../../services/curriculumService';
import './Admin.css';

const CurriculumUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="curriculum-file">Upload Curriculum (Markdown)</label>
          <input
            id="curriculum-file"
            type="file"
            accept=".md"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default CurriculumUpload;
