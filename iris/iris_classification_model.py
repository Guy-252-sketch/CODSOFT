# iris_classification_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Load the dataset (make sure IRIS.csv is in the same folder)
data = pd.read_csv("IRIS.csv")

# Drop any unnecessary index column if present
if "Id" in data.columns:
    data = data.drop("Id", axis=1)

# Figure out which column is the label
# Update this if your target column has a different name
target_col = "Species" if "Species" in data.columns else data.columns[-1]

X = data.drop(target_col, axis=1)
y = data[target_col]

# Encode target labels if they are strings
if y.dtype == object:
    encoder = LabelEncoder()
    y = encoder.fit_transform(y)

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=5
)

# Train a simple KNN classifier
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

# Test and evaluate
preds = model.predict(X_test)
score = accuracy_score(y_test, preds)

print("Model accuracy:", round(score, 3))
print("Sample predictions:", preds[:10])
