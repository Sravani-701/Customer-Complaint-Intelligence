import pandas as pd

# Load prepared dataset
file_path = "prepared_complaints.csv"

df = pd.read_csv(file_path, low_memory=False)

print("\nDataset Shape:")
print(df.shape)

print("\nMissing Values:")
print("-" * 60)
print(df.isnull().sum())

print("\nMissing Value Percentage:")
print("-" * 60)
print((df.isnull().mean() * 100).round(2))

print("\nData Types:")
print("-" * 60)
print(df.dtypes)