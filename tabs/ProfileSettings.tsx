import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';

const ProfileSettingstab = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔐 <Text style={styles.authBold}>Authentication</Text></Text>

      <Text style={[styles.status, isLoggedIn ? styles.loggedIn : styles.loggedOut]}>
        Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}
      </Text>

      <Text style={styles.message}>
        {isLoggedIn
          ? 'You are currently logged in. Tap the button below to logout.'
          : 'You are currently logged out. Tap the button below to login.'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={toggleLogin}>
        <Text style={styles.buttonText}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSettingstab;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20, paddingTop: 50  
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
  },
  authBold: {
    fontWeight: 'bold',
    color: '#6200ee'
  },
  status: {
    fontSize: 20,
    marginBottom: 10
  },
  loggedIn: {
    color: 'green'
  },
  loggedOut: {
    color: 'red'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#444'
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
