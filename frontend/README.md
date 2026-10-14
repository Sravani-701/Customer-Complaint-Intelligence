# Customer Complaint Intelligence and Automatic Classification System

## Live Deployment

- **Frontend:** https://complaint-frontend-059x.onrender.com
- **Backend API:** https://customer-complaint-intelligence-1.onrender.com
- **Machine Learning API:** https://complaint-ml-service.onrender.com

## Project Overview

The Customer Complaint Intelligence and Automatic Classification System is a machine learning-based web application that automatically classifies customer complaints into relevant financial product categories using Natural Language Processing (NLP).

The system organizes customer complaints, provides predicted categories with confidence scores, and supports complaint status tracking through a web interface.

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
- **Database Integration:** Stores user and complaint information for retrieval.

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
| Deployment | Render |

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

Performance varies by category. Some categories, such as Prepaid card and Credit reporting, had lower recall. Therefore, accuracy alone does not fully describe performance across all categories.

*Note: Retain this accuracy figure only if it matches the actual evaluation results of your saved model.*

## Complaint Categories

The model supports the following ten categories:

1. Checking or savings account
2. Credit card
3. Credit reporting
4. Debt collection
5. Money service
6. Mortgage
7. Personal consumer reports
8. Prepaid card
9. Student loan
10. Vehicle loan or lease

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

*Other supporting files may exist in these directories.*

## Running the Project Locally

### Prerequisites

Install Node.js, Python, and the required dependencies. Configure MongoDB and the environment variables required by the application.

### 1. Start the Backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
npm start
```

Use the start command defined in `backend/package.json` if it differs.

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
pip install -r requirements.txt
python app.py
```

Ensure that the required Python packages are listed in `ml-service/requirements.txt`. Configure the backend's ML service URL and the required environment variables for local development.

## Dataset and Privacy

The model was developed using a consumer financial complaints dataset. The raw training datasets are not included in this repository because of their size.

Do not commit passwords, API keys, database credentials, or private environment configuration files.

## Future Enhancements

- Improve classification performance for underperforming categories.
- Add detailed model evaluation metrics and visualizations.
- Improve complaint search and filtering.
- Enhance complaint status tracking.
- Strengthen authentication and role-based access controls.

## Author

Developed as an academic project in Artificial Intelligence and Machine Learning.

## License

No open-source license has been specified yet.