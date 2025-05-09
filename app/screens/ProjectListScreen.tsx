import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../helper/type';
import { Project } from '../helper/type';
import { getProjects } from '../api/api';
import { useUser } from '../context/UserContext';

type ProjectListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProjectList'>;

const ProjectListScreen = () => {
  const navigation = useNavigation<ProjectListScreenNavigationProp>();
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user?.userID) {
          const data = await getProjects(user.userID);
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const goToCreateProject = () => {
    navigation.navigate('AddProject'); 
  };

  const handleProjectPress = (project: Project) => {
      navigation.navigate('TaskList', {
        projectId: project.projectID,
        projectTitle: project.title,
      });
    };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProjectPress(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.deadline}>Due: {item.dueDate ?? 'N/A'}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.statusTag}>Ongoing</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>My Project</Text>
        <View style={styles.iconGroup}>
          <Ionicons name="search" size={24} style={styles.icon} />
          <MaterialIcons name="filter-list" size={24} style={styles.icon} />
        </View>
      </View>

      {/* Project List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.projectID}
        renderItem={renderProjectCard}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={goToCreateProject}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ProjectListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  appName: { fontSize: 20, fontWeight: 'bold' },
  iconGroup: { flexDirection: 'row' },
  icon: { marginLeft: 16 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  deadline: { fontSize: 12, color: '#888' },
  description: { fontSize: 14, color: '#666', marginTop: 4 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  avatarSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  taskCount: { fontSize: 12 },
  statusTag: {
    backgroundColor: '#E0F7FA',
    color: '#00796B',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 70,
    backgroundColor: '#ff5f03',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
