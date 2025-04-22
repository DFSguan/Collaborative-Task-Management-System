from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
from firebase_admin import firestore
import uuid
from datetime import datetime

db, _ = initialize_firebase()
project_routes = Blueprint('project', __name__)

@project_routes.route('/create_project', methods=['POST'])
def create_project():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        owner_id = data.get('ownerID')
        members = data.get('members', [])

        if not title or not owner_id:
            return jsonify({'error': 'Project title and ownerID are required'}), 400

        # Validate member IDs
        valid_member_ids = []
        invalid_member_ids = []

        for member_id in members:
            user_doc = db.collection('User').document(member_id).get()
            if user_doc.exists:
                valid_member_ids.append(member_id)
            else:
                invalid_member_ids.append(member_id)

        if invalid_member_ids:
            return jsonify({
                "error": "Some member IDs are invalid.",
                "invalidMembers": invalid_member_ids
            }), 400

        # Create project ID
        project_id = str(uuid.uuid4())

        # Add the owner to the members list if not included
        if owner_id not in valid_member_ids:
            valid_member_ids.append(owner_id)

        # Save to Firestore
        db.collection('Project').document(project_id).set({
            'projectID': project_id,
            'title': title,
            'description': description,
            'ownerID': owner_id,
            'members': valid_member_ids,
            'deadline': data.get('deadline'),  # optional
            'createdAt': datetime.utcnow().isoformat()
        })

        # Update each user's "projects" field
        for member_id in valid_member_ids:
            user_ref = db.collection('User').document(member_id)
            user_doc = user_ref.get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                existing_projects = user_data.get('projects', [])
                if project_id not in existing_projects:
                    existing_projects.append(project_id)
                    user_ref.update({'projects': existing_projects})

        return jsonify({"message": "Project created successfully!", "projectID": project_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_routes.route('/get_projects', methods=['GET'])
def get_projects():
    try:
        user_id = request.args.get('userID')

        if not user_id:
            return jsonify({'error': 'userID is required'}), 400

        # Get all projects
        projects_ref = db.collection('Project')
        all_projects = projects_ref.stream()

        user_projects = []
        for doc in all_projects:
            project_data = doc.to_dict()
            # Include the project if the user is the owner or a member
            if project_data.get('ownerID') == user_id or user_id in project_data.get('members', []):
                user_projects.append({
                    'projectID': project_data.get('projectID'),
                    'title': project_data.get('title'),
                    'description': project_data.get('description'),
                    'ownerID': project_data.get('ownerID'),
                    'members': project_data.get('members'),
                    'deadline': project_data.get('deadline'),
                    'createdAt': project_data.get('createdAt')
                })

        return jsonify({'projects': user_projects}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500