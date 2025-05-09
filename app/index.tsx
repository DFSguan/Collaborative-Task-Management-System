import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import AddProjectScreen from './screens/AddProjectScreen';
import AddTaskScreen from './screens/Task/AddTaskScreen'
import TaskDetailScreen from './screens/Task/TaskDetailScreen';
import TaskListScreen from './screens/Task/TaskListScreen';
import { UserProvider, useUser } from './context/UserContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  if (loading) return null; // Optional: show splash screen or loader

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // If logged in, go to BottomTabNavigator
        <>
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="AddProject" component={AddProjectScreen} />
          <Stack.Screen name="TaskList" component={TaskListScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
        </>
      ) : (
        // If not logged in, show Welcome, Login, SignUp
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
};

export default App;
