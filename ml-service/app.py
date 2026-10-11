from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(
    os.path.join(BASE_DIR, "complaint_model.pkl")
)

vectorizer = joblib.load(
    os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")
)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Customer Complaint Intelligence API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    complaint = data.get("complaint", "").strip()

    if not complaint:
        return jsonify({
            "error": "Please enter a complaint."
        }), 400

    complaint_tfidf = vectorizer.transform([complaint])
    prediction = model.predict(complaint_tfidf)[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = float(
            model.predict_proba(complaint_tfidf).max()
        )

    return jsonify({
        "complaint": complaint,
        "predictedProduct": str(prediction),
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
