import pandas as pd

# Load cleaned dataset
file_path = "cleaned_complaints.csv"

df = pd.read_csv(file_path, low_memory=False)

print("\nOriginal Dataset:")
print(df.shape)

# Number of samples required from each category
samples_per_category = 15000

# Select all 10 categories
categories = [
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

# Create balanced dataset
balanced_parts = []

for category in categories:

    category_data = df[df["Product"] == category]

    # Randomly select 15,000 records
    sampled_data = category_data.sample(
        n=samples_per_category,
        random_state=42
    )

    balanced_parts.append(sampled_data)

# Combine all categories
balanced_df = pd.concat(balanced_parts)

# Shuffle the final dataset
balanced_df = balanced_df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# Save balanced dataset
output_file = "balanced_complaints.csv"

balanced_df.to_csv(output_file, index=False)

print("\nBalanced dataset created successfully!")
print("-" * 60)

print("Dataset Shape:")
print(balanced_df.shape)

print("\nCategory Distribution:")
print("-" * 60)
print(balanced_df["Product"].value_counts())

print("\nSaved as:")
print(output_file)