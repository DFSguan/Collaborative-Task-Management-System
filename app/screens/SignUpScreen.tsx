import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://192.168.245.174:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
      } else {
        Alert.alert('Signup Failed', data.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
      console.error('Signup error:', error);
    }
  };
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>
        Create Account <Text style={styles.wave}>👋</Text>
      </Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your Username"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your Email"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="●●●●●●●●●●"
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forget Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
        <Text style={styles.loginButtonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>─────────  or  ─────────</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialIcon}>🔵</Text>
        <Text style={styles.socialText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialIcon}>⚫</Text>
        <Text style={styles.socialText}>Login with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Already have an account? <Text style={styles.registerLink} onPress={() => navigation.navigate('Login')}>Login</Text>
      </Text>
    </SafeAreaView>
  );
};

export default SignUpScreen;

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