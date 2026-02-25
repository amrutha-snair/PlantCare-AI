import onnxruntime as ort
import numpy as np
from PIL import Image

classes = [
    "Apple-alternaria_leaf_spot",
    "Apple-black_rot",
    "Apple-brown_spot",
    "Apple-gray_spot",
    "Apple-healthy",
    "Apple-rust",
    "Apple-scab",
    "Bell_pepper-bacterial_spot",
    "Bell_pepper-healthy",
    "Blueberry-healthy",
    "Cassava-bacterial_blight",
    "Cassava-brown_streak_disease",
    "Cassava-green_mottle",
    "Cassava-healthy",
    "Cassava-mosaic_disease",
    "Cherry-healthy",
    "Cherry-powdery_mildew",
    "Coffee-healthy",
    "Coffee-red_spider_mite",
    "Coffee-rust",
    "Corn-common_rust",
    "Corn-gray_leaf_spot",
    "Corn-healthy",
    "Corn-northern_leaf_blight",
    "Grape_Leaf_blight",
    "Grape_black_measles",
    "Grape_black_rot",
    "Grape_healthy",
    "Orange-citrus_greening",
    "Peach-bacterial_spot",
    "Peach-healthy",
    "Potato_bacterial_wilt",
    "Potato_early_blight",
    "Potato_healthy",
    "Potato_late_blight",
    "Potato_leafroll_virus",
    "Potato_mosaic_virus",
    "Potato_nematode",
    "Potato_pests",
    "Potato_phytophthora",
    "Raspberry_healthy",
    "Rice_bacterial_blight",
    "Rice_blast",
    "Rice_brown_spot",
    "Rice_tungro",
    "Rose_healthy",
    "Rose_rust",
    "Rose_slug_sawfly",
    "Soybean_healthy",
    "Squash_powdery_mildew",
    "Strawberry_healthy",
    "Strawberry_leaf_scorch",
    "Sugercane_healthy",
    "Sugercane_mosaic",
    "Sugercane_red_rot",
    "Sugercane_rust",
    "Sugercane_yellow_leaf",
    "Tomato_bacterial_spot",
    "Tomato_early_blight",
    "Tomato_healthy",
    "Tomato_late_blight",
    "Tomato_leaf_curl",
    "Tomato_leaf_mold",
    "Tomato_mosaic_virus",
    "Tomato_septoria_leaf_spot",
    "Tomato_spider_mites",
    "Tomato_target_spot",
    "Watermelon_anthracnose",
    "Watermelon_downy_mildew",
    "Watermelon_healthy",
    "Watermelon_mosaic_virus",
    "Watermelon_healthy",
]

session = ort.InferenceSession("model.onnx")
input_name = session.get_inputs()[0].name


def preprocess(img):
    img = img.resize((224, 224))
    img = np.array(img).astype(np.float32) / 255.0

    img = np.transpose(img, (2, 0, 1))

    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)
    img = (img - mean) / std

    img = np.expand_dims(img, axis=0)

    return img


def predict_image(img):
    img = Image.open(img).convert("RGB")
    x = preprocess(img)

    output = session.run(None, {input_name: x})[0]

    # stable softmax (no torch)
    exp = np.exp(output - np.max(output, axis=1, keepdims=True))
    probs = exp / np.sum(exp, axis=1, keepdims=True)

    pred = int(np.argmax(probs))
    confidence = float(np.max(probs))

    predicted_label = classes[pred]
    return {
        "label": predicted_label,
        "confidence": round(confidence * 100, 2)
    }