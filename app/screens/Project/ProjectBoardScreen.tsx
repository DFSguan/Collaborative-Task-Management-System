import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import KanbanBoard from '../Component/KanbanBoard';

type Status = 'On going' | 'In Progress' | 'Done';

type TaskData = {
  [key in Status]: string[];
};

const ProfileBoardScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskData>({
    'On going': ['Task Customization', 'Deadline Management', 'Networking Assistance', 'Data Security Assurance'],
    'In Progress': ['Application Tracking', 'Automated Job Alerts', 'Mobile Optimization'],
    Done: ['Continuous Feedback Loop'],
  });

  const addTask = () => {
    const newTask = `New Task ${tasks['On going'].length + 1}`;
    setTasks((prev) => ({
      ...prev,
      'On going': [...prev['On going'], newTask],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.projectTitle}>Website for Rune.io</Text>
        <View style={styles.iconRow}>
          <Ionicons name="notifications-outline" size={24} style={styles.icon} />
          <Feather name="settings" size={24} style={styles.icon} />
        </View>
      </View>

      {/* Avatar + Deadline Row */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarGroup}>
          {[1, 2, 3].map((i) => (
            <Image
              key={i}
              source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
              style={styles.avatar}
            />
          ))}
          <TouchableOpacity style={styles.addAvatar}>
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.deadline}>
          <Ionicons name="time-outline" size={18} color="#555" />
          <Text style={styles.deadlineText}>Aug 25, 2025</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#777" />
        <TextInput placeholder="Search cards..." style={styles.searchInput} />
      </View>

      {/* Kanban Board */}
      <KanbanBoard tasks={tasks} setTasks={setTasks} />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={addTask}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  projectTitle: { fontSize: 22, fontWeight: 'bold' },
  iconRow: { flexDirection: 'row' },
  icon: { marginLeft: 15 },

  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  addAvatar: {
    backgroundColor: '#ff5f03',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deadline: { flexDirection: 'row', alignItems: 'center' },
  deadlineText: { marginLeft: 6, color: '#555' },

  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    padding: 8,
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
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navAddButton: {
    backgroundColor: '#ff5f03',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileBoardScreen;
