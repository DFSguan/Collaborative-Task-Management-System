from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask app
app = Flask(__name__)

# Load Firebase credentials
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore database
db = firestore.client()

@app.route('/')
def home():
    return jsonify({"message": "Flask with Firebase is working!"})

# Example: Add data to Firestore
@app.route('/add', methods=['POST'])
def add_data():
    data = request.json  # Get JSON data from request
    doc_ref = db.collection('tasks').add(data)  # Add to Firestore
    return jsonify({"message": "Data added successfully!", "id": doc_ref[1].id})

# Example: Retrieve data from Firestore
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks_ref = db.collection('tasks').stream()
    tasks = [{**doc.to_dict(), "id": doc.id} for doc in tasks_ref]
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True)