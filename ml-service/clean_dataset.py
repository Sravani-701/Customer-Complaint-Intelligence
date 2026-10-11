import pandas as pd

# Load prepared dataset
file_path = "prepared_complaints.csv"

df = pd.read_csv(file_path, low_memory=False)

print("\nOriginal Dataset Shape:")
print(df.shape)

# Handle missing values

df["Sub-issue"] = df["Sub-issue"].fillna("Unknown")

df["Company public response"] = (
    df["Company public response"].fillna("No public response")
)

df["State"] = df["State"].fillna("Unknown")

df["Company response to consumer"] = (
    df["Company response to consumer"].fillna("Unknown")
)

df["Consumer disputed?"] = (
    df["Consumer disputed?"].fillna("Unknown")
)

# Save cleaned dataset
output_file = "cleaned_complaints.csv"

df.to_csv(output_file, index=False)

print("\nCleaning completed successfully!")
print("-" * 60)

print("Cleaned Dataset Shape:")
print(df.shape)

print("\nMissing Values After Cleaning:")
print("-" * 60)
print(df.isnull().sum())

print("\nCleaned dataset saved as:")
print(output_file)