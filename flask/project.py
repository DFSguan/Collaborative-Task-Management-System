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
            'deadline': data.get('deadline'),
            'createdAt': datetime.utcnow().isoformat()
        })

        print("Received deadline:", data.get('deadline'))

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
        project_id = request.args.get('projectID')
        user_id = request.args.get('userID')

        # Case 1: Get project by projectID
        if project_id:
            project_ref = db.collection('Project').document(project_id)
            project_doc = project_ref.get()

            if not project_doc.exists:
                return jsonify({'error': 'Project not found'}), 404

            project_data = project_doc.to_dict()

            # Fetch member profiles with avatar
            member_profiles = []
            for member_id in project_data.get('members', []):
                user_doc = db.collection('User').document(member_id).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    member_profiles.append({
                        'userID': member_id,
                        'name': user_data.get('name'),
                        'avatar': user_data.get('avatar')
                    })

            return jsonify({
                'project': project_data,
                'memberProfiles': member_profiles
            }), 200

        # Case 2: Get all projects for a specific user
        if user_id:
            projects_ref = db.collection('Project')
            all_projects = projects_ref.stream()

            user_projects = []
            for doc in all_projects:
                project_data = doc.to_dict()
                if project_data.get('ownerID') == user_id or user_id in project_data.get('members', []):
                    user_projects.append(project_data)

            return jsonify({'projects': user_projects}), 200

        return jsonify({'error': 'Provide either projectID or userID'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_routes.route('/update_project', methods=['PUT'])
def update_project():
    try:
        data = request.get_json()
        project_id = data.get('projectID')

        if not project_id:
            return jsonify({'error': 'projectID is required'}), 400

        project_ref = db.collection('Project').document(project_id)
        project_doc = project_ref.get()

        if not project_doc.exists:
            return jsonify({'error': 'Project not found'}), 404

        update_data = {}
        allowed_fields = ['title', 'description', 'deadline', 'members']

        # Update fields if provided
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]

        # Validate and update members if provided
        if 'members' in update_data:
            valid_member_ids = []
            invalid_member_ids = []

            for member_id in update_data['members']:
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

            # Also include the owner in the members list
            current_owner_id = project_doc.to_dict().get('ownerID')
            if current_owner_id and current_owner_id not in valid_member_ids:
                valid_member_ids.append(current_owner_id)

            update_data['members'] = valid_member_ids

        # Perform the update
        project_ref.update(update_data)

        # Optionally, update each user's 'projects' list (only if members changed)
        if 'members' in update_data:
            for member_id in update_data['members']:
                user_ref = db.collection('User').document(member_id)
                user_doc = user_ref.get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    existing_projects = user_data.get('projects', [])
                    if project_id not in existing_projects:
                        existing_projects.append(project_id)
                        user_ref.update({'projects': existing_projects})

        return jsonify({'message': 'Project updated successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@project_routes.route('/get_project_overview', methods=['GET'])
def get_project_overview():
    try:
        project_id = request.args.get('projectID')

        if not project_id:
            return jsonify({'error': 'projectID is required'}), 400

        project_doc = db.collection('Project').document(project_id).get()
        if not project_doc.exists:
            return jsonify({'error': 'Project not found'}), 404

        project_data = project_doc.to_dict()

        # Get tasks under this project
        tasks_query = db.collection('Tasks').where('projectID', '==', project_id).stream()
        tasks = []

        for task_doc in tasks_query:
            task_data = task_doc.to_dict()
            task_id = task_data['taskID']

            # Count comments for this task
            comment_query = db.collection('Comments').where('taskID', '==', task_id).stream()
            comment_count = sum(1 for _ in comment_query)

            tasks.append({
                'taskID': task_id,
                'title': task_data.get('title'),
                'dueDate': task_data.get('dueDate'),
                'commentCount': comment_count
            })

        result = {
            'projectID': project_id,
            'title': project_data.get('title'),
            'description': project_data.get('description'),
            'deadline': project_data.get('deadline'),
            'members': project_data.get('members'),
            'tasks': tasks
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
