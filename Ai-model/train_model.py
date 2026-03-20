import os
import numpy as np
from preprocess import extract_features
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import joblib

DATASET_PATH = "dataset"

features = []
labels = []

# LOAD DATA
for label in os.listdir(DATASET_PATH):

    folder = os.path.join(DATASET_PATH, label)

    for file in os.listdir(folder):

        file_path = os.path.join(folder, file)

        try:
            data = extract_features(file_path)

            features.append(data)
            labels.append(label)

        except:
            print("Error processing file:", file)

X = np.array(features)

# NORMALIZATION 🔥
scaler = StandardScaler()
X = scaler.fit_transform(X)

# SAVE SCALER (IMPORTANT)
joblib.dump(scaler, "scaler.pkl")

# LABEL ENCODING
encoder = LabelEncoder()
y = encoder.fit_transform(labels)

# SAVE ENCODER
joblib.dump(encoder, "label_encoder.pkl")

# SPLIT
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# MODEL 🔥
model = Sequential()

model.add(Dense(256, activation='relu', input_shape=(X.shape[1],)))
model.add(Dropout(0.3))

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.3))

model.add(Dense(64, activation='relu'))
model.add(Dense(2, activation='softmax'))

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print("Total valid samples:", len(features))
# TRAIN
model.fit(
    X_train,
    y_train,
    epochs=50,
    batch_size=16,
    validation_data=(X_test, y_test)
)


# EVALUATE
loss, accuracy = model.evaluate(X_test, y_test)

print("🔥 Model Accuracy:", accuracy)

# SAVE MODEL
model.save("scream_model.h5")

print("✅ Model + scaler + encoder saved!")