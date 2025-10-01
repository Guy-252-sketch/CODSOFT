# sales_prediction_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Load your dataset
data = pd.read_csv("advertising.csv")

# Automatically separate features and target
target_col = data.columns[-1]
X = data.drop(target_col, axis=1)
y = data[target_col]

# Encode non-numeric columns
for col in X.columns:
    if X[col].dtype == object:
        lab = LabelEncoder()
        X[col] = lab.fit_transform(X[col].astype(str))

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=11
)

# Model
model = RandomForestRegressor(n_estimators=120, random_state=11)
model.fit(X_train, y_train)

# Predictions and evaluation
preds = model.predict(X_test)
mse = mean_squared_error(y_test, preds)
r2 = r2_score(y_test, preds)

print("Target column used:", target_col)
print("Mean Squared Error:", round(mse, 3))
print("R2 Score:", round(r2, 3))
print("Sample predictions:", preds[:5])
