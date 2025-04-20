import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Project: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/app-logo.png')} // Replace with your image path
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlayBox}>
          <Text style={styles.title}>Organize Better, Collaborate Smarter</Text>
          <Text style={styles.subtitle}>
            CollabTask helps university students manage group assignments,
            track progress, and collaborate seamlessly.
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton} 
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.getStartedText}>Get started →</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 24,
    width: '90%',
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b3b3b',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#8A2BE2', // or #a355f2
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  getStartedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});