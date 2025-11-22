from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("disease_predictor_model.pkl")
scaler = joblib.load("feature_scaler.pkl")

disease_labels = {
    0: "High Blood Pressure",
    1: "Diabetes",
    2: "Anemia",
    3: "Heart Disease",
    4: "Kidney Issue"
}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["features"]
    arr = np.array(data).reshape(1, -1)
    arr_scaled = scaler.transform(arr)
    pred = model.predict(arr_scaled)[0]
    result = disease_labels.get(int(pred), "Unknown")
    return jsonify({"prediction": result})

@app.route("/")
def home():
    return open("index.html").read()


if __name__ == "__main__":
    print("done..")
    app.run(debug=True)
