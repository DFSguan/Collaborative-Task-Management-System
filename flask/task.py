from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
import uuid
from datetime import datetime

db, _ = initialize_firebase()
task_routes = Blueprint('task', __name__)

@task_routes.route('/create_task', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        status = data.get('status', 'To Do')
        priority = data.get('priority', 'Medium')
        assigned_to = data.get('assignedTo')
        due_date = data.get('dueDate')
        project_id = data.get('projectID')

        if not title or not project_id:
            return jsonify({'error': 'Task title and projectID are required'}), 400

        # ✅ Check if project exists
        project_doc = db.collection('Project').document(project_id).get()
        if not project_doc.exists:
            return jsonify({'error': 'Project does not exist'}), 404

        # ✅ Optional: Check if assignedTo is a valid user
        if assigned_to:
            user_doc = db.collection('User').document(assigned_to).get()
            if not user_doc.exists:
                return jsonify({'error': f'Assigned user ({assigned_to}) not found'}), 404

        # ✅ Create and save task
        task_id = str(uuid.uuid4())
        task_data = {
            'taskID': task_id,
            'projectID': project_id,
            'title': title,
            'description': description,
            'status': status,
            'priority': priority,
            'assignedTo': assigned_to,
            'dueDate': due_date,
            'createdAt': datetime.utcnow().isoformat()
        }

        db.collection('Tasks').document(task_id).set(task_data)

        return jsonify({'message': 'Task created successfully', 'taskID': task_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_routes.route('/get_tasks', methods=['GET'])
def get_tasks():
    try:
        project_id = request.args.get('projectID')
        assigned_to = request.args.get('assignedTo')

        tasks_ref = db.collection('Tasks')
        query = tasks_ref

        # Apply filters based on query parameters
        if project_id:
            query = query.where('projectID', '==', project_id)
        if assigned_to:
            query = query.where('assignedTo', '==', assigned_to)

        tasks = []
        for doc in query.stream():
            task = doc.to_dict()

            # Attach user info if assigned
            assigned_user_id = task.get('assignedTo')
            if assigned_user_id:
                user_doc = db.collection('User').document(assigned_user_id).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    task['assignedUsername'] = user_data.get('name', '')
                    task['assignedAvatar'] = user_data.get('avatar', '')
                else:
                    task['assignedUsername'] = 'Unknown User'
                    task['assignedAvatar'] = ''
            else:
                task['assignedUsername'] = 'Unassigned'
                task['assignedAvatar'] = ''

            tasks.append(task)

        return jsonify({'tasks': tasks}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_routes.route('/update_task/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.get_json()
        task_ref = db.collection('Tasks').document(task_id)

        if not task_ref.get().exists:
            return jsonify({'error': 'Task not found'}), 404

        update_data = {}

        for field in ['title', 'description', 'status', 'priority', 'dueDate']:
            if field in data:
                update_data[field] = data[field]

        # Special handling for assignedUsername (not assignedTo)
        if 'assignedUsername' in data:
            username = data['assignedUsername']
            # Search User collection by 'name'
            user_query = db.collection('User').where('name', '==', username).limit(1).stream()
            user_doc = next(user_query, None)

            if user_doc:
                update_data['assignedTo'] = user_doc.id  # Get the userId
            else:
                return jsonify({'error': 'Assigned user not found'}), 404

        update_data['updatedAt'] = datetime.utcnow().isoformat()
        task_ref.update(update_data)

        # After update, retrieve latest task to include assignedUsername
        updated_task = task_ref.get().to_dict()

        assigned_user_id = updated_task.get('assignedTo')
        if assigned_user_id:
            user_doc = db.collection('User').document(assigned_user_id).get()
            if user_doc.exists:
                updated_task['assignedUsername'] = user_doc.to_dict().get('name', '')
            else:
                updated_task['assignedUsername'] = 'Unknown User'
        else:
            updated_task['assignedUsername'] = 'Unassigned'

        return jsonify({'message': 'Task updated successfully', 'task': updated_task}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_routes.route('/delete_task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task_ref = db.collection('Tasks').document(task_id)
        if not task_ref.get().exists:
            return jsonify({'error': 'Task not found'}), 404

        task_ref.delete()
        return jsonify({'message': 'Task deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500