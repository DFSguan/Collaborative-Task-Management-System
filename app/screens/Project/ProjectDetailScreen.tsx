import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { RootStackParamList, Project, Task } from '../../helper/types'; // adjust path if needed
import { getProjectByProjectID, getTasksByProjectIDAndAssignee } from '../../api/api'; // adjust path if needed
import { Ionicons } from '@expo/vector-icons';

// 👇 Proper type for route
type ProjectDetailRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

const ProjectDetailScreen: React.FC = () => {
  const route = useRoute<ProjectDetailRouteProp>();
  const { projectId } = route.params;
  const { user } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNameFor, setShowNameFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError(null);

        const projectRes = await getProjectByProjectID(projectId);
        if (projectRes && projectRes.project) {
          const mergedProject = {
            ...projectRes.project,
            memberProfiles: projectRes.memberProfiles || [],
          };
          setProject(mergedProject);
        } else {
          setError('Unexpected project response format');
        }

        // 👇 Fetch tasks related to this project
        if (user?.userID) {
          const taskRes = await getTasksByProjectIDAndAssignee(projectId, user?.userID);
          if (Array.isArray(taskRes.tasks)) {
            setTasks(taskRes.tasks);
          } else {
            console.warn('Expected taskRes to be an array, but got:', taskRes);
            setTasks([]); // fallback to empty array
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!projects) {
    return (
      <View style={styles.centered}>
        <Text>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{projects.title}</Text>
      <Text style={styles.subtext}>{projects.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.deadline}>
          📅 Deadline: {projects.deadline ? new Date(projects.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
        </Text>
        <Text style={styles.progressCircle}>60%</Text>
      </View>

      {/* 👇 Member avatars section */}
      <Text style={styles.sectionHeader}>Members</Text>
      <View style={styles.avatarContainer}>
        {projects.memberProfiles?.slice(0, 3).map((member) => (
          <View key={member.userID} style={styles.avatarWrapper}>
            {showNameFor === member.userID && (
              <Text style={styles.avatarName}>{member.name}</Text>
            )}
            <TouchableOpacity
              onPressIn={() => setShowNameFor(member.userID)}
              onPressOut={() => setShowNameFor(null)}
            >
              <Image
                source={{ uri: member.avatar }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Member Button */}
        <TouchableOpacity style={styles.fab} onPress={() => console.log('Add Member')}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
        
      <Text style={styles.sectionHeader}>My Tasks</Text>
      {Array.isArray(tasks) && tasks.length > 0 ? (
        tasks.map(task => (
          <View key={task.taskID} style={styles.taskCard}>
             {/* Avatar */}
            <View style={styles.TaskAvatarWrapper}>
              <Image
                source={{ uri: task.assignedAvatar }}
                style={styles.TaskAvatarImage}
              />
            </View>

            {/* Task content */}
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.assignee}>Assignee: {task.assignedUsername}</Text>
            </View>

            {/* Due date */}
            <Text style={styles.dueDate}>
              Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#888' }}>No tasks assigned to you.</Text>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.buttonText}>View more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  deadline: {
    fontSize: 14,
    color: '#888',
  },
  progressCircle: {
    backgroundColor: '#6200ee',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    flexDirection: 'row', // Makes the container horizontal
    position: 'relative', // Allows absolute positioning of due date
  },
  TaskAvatarWrapper: {
    marginRight: 15, // Space between avatar and task content
  },
  TaskAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  taskContent: {
    flex: 1, // Take the remaining space for task content
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  assignee: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dueDate: {
    position: 'absolute',
    top: 10, // Position from top of the task card
    right: 15, // Position from right edge
    fontSize: 12,
    color: '#888',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  avatarName: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#6200ee',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    zIndex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#6200ee',
    borderRadius: 28,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
   buttonGroup: {
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',
  },
  viewButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProjectDetailScreen;
