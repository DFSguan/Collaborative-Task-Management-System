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
        status = data.get('status', 'Not Started')
        priority = data.get('priority', 'Medium')
        assigned_to = data.get('assignedTo')
        due_date = data.get('dueDate')  # Optional
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

        if project_id:
            query = tasks_ref.where('projectID', '==', project_id)
        elif assigned_to:
            query = tasks_ref.where('assignedTo', '==', assigned_to)
        else:
            return jsonify({'error': 'projectID or assignedTo is required'}), 400

        tasks = []
        for doc in query.stream():
            task = doc.to_dict()

            # ✅ Add assignedUsername by looking up the User collection
            assigned_user_id = task.get('assignedTo')
            if assigned_user_id:
                user_doc = db.collection('User').document(assigned_user_id).get()
                if user_doc.exists:
                    task['assignedUsername'] = user_doc.to_dict().get('name', '')
                else:
                    task['assignedUsername'] = 'Unknown User'
            else:
                task['assignedUsername'] = 'Unassigned'

            tasks.append(task)

        return jsonify({'tasks': tasks}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500