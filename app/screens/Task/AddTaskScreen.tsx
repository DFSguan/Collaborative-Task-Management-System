import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createTask, getUsers } from '../../api/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '../../helper/type';

type AddTaskRouteProp = RouteProp<RootStackParamList, 'AddTask'>;
type AddTaskNavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<AddTaskNavigationProp>();
  const route = useRoute<AddTaskRouteProp>();
  const { projectID } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
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

    const user = users.find(user => user.username === assignedTo);
    if (!user) {
      Alert.alert('Error', 'Invalid username');
      return;
    }

    try {
      await createTask(projectID, title, description, dueDate, priority, user.userID);
      Alert.alert('Success', 'Task added!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
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
      </ScrollView>

      <FlatList
        style={{ flex: 1 }}
        data={filteredUsers}
        keyExtractor={item => item.userID}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.userItem,
              item.username === assignedTo && styles.selectedUserItem,
            ]}
            onPress={() => setAssignedTo(item.username)}
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={{ margin: 20 }}>
            <Button title="Create Task" onPress={handleSubmit} />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: '#fff',
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
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedUserItem: {
    backgroundColor: '#cdeffd',
  },
});

export default AddTaskScreen;
