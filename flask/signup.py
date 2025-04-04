from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase

db, auth = initialize_firebase()  # You can use db if needed later

signup_routes = Blueprint('signup', __name__)

@signup_routes.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        user = auth.create_user(email=email, password=password)
        return jsonify({"message": "User created successfully", "userId": user.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400