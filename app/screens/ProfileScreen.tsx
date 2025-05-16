import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../helper/types';
import { useNavigation } from '@react-navigation/native';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const handleProjectPress = () => {
    navigation.navigate('Notification');
  };
  const handleProjectBoardPress = () => {
    navigation.navigate('ProjectBoard');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>9:41</Text>
        </View>

        {/* Avatar */}
        <Image
          source={{ uri: 'https://i.ibb.co/xmS5jfT/avatar.png' }}
          style={styles.avatar}
        />

        {/* Task Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>In Process tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Completed tasks</Text>
          </View>
        </View>

        {/* Name & Role */}
        <Text style={styles.name}>Bruce Wayne</Text>
        <Text style={styles.role}>Product Designer</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editProfileBtn}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Settings Options */}
        <TouchableOpacity style={styles.option} onPress = {(handleProjectPress)}>
          <Text style={styles.optionText}>🔔  Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress= {(handleProjectBoardPress)}>
          <Text style={styles.optionText}>🛡️  ProjectBoard</Text>
        </TouchableOpacity>
        <View style={styles.option}>
          <Text style={styles.optionText}>🌐  Language & Region</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
  },
  timeText: {
    fontSize: 14,
    color: '#888',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  role: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  editProfileBtn: {
    backgroundColor: '#FF6B57',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  editProfileText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  option: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
  },
});
