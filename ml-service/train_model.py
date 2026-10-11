
import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "cleaned_complaints.csv")

# Save new model files separately to protect the working application
MODEL_PATH = os.path.join(BASE_DIR, "complaint_model_new.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "tfidf_vectorizer_new.pkl")

print("Loading cleaned dataset...")
df = pd.read_csv(DATASET_PATH, usecols=[
    "Consumer complaint narrative",
    "Product",
])

df = df.dropna(subset=[
    "Consumer complaint narrative",
    "Product",
])

df["Consumer complaint narrative"] = (
    df["Consumer complaint narrative"].astype(str).str.strip()
)
df["Product"] = df["Product"].astype(str).str.strip()

df = df[
    (df["Consumer complaint narrative"] != "")
    & (df["Product"] != "")
]

X = df["Consumer complaint narrative"]
y = df["Product"]

print("Usable records:", len(df))
print("Categories:", y.nunique())

# Split before fitting the vectorizer or model
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print("Training TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(
    max_features=100000,
    ngram_range=(1, 2),
    min_df=2,
    sublinear_tf=True,
)

X_train_features = vectorizer.fit_transform(X_train)
X_test_features = vectorizer.transform(X_test)

print("Training Logistic Regression model...")
model = LogisticRegression(
    max_iter=1000,
    solver="lbfgs",
)

model.fit(X_train_features, y_train)

print("\nEvaluating on unseen test split...")
y_pred = model.predict(X_test_features)

print("Accuracy:", round(accuracy_score(y_test, y_pred), 4))
print("\nClassification report:")
print(classification_report(y_test, y_pred, zero_division=0))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred, labels=model.classes_))

joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("\nTraining complete.")
print("New model:", MODEL_PATH)
print("New vectorizer:", VECTORIZER_PATH)
print("Your existing application model files were not overwritten.")
