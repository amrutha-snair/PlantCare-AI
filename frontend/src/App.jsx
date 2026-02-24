import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Prediction failed');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>PlantCare AI</h1>
      <p className="subtitle">Upload a photo to identify plant diseases</p>

      <div
        className="upload-area"
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
          }
        }}
      >
        {preview ? (
          <div className="image-container">
            <img src={preview} id="preview" alt="Preview" />
            {loading && <div className="scanner-line"></div>}
          </div>
        ) : (
          <div className="upload-placeholder">
            <i className="fas fa-leaf" style={{ fontSize: '2.5rem' }}></i>
            <span>Upload target image</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFile}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <div className="button-group">
        <button className="btn-upload" onClick={() => fileInputRef.current.click()}>
          Select Image
        </button>
        <button
          className="btn-predict"
          onClick={handlePredict}
          disabled={!selectedFile || loading}
        >
          {loading ? 'Analyzing...' : 'Predict'}
        </button>
      </div>

      {(loading || result) && (
        <div className="results">
          {loading ? (
            <div className="result-card">
              <div className="label">Analyzing image...</div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-bar"></div>
              <div className="skeleton skeleton-text" style={{ width: '40%', float: 'right' }}></div>
            </div>
          ) : (
            <div className="result-card">
              <div className="label">Identification Result</div>
              <div className="disease-name">{result.label.replace(/-/g, ' ')}</div>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <div className="confidence-text">Confidence: {result.confidence}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

