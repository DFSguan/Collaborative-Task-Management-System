// MainScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity, Image, Alert} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { getProjects, getUsers } from '../api/api';
import { RootStackParamList, Project, User } from '../helper/type';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user?.userID) return;

    try {
      setError(null);
      const response = await getProjects(user.userID);

      if (Array.isArray(response)) {
        setProjects(response);
      } else if (response.projects && Array.isArray(response.projects)) {
        setProjects(response.projects);
      } else {
        setError('Unexpected response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();  // Fetch all users
        setUsers(data.users);  // Save to state
  
        const currentUser = data.users.find((u: User) => u.userID === user?.userID);
        if (currentUser?.avatar) {
          setAvatarUrl(currentUser.avatar);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        Alert.alert('Error', 'Failed to fetch users');
      }
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects().finally(() => setRefreshing(false));
  }, []);

  const handleProjectPress = (project: Project) => {
    navigation.navigate('TaskList', {
      projectId: project.projectID,
      projectTitle: project.title,
    });
  };

  const renderStatusCards = () => (
    <View style={styles.statusContainer}>
        <View style={styles.cardRow}>
          <View style={[styles.statusCard, styles.statusCardBlue]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#336699' }]}>
                <Ionicons name="refresh" size={26} color="#fff" />
              </View>
              <View>
                <Text style={styles.statusText}>Ongoing</Text>
                <Text style={styles.statusCount}>24 Tasks</Text>
              </View>
            </View>
          </View>

          <View style={[styles.statusCard, styles.statusCardYellow]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#b88215' }]}>
                <Ionicons name="time-outline" size={30} color="#fff"/>
              </View>
              <View>
                <Text style={styles.statusText}>In Process</Text>
                <Text style={styles.statusCount}>12 Tasks</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={[styles.statusCard, styles.statusCardGreen]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#0f7e74' }]}>
                <Ionicons name="document-text-outline" size={32} color="#fff"/>
              </View>
              <View>
                <Text style={styles.statusText}>Completed</Text>
                <Text style={styles.statusCount}>42 Tasks</Text>
              </View>
            </View>   
          </View>

          <View style={[styles.statusCard, styles.statusCardRed]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#aa3e24' }]}>
                <Ionicons name="close-circle-outline" size={32} color="#fff"/>
              </View>  
              <View>
                <Text style={styles.statusText}>Canceled</Text>
                <Text style={styles.statusCount}>8 Tasks</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  );

  return (
    <View style={styles.container}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hi, {user?.name} 👋</Text>
          <Text style={styles.subText}>Your daily adventure starts now</Text>
        </View>
        <Image
          source={{ uri: avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=student' }}
          style={styles.avatar}
        />
      </View>

      {/* Task Status Cards */}
      {renderStatusCards()}

      <Text style={styles.sectionTitle}>Recent Projects</Text>

      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.projectID}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.projectItem}
              onPress={() => handleProjectPress(item)}
            >
              <Text style={styles.projectTitle}>{item.title}</Text>
              <Text style={styles.projectDesc}>{item.description}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No projects found. Tap '+' to create one!</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcome: { fontSize: 20, fontWeight: 'bold' },
  subText: { color: 'gray' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderColor: '#d9d9d9', borderWidth: 1 },

  statusContainer: {
    paddingHorizontal: 0,
    marginTop: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 15,
    gap: 15,
  },

  statusCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderColor: '#d9d9d9',
    borderWidth: 1,
  },
  
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusCount: {
    marginTop: 4,
    fontSize: 11,
    color: '#404040',
  },
  statusCardBlue: {
    backgroundColor: '#5f9ede',
  },
  statusCardYellow: {
    backgroundColor: '#f6b63e',
  },
  statusCardGreen: {
    backgroundColor: '#1cc8b7',
  },
  statusCardRed: {
    backgroundColor: '#e7663b',
  },
  
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 12,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  projectItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 13,
    color: '#666',
  },
});

export default MainScreen;
