import firebase_admin
from firebase_admin import credentials, auth

# Load Firebase credentials
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)

# Firebase authentication instance
firebase_auth = auth