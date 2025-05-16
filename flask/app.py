from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_config import initialize_firebase
from task import task_routes
from project import project_routes
from signup import signup_routes
from login import login_routes
from subtask import subtask_routes
from comment import comment_routes

app = Flask(__name__)
CORS(app)
db, _ = initialize_firebase()

# Register blueprints
app.register_blueprint(signup_routes)
app.register_blueprint(login_routes)
app.register_blueprint(project_routes)
app.register_blueprint(task_routes)
app.register_blueprint(subtask_routes)
app.register_blueprint(comment_routes)

@app.route('/')
def home():
    return jsonify({"message": "Flask with Firebase is working!"})

if __name__ == '__main__':
    app.run(host = '192.168.0.107', port=3000, debug=True)