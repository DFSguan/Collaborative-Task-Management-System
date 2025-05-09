import os
from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
from datetime import datetime
import random
import string

db, auth = initialize_firebase()

signup_routes = Blueprint('signup', __name__)

# Helper function to generate random avatar URL using RoboHash
def generate_random_avatar():
    random_seed = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"https://robohash.org/{random_seed}"

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

        # Generate a random avatar URL
        avatar_url = generate_random_avatar()

        # Add user to Firestore with avatar
        user_data = {
            'userID': user.uid,
            'name': name,
            'email': email,
            'role': role,
            'avatar': avatar_url,  # Store avatar URL
            'projects': [],  # Start with no projects
            'createdAt': datetime.utcnow().isoformat()
        }
        db.collection('User').document(user.uid).set(user_data)

        return jsonify({"message": "User created successfully", "userId": user.uid, "avatar": avatar_url}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
