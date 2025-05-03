import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
import requests

load_dotenv()
db, auth = initialize_firebase()

login_routes = Blueprint('login', __name__)

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

@login_routes.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)
        result = response.json()

        if "error" in result:
            return jsonify({"error": result["error"]["message"]}), 401

         # After successful login, look up user data from Firestore
        user_docs = db.collection('User').where('email', '==', email).stream()
        user_data = None
        user_id = None

        for doc in user_docs:
            user_data = doc.to_dict()
            user_id = doc.id
            break  # assuming only one match

        if not user_data:
            return jsonify({'error': 'User not found in Firestore'}), 404

        return jsonify({
            "message": "Login successful",
            "email": result["email"],
            "userID": user_id,
            "name": user_data.get("name"),
            "idToken": result["idToken"]  # optional, for secure actions
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@login_routes.route('/users', methods=['GET'])
def get_users():
    try:
        # Fetch all users from Firestore
        user_docs = db.collection('User').stream()
        
        users = []
        for doc in user_docs:
            user_data = doc.to_dict()
            user_id = doc.id
            # Assuming 'username' is a field in the Firestore document
            users.append({
                'userID': user_id,
                'username': user_data.get('name')
            })

        if not users:
            return jsonify({'error': 'No users found'}), 404

        return jsonify({
            'users': users
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500