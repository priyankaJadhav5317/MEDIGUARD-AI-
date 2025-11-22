from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load your ML model + scaler
model = joblib.load("disease_predictor_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['features']   # list of 24 input values

    scaled = scaler.transform([data])
    prediction = model.predict(scaled)

    return jsonify({
        "prediction": prediction[0]
    })

if __name__ == "__main__":
    app.run(debug=True)
