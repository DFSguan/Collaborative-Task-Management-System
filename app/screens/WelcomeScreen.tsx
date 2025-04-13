import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
};

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/app-logo.png')} // your image path
      style={styles.background}
      imageStyle={{ opacity: 0.25 }}
    >
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome to CollabTask</Text>
        <Text style={styles.subtitle}>
          Your Smart Way to Manage Assignments, Projects & Group Work
        </Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end', // move content to the bottom
    alignItems: 'center',
  },
  bottomContainer: {
    width: '90%',
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    alignItems: 'center',
    elevation: 30,
    marginHorizontal: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonPrimary: {
    backgroundColor: '#4F86F7',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: '#A0BFFF',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});