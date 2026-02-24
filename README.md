# PlantCare AI 🌿

PlantCare AI is a simple, modern web application that identifies diseases in plants using Deep Learning. It features a React-based minimalist frontend and a FastAPI backend with a PyTorch-trained model.

## Features
- **AI Prediction**: Classifies over 80 types of plant diseases.
- **Modern UI**: Clean, flat design with a high-tech "AI Scanner" loading animation.
- **Fast Performance**: Powered by Vite and FastAPI for instant feedback.

## Project Structure
```text
plant_disease/
├── backend/            # FastAPI server & AI model
│   ├── server.py       # API entry point
│   ├── inference.py    # Torch inference logic
│   └── finalmodel.pth  # Trained model weights
└── frontend/           # React + Vite application
    ├── src/            # Components & styles
    └── vite.config.js  # Proxy configuration
```

## Getting Started

### 1. Prerequisites
- Python 3.x
- Node.js & npm

### 2. Backend Setup
```bash
cd backend
pip install torch torchvision pillow fastapi uvicorn
python3 server.py
```
*The server will start on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The app will be available at `http://localhost:5173`*

## Usage
1. Open the frontend in your browser.
2. Click the leaf icon or drag and drop a plant image.
3. Click **Predict** to start the AI analysis.
4. View the result and confidence score.

## Built With
- **React 19**
- **Vite**
- **FastAPI**
- **PyTorch**
