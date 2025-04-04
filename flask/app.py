from flask import Flask, jsonify, request
from firebase_config import initialize_firebase
from signup import signup_routes
from login import login_routes

app = Flask(__name__)
db, _ = initialize_firebase()  # _ = auth, not needed here

# Register blueprints
app.register_blueprint(signup_routes)
app.register_blueprint(login_routes)

@app.route('/')
def home():
    return jsonify({"message": "Flask with Firebase is working!"})

@app.route('/add', methods=['POST'])
def add_data():
    data = request.json
    doc_ref = db.collection('tasks').add(data)
    return jsonify({"message": "Data added successfully!", "id": doc_ref[1].id})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks_ref = db.collection('tasks').stream()
    tasks = [{**doc.to_dict(), "id": doc.id} for doc in tasks_ref]
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True)