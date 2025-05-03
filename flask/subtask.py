from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
import uuid
from datetime import datetime

db, _ = initialize_firebase()
subtask_routes = Blueprint('subtask', __name__)

@subtask_routes.route('/create_subtask', methods=['POST'])
def create_subtask():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        status = data.get('status', 'Not Started')
        priority = data.get('priority', 'Medium')
        task_id = data.get('taskID')
        due_date = data.get('dueDate')
        assigned_username = data.get('assignedUsername')  # <-- user input username

        if not title or not task_id:
            return jsonify({'error': 'Subtask title and taskID are required'}), 400

        # Check if task exists
        task_doc = db.collection('Tasks').document(task_id).get()
        if not task_doc.exists:
            return jsonify({'error': 'Task does not exist'}), 404

        assigned_to_user_id = None

        # If assignedUsername provided, lookup userID
        if assigned_username:
            user_query = db.collection('User').where('name', '==', assigned_username).limit(1).stream()
            user_doc = next(user_query, None)

            if user_doc:
                assigned_to_user_id = user_doc.id
            else:
                return jsonify({'error': 'Assigned username not found'}), 404

        # Create subtask
        subtask_id = str(uuid.uuid4())
        subtask_data = {
            'subtaskID': subtask_id,
            'taskID': task_id,
            'title': title,
            'description': description,
            'status': status,
            'priority': priority,
            'assignedTo': assigned_to_user_id,
            'dueDate': due_date,
            'createdAt': datetime.utcnow().isoformat()
        }

        db.collection('Subtasks').document(subtask_id).set(subtask_data)

        return jsonify({'message': 'Subtask created successfully', 'subtaskID': subtask_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subtask_routes.route('/get_subtasks/<task_id>', methods=['GET'])
def get_subtasks(task_id):
    try:
        if not task_id:
            return jsonify({'error': 'taskID is required'}), 400

        subtasks_ref = db.collection('Subtasks').where('taskID', '==', task_id)
        subtasks = []
        for doc in subtasks_ref.stream():
            subtask = doc.to_dict()

            assigned_to_user_id = subtask.get('assignedTo')
            if assigned_to_user_id:
                user_doc = db.collection('User').document(assigned_to_user_id).get()
                if user_doc.exists:
                    subtask['assignedUsername'] = user_doc.to_dict().get('name', '')
                else:
                    subtask['assignedUsername'] = 'Unknown User'
            else:
                subtask['assignedUsername'] = 'Unassigned'

            subtasks.append(subtask)

        return jsonify({'subtasks': subtasks}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subtask_routes.route('/update_subtask/<subtask_id>', methods=['PUT'])
def update_subtask(subtask_id):
    try:
        data = request.get_json()
        subtask_ref = db.collection('Subtasks').document(subtask_id)

        if not subtask_ref.get().exists:
            return jsonify({'error': 'Subtask not found'}), 404

        update_data = {}

        for field in ['title', 'description', 'status', 'priority', 'dueDate']:
            if field in data:
                update_data[field] = data[field]

        # Handle assignedUsername
        if 'assignedUsername' in data:
            username = data['assignedUsername']
            user_query = db.collection('User').where('name', '==', username).limit(1).stream()
            user_doc = next(user_query, None)

            if user_doc:
                update_data['assignedTo'] = user_doc.id
            else:
                return jsonify({'error': 'Assigned username not found'}), 404

        update_data['updatedAt'] = datetime.utcnow().isoformat()

        subtask_ref.update(update_data)

        # Return updated subtask
        updated_subtask = subtask_ref.get().to_dict()

        assigned_to_user_id = updated_subtask.get('assignedTo')
        if assigned_to_user_id:
            user_doc = db.collection('User').document(assigned_to_user_id).get()
            if user_doc.exists:
                updated_subtask['assignedUsername'] = user_doc.to_dict().get('name', '')
            else:
                updated_subtask['assignedUsername'] = 'Unknown User'
        else:
            updated_subtask['assignedUsername'] = 'Unassigned'

        return jsonify({'message': 'Subtask updated successfully', 'subtask': updated_subtask}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subtask_routes.route('/delete_subtask/<subtask_id>', methods=['DELETE'])
def delete_subtask(subtask_id):
    try:
        subtask_ref = db.collection('Subtasks').document(subtask_id)

        if not subtask_ref.get().exists:
            return jsonify({'error': 'Subtask not found'}), 404

        subtask_ref.delete()

        return jsonify({'message': 'Subtask deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
