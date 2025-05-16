import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '../../helper/types';
import { getUsers, createTask } from '../../api/api';
import DueDateTimePicker from '../Component/DueDateTimePicker';

type AddTaskRouteProp = RouteProp<RootStackParamList, 'AddTask'>;
type AddTaskNavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;

const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<AddTaskNavigationProp>();
  const route = useRoute<AddTaskRouteProp>();
  const { projectID } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [combinedDeadline, setCombinedDeadline] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setAllUsers(data.users);
        setFilteredUsers(data.users);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (dueDate && dueTime) {
      const combined = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        dueTime.getHours(),
        dueTime.getMinutes()
      ).toISOString();
      setCombinedDeadline(combined);
    }
  }, [dueDate, dueTime]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers([]);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredUsers(allUsers.filter((user) =>
        user.username.toLowerCase().includes(lowerQuery)
      ));
    }
  }, [searchQuery, allUsers]);

  const handleCreateTask = async () => {
    if (!title || !description || !combinedDeadline || !assignedUser) {
      Alert.alert('Missing Fields', 'Please complete all fields');
      return;
    }

    try {
      await createTask(
        projectID,
        title,
        description,
        combinedDeadline,
        priority,
        assignedUser.userID
      );
      Alert.alert('Success', 'Task added!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.header}>New Task</Text>
        <TouchableOpacity onPress={handleCreateTask}>
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#999"
              multiline
            />

            <DueDateTimePicker
              dueDate={dueDate}
              dueTime={dueTime}
              setDueDate={setDueDate}
              setDueTime={setDueTime}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {['Low', 'Medium', 'High'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.prioritySelected,
                  ]}
                  onPress={() => setPriority(level as any)}
                >
                  <Text
                    style={{
                      color: priority === level ? '#fff' : '#000',
                      fontWeight: '600',
                    }}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Assign To</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setAssignedUser(null);
              }}
              placeholder="Search by username"
              placeholderTextColor="#999"
            />

            {filteredUsers.length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.userID}
                style={{ maxHeight: 150, backgroundColor: '#fff', marginVertical: 8, borderRadius: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userItem}
                    onPress={() => {
                      setAssignedUser(item);
                      setSearchQuery(item.username);
                      setFilteredUsers([]);
                    }}
                  >
                    <Text>{item.username}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancel: {
    fontSize: 16,
    color: '#0A84FF',
  },
  header: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  done: {
    color: '#0A84FF',
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  label: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    color: '#000',
    borderWidth: 1,
    borderColor: '#808080',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
   priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#cccccc',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#999999',
    borderWidth: 1,
  },
  prioritySelected: {
    backgroundColor: '#ff5f03',
    borderColor: '#b34100',
    borderWidth: 1,
  },
  userItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});

export default AddTaskScreen;
