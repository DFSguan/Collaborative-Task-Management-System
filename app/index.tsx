import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import Welcome from './screens/WelcomeScreen';
import Login from './screens/LoginScreen';
import SignUp from './screens/SignUpScreen';
import ProjectScreen from './screens/ProjectScreen';
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
        // If logged in, go to MainScreen
        <Stack.Screen name="Main" component={ProjectScreen} />
      ) : (
        // If not logged in, show Welcome, Login, SignUp
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
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
