import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitsListScreen from './src/screens/HabitsListScreen';
import HabitDetailsScreen from './src/screens/HabitDetailsScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SplashScreen from './src/screens/SplashScreen';
import InitialSplashScreen from './src/screens/InitialSplashScreen';
import IntroductionScreen from './src/screens/IntroductionScreen';
import AboutScreen from './src/screens/AboutScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';


const Stack = createStackNavigator();




function SplashStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#c4ddf1ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Habit Tracker' }}
      />
      <Stack.Screen 
        name="Habits" 
        component={HabitsListScreen}
        options={{ title: 'My Habits' }}
      />
      <Stack.Screen 
        name="AddHabit" 
        component={AddHabitScreen}
        options={{ title: 'Add New Habit' }}
      />
      <Stack.Screen 
        name="HabitDetails" 
        component={HabitDetailsScreen}
        options={{ title: 'Habit Details' }}
      />
      <Stack.Screen 
        name="Reminders" 
        component={RemindersScreen}
        options={{ title: 'Reminders' }}
      />
      <Stack.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const { 
    initialSplashCompleted, 
    introductionCompleted, 
    completeInitialSplash, 
    completeIntroduction 
  } = useApp();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show initial splash screen (5-6 seconds with logo)
  if (!initialSplashCompleted) {
    return (
      <InitialSplashScreen onComplete={completeInitialSplash} />
    );
  }

  // Show introduction screen with swipe functionality
  if (!introductionCompleted) {
    return (
      <IntroductionScreen onComplete={completeIntroduction} />
    );
  }

  return isAuthenticated ? <MainStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
