import pandas as pd

# Load the training dataset
file_path = "consumer-finance-complaints-prediction/train.csv"

df = pd.read_csv(file_path)

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print("-" * 50)

for column in df.columns:
    print(column)

print("\nFirst 5 Rows:")
print("-" * 50)

print(df.head())

print("\nMissing Values:")
print("-" * 50)

print(df.isnull().sum())