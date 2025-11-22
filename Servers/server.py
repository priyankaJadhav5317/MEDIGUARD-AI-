from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load model & scaler
model = joblib.load("disease_predictor_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    features: list

@app.post("/predict")
def predict(data: InputData):
    X = np.array(data.features).reshape(1, -1)
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)

    disease_map = {
        0: "Normal",
        1: "High Blood Pressure",
        2: "Diabetes",
        3: "Anemia"
    }

    return {"prediction": disease_map[int(prediction[0])]}

