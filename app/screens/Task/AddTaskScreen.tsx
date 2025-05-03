import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createTask, getUsers } from '../../api/api';  // Ensure getUsers is imported
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../helper/type';

type AddTaskRouteProp = RouteProp<RootStackParamList, 'AddTask'>;
type AddTaskNavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;

interface User {
  userID: string;
  username: string;
}

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<AddTaskNavigationProp>();
  const route = useRoute<AddTaskRouteProp>(); 
  const { projectID } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState<User[]>([]); // Explicitly define the type as User[]
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const user = users.find(user => user.username === assignedTo);  // Find the user by username
    if (!user) {
      Alert.alert('Error', 'Invalid username');
      return;
    }

    try {
      await createTask(projectID, title, description, dueDate, priority, user.userID);  // Pass userID to the backend
      Alert.alert('Success', 'Task added!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View style={styles.form}>
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
        placeholder="Search for user by Username"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={item => item.userID}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => setAssignedTo(item.username)} // Set selected username
        >
          <Text>{item.username}</Text>
        </TouchableOpacity>
      )}
      ListHeaderComponent={renderHeader}  // Add form as the header
      ListFooterComponent={
        <Button title="Create Task" onPress={handleSubmit} />
      }
    />
  );
};

const styles = StyleSheet.create({
  form: {
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
  userItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default AddTaskScreen;