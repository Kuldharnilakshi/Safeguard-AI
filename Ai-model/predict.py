import numpy as np
import joblib
from tensorflow.keras.models import load_model
from preprocess import extract_features

model = load_model("scream_model.h5")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("label_encoder.pkl")

file = "test.wav"  # or mic input later

features = extract_features(file)
features = scaler.transform([features])

prediction = model.predict(features)

predicted_label = encoder.inverse_transform([np.argmax(prediction)])

print(predicted_label[0])