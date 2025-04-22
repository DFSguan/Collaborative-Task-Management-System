from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
from datetime import datetime

db, auth = initialize_firebase()

signup_routes = Blueprint('signup', __name__)

@signup_routes.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'student')  # Default role is "student"

        if not email or not password or not name:
            return jsonify({'error': 'Name, email, and password are required'}), 400

        # Create Firebase Auth user
        user = auth.create_user(email=email, password=password)

        # Add user to Firestore
        user_data = {
            'userID': user.uid,
            'name': name,
            'email': email,
            'role': role,
            'projects': [],  # Start with no projects
            'createdAt': datetime.utcnow().isoformat()
        }
        db.collection('User').document(user.uid).set(user_data)

        return jsonify({"message": "User created successfully", "userId": user.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
