# firebase_configure.py
import firebase_admin
from firebase_admin import credentials, firestore, auth

def initialize_firebase():
    if not firebase_admin._apps:  # Prevent re-initialization
        cred = credentials.Certificate("firebase_config.json")
        firebase_admin.initialize_app(cred)

    return firestore.client(), auth