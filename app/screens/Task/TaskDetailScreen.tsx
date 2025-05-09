import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

import { RootStackParamList } from '../../helper/type';
import { updateTask, deleteTask, getUsers } from '../../api/api';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen: React.FC = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation<TaskDetailScreenNavigationProp>();
  const { taskID, title, description, priority, dueDate, assignedTo, status } = route.params;

  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedPriority, setEditedPriority] = useState(priority);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedAssignedTo, setEditedAssignedTo] = useState(assignedTo || 'Unassigned');

  const [users, setUsers] = useState<{ username: string, userID: string }[]>([]);

  // Fetch users when screen loads
  useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await getUsers();  // Fetch users from the backend
          setUsers(data.users);  // data is now typed as User[]
        } catch (err) {
          console.error('Failed to fetch users:', err);
          Alert.alert('Error', 'Failed to fetch users');
        }
      };
      fetchUsers();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateTask(taskID, editedTitle, editedDescription, editedStatus, dueDate, editedPriority, editedAssignedTo);
      Alert.alert('Task updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error updating task');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskID);
      Alert.alert('Task deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error deleting task');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={editedTitle}
        onChangeText={setEditedTitle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={editedDescription}
        onChangeText={setEditedDescription}
      />

      <Text style={styles.label}>Priority:</Text>
      <TextInput
        style={styles.input}
        value={editedPriority}
        onChangeText={setEditedPriority}
      />

      <Text style={styles.label}>Status:</Text>
      <TextInput
        style={styles.input}
        value={editedStatus}
        onChangeText={setEditedStatus}
      />

      <Text style={styles.label}>Assigned To:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={editedAssignedTo}
          onValueChange={(itemValue) => setEditedAssignedTo(itemValue)}
        >
          <Picker.Item label="Unassigned" value="Unassigned" />
          {users.map((user) => (
            <Picker.Item 
              key={user.userID} 
              label={user.username} 
              value={user.username} 
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Update Task" onPress={handleUpdate} />
        <Button title="Delete Task" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
});

export default TaskDetailScreen;
