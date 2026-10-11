
import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

# All paths are relative to this script's folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "cleaned_complaints.csv")
MODEL_PATH = os.path.join(BASE_DIR, "complaint_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")

# 1. Load the dataset
df = pd.read_csv(DATASET_PATH)

print("Dataset shape:", df.shape)
print("Available columns:", df.columns.tolist())

# 2. Find the text and target columns
text_candidates = [
    "Consumer complaint narrative",
    "complaint",
    "complaintText",
    "narrative",
    "text",
]
target_candidates = ["Product", "predictedProduct", "category", "label"]

text_col = next(
    (c for c in text_candidates if c in df.columns), None
)
target_col = next(
    (c for c in target_candidates if c in df.columns), None
)

if text_col is None or target_col is None:
    raise ValueError(
        "Could not identify the complaint text and target columns. "
        f"Available columns: {df.columns.tolist()}"
    )

# 3. Remove rows with missing values in the required columns
df = df[[text_col, target_col]].dropna()
df[text_col] = df[text_col].astype(str).str.strip()
df[target_col] = df[target_col].astype(str).str.strip()
df = df[(df[text_col] != "") & (df[target_col] != "")]

X = df[text_col]
y = df[target_col]

print("\nText column:", text_col)
print("Target column:", target_col)
print("Number of usable rows:", len(df))
print("Number of categories:", y.nunique())

# 4. Load your saved model and vectorizer
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# 5. Create a held-out test split
_, X_test, _, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

# 6. Convert text into features and predict
X_test_features = vectorizer.transform(X_test)
y_pred = model.predict(X_test_features)

# 7. Calculate evaluation metrics
print("\n--- MODEL EVALUATION ---")
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(
    f"Precision (macro): "
    f"{precision_score(y_test, y_pred, average='macro', zero_division=0):.4f}"
)
print(
    f"Recall (macro): "
    f"{recall_score(y_test, y_pred, average='macro', zero_division=0):.4f}"
)
print(
    f"F1-score (macro): "
    f"{f1_score(y_test, y_pred, average='macro', zero_division=0):.4f}"
)

print("\n--- PER-CATEGORY REPORT ---")
print(classification_report(y_test, y_pred, zero_division=0))

print("\n--- CONFUSION MATRIX ---")
labels = sorted(y.unique())
print("Category order:", labels)
print(confusion_matrix(y_test, y_pred, labels=labels))
