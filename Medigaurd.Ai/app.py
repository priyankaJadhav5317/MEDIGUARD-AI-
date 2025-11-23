from flask import Flask, request, jsonify, send_from_directory
import joblib
import numpy as np
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Load ML model and scaler
model = joblib.load("disease_predictor_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

disease_labels = {
    0: "High Blood Pressure",
    1: "Diabetes",
    2: "Anemia",
    3: "Healthy",
    4: "Kidney Issue"
}

# Serve index.html
@app.route("/")
def home():
    return send_from_directory('.', 'index.html')

# Serve style.css
@app.route("/style.css")
def style():
    return send_from_directory('.', 'style.css')

# ML prediction route
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["features"]
    arr = np.array(data).reshape(1, -1)
    arr_scaled = scaler.transform(arr)

    # Get prediction and probabilities
    pred = model.predict(arr_scaled)[0]
    probs = model.predict_proba(arr_scaled)[0]

    # Map probabilities to labels
    response = {
        "prediction": disease_labels.get(int(pred), "Unknown"),
        "probabilities": {disease_labels[i]: round(float(prob) * 100, 2) for i, prob in enumerate(probs)}
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)

