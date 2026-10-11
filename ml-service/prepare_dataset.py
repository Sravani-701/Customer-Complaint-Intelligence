import pandas as pd

# Load original dataset
file_path = "consumer-finance-complaints-prediction/train.csv"

df = pd.read_csv(file_path, low_memory=False)

# Keep complaints that have written narratives
df = df.dropna(subset=["Consumer complaint narrative"])

# Categories selected for our project
selected_categories = [
    "Personal consumer reports",
    "Debt collection",
    "Mortgage",
    "Credit card",
    "Checking or savings account",
    "Prepaid card",
    "Student loan",
    "Credit reporting",
    "Money service",
    "Vehicle loan or lease"
]

# Keep only selected categories
df = df[df["Product"].isin(selected_categories)]

# Keep 14 useful columns
selected_columns = [
    "Date received",
    "Product",
    "Issue",
    "Sub-issue",
    "Consumer complaint narrative",
    "Company public response",
    "Company",
    "State",
    "Consumer consent provided?",
    "Submitted via",
    "Date sent to company",
    "Company response to consumer",
    "Timely response?",
    "Consumer disputed?"
]

df = df[selected_columns]

# Save prepared dataset
output_file = "prepared_complaints.csv"

df.to_csv(output_file, index=False)

print("\nPrepared dataset created successfully!")
print("-" * 60)

print("Dataset Shape:")
print(df.shape)

print("\nNumber of columns:")
print(len(df.columns))

print("\nColumns:")
for i, column in enumerate(df.columns, start=1):
    print(f"{i}. {column}")

print("\nProduct Distribution:")
print("-" * 60)
print(df["Product"].value_counts())

print("\nSaved as:")
print(output_file)