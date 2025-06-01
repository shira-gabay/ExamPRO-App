import React, { useState } from 'react';
import axios from 'axios';

function UploadStudyMaterial({ examId }) {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `https://exampro-app.onrender.com/api/Exam/${examId}/upload-study-material`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadUrl(response.data.fileUrl);
      setError('');
    } catch (err) {
      setError('Failed to upload file');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Upload Study Material</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadUrl && (
        <div>
          <p>File uploaded successfully:</p>
          <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UploadStudyMaterial;
