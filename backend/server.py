from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from inference import predict_image
import uvicorn

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_img(file: UploadFile=File(...)):
    result=predict_image(file.file)
    return result


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )