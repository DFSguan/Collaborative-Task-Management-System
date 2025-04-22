import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../helper/type'; // adjust path as needed
import { createTask } from '../api/api';

type AddTaskRouteProp = RouteProp<RootStackParamList, 'AddTask'>;

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddTaskRouteProp>(); // ✅ type the route
  const { projectID } = route.params; // ✅ now no error

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
        await createTask(projectID, title, description, dueDate, priority, assignedTo);
    
        Alert.alert('Success', 'Task added!');
        navigation.goBack();
      } catch (err: any) {
        Alert.alert('Error', err.message);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Priority (Low, Medium, High)"
        value={priority}
        onChangeText={setPriority}
      />

      <TextInput
        style={styles.input}
        placeholder="Assigned To (UserID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
      />

      <Button title="Create Task" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default AddTaskScreen;
