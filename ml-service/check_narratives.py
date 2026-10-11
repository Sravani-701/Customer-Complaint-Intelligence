import pandas as pd

file_path = "consumer-finance-complaints-prediction/train.csv"

df = pd.read_csv(file_path, low_memory=False)

# Keep only complaints that have written narratives
df_with_text = df.dropna(subset=["Consumer complaint narrative"])

print("\nTotal complaints with narratives:")
print(len(df_with_text))

print("\nNarratives available for each product:")
print("-" * 60)

print(df_with_text["Product"].value_counts())