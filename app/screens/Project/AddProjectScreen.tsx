import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../../helper/type';
import { useUser } from '../../context/UserContext';
import { createProject, getUsers } from '../../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';

type AddProjectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProject'>;

const AddProjectScreen: React.FC = () => {
  const navigation = useNavigation<AddProjectScreenNavigationProp>();
  const { user } = useUser();

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [combinedDeadline, setCombinedDeadline] = useState<string | null>(null);

  // Date/time picker display
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Member search and selection states
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  // Create combined deadline using useEffect
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

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // Expect data to be an array of users; adjust as needed based on your API response
        setAllUsers(data.users || data);
        setFilteredUsers(data.users || data);
      } catch (error: any) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(allUsers);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allUsers.filter((u) =>
        u.username.toLowerCase().includes(lowerQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  // Function to add a member to selectedMembers
  const addMember = (member: User) => {
    // Prevent duplicates
    if (selectedMembers.find((m) => m.userID === member.userID)) return;
    setSelectedMembers([...selectedMembers, member]);
  };

  // Function to remove a selected member
  const removeMember = (memberID: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.userID !== memberID));
  };

  // Handle project creation
  const handleCreateProject = async () => {
    if (!title || !description) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (!combinedDeadline) {
      Alert.alert('Please select a deadline date and time');
      return;
    }

    // Convert selectedMembers to an array of user IDs.
    const memberIDs = selectedMembers.map((m) => m.userID);

    try {
      await createProject(title, description, user?.userID || '', memberIDs[0] || '', combinedDeadline);
      // Note: In your API, you currently send a single memberId.
      // You could modify it to accept multiple members if desired.
      Alert.alert('Success', 'Project created!');
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
        <Text style={styles.header}>New Project</Text>
        <TouchableOpacity onPress={handleCreateProject}>
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]} // No data items; we're just using ListHeaderComponent
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={
          <View style={styles.form}>
            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              placeholderTextColor="#999"
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#999"
              multiline
            />

            {/* Due Date and Time */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text style={{ color: dueDate ? '#000' : '#999' }}>
                    {dueDate ? dueDate.toDateString() : 'Select date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) setDueDate(selectedDate);
                    }}
                  />
                )}
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                  <Text style={{ color: dueTime ? '#000' : '#999' }}>
                    {dueTime
                      ? dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Select time'}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={dueTime || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(Platform.OS === 'ios');
                      if (selectedTime) setDueTime(selectedTime);
                    }}
                  />
                )}
              </View>
            </View>

            {/* Members */}
            <Text style={styles.label}>Members</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {selectedMembers.map((member) => (
                <View key={member.userID} style={styles.memberTag}>
                  <Text style={styles.memberName}>{member.username}</Text>
                  <TouchableOpacity onPress={() => removeMember(member.userID)}>
                    <Text style={styles.memberRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.memberSelect]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Type to search members..."
              placeholderTextColor="#999"
            />

            {searchQuery.length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.userID}
                style={{ maxHeight: 150, backgroundColor: '#fff', marginVertical: 8, borderRadius: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}
                    onPress={() => {
                      addMember(item);
                      setSearchQuery('');
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

export default AddProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  cancel: {
    color: '#0A84FF',
    fontSize: 16,
  },
  done: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  label: {
    color: '#000',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
  memberSelect: {
    marginTop: 8,
  },
  memberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 4,
  },
  memberName: {
    color: '#fff',
    marginRight: 5,
  },
  memberRemove: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
});
