import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

   // This is where you configure your Google client IDs.
   const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '923823247015-da2o4a4ck1v0tk6ai5npss7ivfdqihs7.apps.googleusercontent.com', 
  
   });

 useEffect(() => {
 // This effect handles the response from Google's auth flow
  if (response?.type === 'success') {
   const { authentication } = response;
  handleGoogleLogin(authentication.accessToken);
  }
 }, [response]);

 useEffect(() => {
 oadUser();
 }, []);
 const loadUser = async () => {
 try {
  const userString = await AsyncStorage.getItem('user');
  if (userString) {
   setUser(JSON.parse(userString));
  }
 } catch (error) {
   console.error('Failed to load user from storage', error);
 } finally {
  setLoading(false);
 }
};

 const handleGoogleLogin = async (accessToken) => {
  try {
   setLoading(true);
   // Send the access token to your backend's Google login endpoint
   const response = await authAPI.googleLogin({ accessToken });
   const { user: userData, token } = response.data;

   // Store the JWT token and user data from your backend
   await AsyncStorage.setItem('authToken', token);
   await AsyncStorage.setItem('user', JSON.stringify(userData));
   setUser(userData);
  
  } catch (error) {
   console.error('Google login failed:', error);
   Alert.alert('Error', 'Google login failed. Please try again.');
  } finally {
   setLoading(false);
  }
 };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token } = response.data;
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Register push token after successful login
      await registerForPushNotificationsAsync(userData.id);

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };
  
  const registerForPushNotificationsAsync = async (userId) => {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
        
        // Send the token to your new backend endpoint
        if (token) {
           await habitAPI.registerPushToken(token);
        }
      } else {
        alert('Must use a physical device for Push Notifications');
      }
      return token;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);