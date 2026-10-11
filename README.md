# Customer Complaint Intelligence and Automatic Classification System

## Project Overview

The Customer Complaint Intelligence and Automatic Classification System is a machine learning-based web application that automatically classifies customer complaints into relevant financial product categories using Natural Language Processing (NLP).

The system helps organize customer complaints, provides predicted categories with confidence scores, and supports complaint status tracking through a web interface.

## Objectives

- Automatically classify customer complaints using machine learning.
- Process complaint narratives using NLP and TF-IDF vectorization.
- Display predicted complaint categories and confidence scores.
- Allow customers to submit and track complaints.
- Enable administrators to manage complaints and update their status.

## Key Features

- **Complaint Submission:** Customers can submit complaints through the web application.
- **Automatic Classification:** The trained ML model predicts the appropriate complaint category.
- **Prediction Confidence:** Displays the model's confidence score for its prediction.
- **Complaint Tracking:** Customers can view their submitted complaints.
- **Admin Dashboard:** Administrators can review complaints and update their status.
- **Database Integration:** Stores complaint and user information for retrieval.

## Technologies Used

| Component | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Machine Learning Service | Python, Flask |
| NLP and Feature Extraction | TF-IDF |
| Machine Learning Algorithm | Logistic Regression |
| Development Tools | Visual Studio Code, Git, GitHub |

## Machine Learning Model

The model uses customer complaint narratives as input and predicts the associated financial product category.

### Workflow

1. Load the complaint dataset.
2. Prepare and clean the complaint narratives.
3. Convert text into numerical features using TF-IDF.
4. Train a Logistic Regression classifier.
5. Evaluate the model on a stratified held-out test set.
6. Save the trained model and vectorizer for prediction.
7. Integrate the prediction service with the web application.

### Model Evaluation

The trained model achieved **83.32% accuracy** on the held-out test split used during evaluation.

Performance varies by category. Some categories, such as Prepaid card and Credit reporting, had lower recall, so accuracy alone does not represent performance equally across all categories.

## Complaint Categories

The model supports the following categories:

- Checking or savings account
- Credit card
- Credit reporting
- Debt collection
- Money service
- Mortgage
- Personal consumer reports
- Prepaid card
- Student loan
- Vehicle loan or lease

## Project Structure

```text
Customer-Complaint-Intelligence/
├── backend/
├── frontend/
├── ml-service/
│   ├── app.py
│   ├── complaint_model.pkl
│   ├── tfidf_vectorizer.pkl
│   └── train_model.py
├── .gitignore
└── README.md
```

*Note: Other supporting files may exist in these directories.*

## Running the Project Locally

### Prerequisites

Install Node.js, Python, and MongoDB. Ensure the required Python and Node.js dependencies are available.

### 1. Start the Backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
npm start
```

Use the start command defined in `backend/package.json` if it differs from the command above.

### 2. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

### 3. Start the Machine Learning Service

Open another terminal:

```bash
cd ml-service
pip install flask pandas numpy scikit-learn
python app.py
```

Install any additional dependencies required by the application. Configure the service URLs and MongoDB connection using your local environment settings.

## Dataset and Privacy

The model was developed using a consumer financial complaints dataset. The raw training datasets are not included in this repository because of their size.

Do not commit passwords, API keys, database credentials, or private environment configuration files.

## Future Enhancements

- Improve classification performance for underperforming categories.
- Add more detailed model evaluation and visualizations.
- Improve complaint search and filtering.
- Deploy the frontend, backend, and ML service online.
- Add stronger authentication and role-based access controls.

## Author

Developed as an academic project in Artificial Intelligence and Machine Learning.

## License

No open-source license has been specified yet.
