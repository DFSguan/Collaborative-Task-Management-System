import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const SignUpScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>
        Login Account <Text style={styles.wave}>👋</Text>
      </Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Username"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="●●●●●●●●●●"
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forget Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
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
        Don’t have an account? <Text style={styles.registerLink}>Register</Text>
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