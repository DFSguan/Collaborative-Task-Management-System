import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, Task } from '../../helper/type';
import { getTasks } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;
type TaskListScreenRouteProp = RouteProp<RootStackParamList, 'TaskList'>;

const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const route = useRoute<TaskListScreenRouteProp>();
  const { projectId, projectTitle } = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId);
        console.log('Fetched tasks:', data);

        if (data && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          console.warn('No tasks found or invalid format');
          setTasks([]);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      setLoading(true); // Optional: show loader again while refetching
      fetchTasks();
    }
  }, [isFocused, projectId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  const handleProjectPress = () => {
    navigation.navigate('AddTask', { projectID: projectId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tasks for: {projectTitle}</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.taskID}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.projectItem}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                taskID: item.taskID,
                title: item.title,
                description: item.description,
                priority: item.priority,
                dueDate: item.dueDate,
                assignedTo: item.assignedUsername,
                status: item.status,
              })
            }
          >
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Priority: {item.priority}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Deadline: {new Date(item.dueDate).toLocaleString()}</Text>
            <Text>Assign To: {item.assignedUsername}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={(handleProjectPress)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  projectItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskListScreen;
