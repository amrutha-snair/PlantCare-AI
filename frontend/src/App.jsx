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
      const response = await fetch('https://plantcare-ai-2.onrender.com/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <i className="fas fa-leaf"></i>
          <h1>PlantCare AI</h1>
        </div>
        <p className="subtitle">Intelligent Crop Disease Detection</p>
      </header>

      <main>
        <div
          className={`upload-area ${preview ? 'has-preview' : ''}`}
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
              <div className="icon-circle">
                <i className="fas fa-upload"></i>
              </div>
              <p>Drag and drop or click to upload</p>
              <span>Supports JPG, PNG (Max 5MB)</span>
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

        <div className="action-section">
          <button
            className="btn btn-primary"
            onClick={handlePredict}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <span className="flex-center">
                <i className="fas fa-spinner fa-spin spacer-r"></i> Analyzing...
              </span>
            ) : (
              <span className="flex-center">
                <i className="fas fa-microscope spacer-r"></i> Start Analysis
              </span>
            )}
          </button>

          {selectedFile && !loading && !result && (
            <button className="btn btn-secondary" onClick={() => {
              setSelectedFile(null);
              setPreview(null);
            }}>
              <i className="fas fa-times spacer-r"></i> Clear
            </button>
          )}
        </div>

        {(loading || result) && (
          <div className="results-wrapper">
            {loading ? (
              <div className="result-card loading-card">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line bar"></div>
                <div className="skeleton-line text"></div>
              </div>
            ) : (
              <div className="result-card fade-in">
                <div className="result-header">
                  <i className="fas fa-clipboard-check"></i>
                  <h3>Analysis Result</h3>
                </div>

                <div className="disease-info">
                  <div className="label">Detected Condition</div>
                  <div className="disease-name">
                    {result.label.replace(/-/g, ' ')}
                  </div>
                </div>

                <div className="confidence-section">
                  <div className="confidence-meta">
                    <span>Confidence Score</span>
                    <span className="score">{result.confidence}%</span>
                  </div>
                  <div className="confidence-track">
                    <div
                      className="confidence-level"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>© 2024 PlantCare AI • Empowering Sustainable Agriculture</p>
      </footer>
    </div>
  );
}

export default App;

