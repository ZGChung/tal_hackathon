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
        setMessage('请选择 Markdown (.md) 文件');
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
        throw new Error('加载模板失败');
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
      setMessage(`模板 "${displayName}" 上传成功！关键词：${uploadResponse.keywords.join('、')}`);
      setMessageType('success');
      setFile(null);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setMessage(`加载模板失败：${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
      setLoadingTemplate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('请选择要上传的文件');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await uploadCurriculum(file);
      setMessage(`上传成功！关键词：${response.keywords.join('、')}`);
      setMessageType('success');
      setFile(null);
      // Reset file input
      e.target.reset();
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || '上传失败';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>课程上传</h2>
      
      {/* Template Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555' }}>
          快速上传示例课程：
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
            {(loading || loadingTemplate) ? '加载中...' : '数学'}
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
            {(loading || loadingTemplate) ? '加载中...' : '科学'}
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
            {(loading || loadingTemplate) ? '加载中...' : '计算机科学'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
          点击模板按钮可快速上传预定义课程。或在下方上传您自己的文件。
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="curriculum-file">上传课程（推荐 Markdown 格式）</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              id="curriculum-file"
              type="file"
              accept=".md"
              onChange={handleFileChange}
              disabled={loading || loadingTemplate}
              style={{ display: 'none' }}
            />
            <div 
              onClick={() => {
                if (!loading && !loadingTemplate) {
                  document.getElementById('curriculum-file').click();
                }
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flex: 1,
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '0.5rem',
                backgroundColor: (loading || loadingTemplate) ? '#f5f5f5' : '#fff',
                cursor: (loading || loadingTemplate) ? 'not-allowed' : 'pointer',
                minHeight: '2.5rem',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!loading && !loadingTemplate) {
                    document.getElementById('curriculum-file').click();
                  }
                }}
                disabled={loading || loadingTemplate}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (loading || loadingTemplate) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: (loading || loadingTemplate) ? 0.6 : 1,
                  whiteSpace: 'nowrap'
                }}
              >
                浏览文件...
              </button>
              {file ? (
                <span style={{ fontSize: '14px', color: '#333', flex: 1 }}>
                  {file.name}
                </span>
              ) : (
                <span style={{ fontSize: '14px', color: '#999', flex: 1 }}>
                  未选择文件
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading || !file || loadingTemplate}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: loading || !file || loadingTemplate ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !file || loadingTemplate) ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? '上传中...' : '上传'}
            </button>
          </div>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CurriculumUpload;
