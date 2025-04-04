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

        return jsonify({
            "message": "Login successful",
            "idToken": result["idToken"],  # Used to authenticate further requests if needed
            "email": result["email"]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500