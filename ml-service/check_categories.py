import pandas as pd

file_path = "consumer-finance-complaints-prediction/train.csv"

df = pd.read_csv(file_path, low_memory=False)

# Show number of complaints in each product category
print("\nProduct Categories:")
print("-" * 50)

print(df["Product"].value_counts())

# Count complaints that contain written narratives
narrative_count = df["Consumer complaint narrative"].notna().sum()

print("\nNumber of complaints with narrative:")
print(narrative_count)

# Count missing narratives
missing_count = df["Consumer complaint narrative"].isna().sum()

print("\nNumber of complaints without narrative:")
print(missing_count)