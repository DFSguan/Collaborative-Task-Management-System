from flask import Blueprint, request, jsonify
from firebase_config import initialize_firebase
from datetime import datetime
import uuid

db, _ = initialize_firebase()
comment_routes = Blueprint('comment', __name__)

@comment_routes.route('/add_comment', methods=['POST'])
def add_comment():
    try:
        data = request.get_json()
        task_id = data.get('taskID')
        user_id = data.get('userID')
        message = data.get('message')

        if not task_id or not user_id or not message:
            return jsonify({'error': 'taskID, userID, and message are required'}), 400

        # ✅ Check if task exists
        task_doc = db.collection('Tasks').document(task_id).get()
        if not task_doc.exists:
            return jsonify({'error': 'Task does not exist'}), 404

        # ✅ Check if user exists
        user_doc = db.collection('User').document(user_id).get()
        if not user_doc.exists:
            return jsonify({'error': 'User does not exist'}), 404

        comment_id = str(uuid.uuid4())
        comment_data = {
            'commentID': comment_id,
            'taskID': task_id,
            'userID': user_id,
            'message': message,
            'createdAt': datetime.utcnow().isoformat()
        }

        db.collection('Comments').document(comment_id).set(comment_data)

        return jsonify({'message': 'Comment added successfully', 'commentId': comment_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@comment_routes.route('/get_comments', methods=['GET'])
def get_comments():
    try:
        task_id = request.args.get('taskID')

        if not task_id:
            return jsonify({'error': 'taskID is required'}), 400

        # ✅ Check if task exists
        task_doc = db.collection('Tasks').document(task_id).get()
        if not task_doc.exists:
            return jsonify({'error': 'Task does not exist'}), 404

        # Proceed to query comments for this task
        comments_ref = db.collection('Comments') \
                         .where('taskID', '==', task_id) \
                         .order_by('createdAt')
        comment_docs = comments_ref.stream()

        comments = []
        for doc in comment_docs:
            comment = doc.to_dict()

            # Attach user info
            user_id = comment.get('userID')
            if user_id:
                user_doc = db.collection('User').document(user_id).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    comment['username'] = user_data.get('name', '')
                    comment['avatar'] = user_data.get('avatar', '')
                else:
                    comment['username'] = 'Unknown User'
                    comment['avatar'] = ''
            else:
                comment['username'] = 'Anonymous'
                comment['avatar'] = ''

            comments.append(comment)

        return jsonify({'comments': comments}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
