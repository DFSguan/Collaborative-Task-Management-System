import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createProject } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

type ProjectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Project'>;

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Project: undefined;
};

const ProjectScreen: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { user, setUser } = useUser();
  
    const handleCreateProject = async () => {
      try {
        if (!title || !description) {
          Alert.alert('Validation Error', 'Please fill in all required fields.');
          return;
        }
    
        await createProject(title, description, user?.userID || '', user?.userID || ''); // use context user ID
    
        Alert.alert('Success', 'Project created successfully!');
        setTitle('');
        setDescription('');
      } catch (err: any) {
        Alert.alert('Project Creation Failed', err.message);
      }
    };

    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('user'); // remove from storage
        setUser(null); // clear from context
        navigation.replace('Welcome'); // replace current screen with Login
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

  const navigation = useNavigation<ProjectScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={handleLogout}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>
        Home Screen <Text style={styles.wave}>👋</Text>
      </Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter your Title"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter your Description"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleCreateProject}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Task <Text style={styles.registerLink} onPress={() => navigation.navigate('SignUp')}>Register</Text>
      </Text>
    </SafeAreaView>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#f7f7f7',
      justifyContent: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
    },
    backArrow: {
      fontSize: 24,
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    wave: {
      fontSize: 24,
    },
    label: {
      marginBottom: 6,
      fontWeight: '600',
    },
    input: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    forgot: {
      alignSelf: 'flex-end',
      color: '#3b3b3b',
      textDecorationLine: 'underline',
      marginBottom: 20,
    },
    loginButton: {
      backgroundColor: '#f27059',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    orText: {
      textAlign: 'center',
      color: '#999',
      marginVertical: 20,
    },
    socialButton: {
      flexDirection: 'row',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    socialIcon: {
      marginRight: 10,
      fontSize: 16,
    },
    socialText: {
      fontWeight: '500',
    },
    registerText: {
      textAlign: 'center',
      marginTop: 30,
      color: '#666',
    },
    registerLink: {
      color: '#f27059',
      fontWeight: '600',
    },
  });