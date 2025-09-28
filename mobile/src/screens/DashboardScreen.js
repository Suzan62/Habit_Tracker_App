import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { habitAPI } from '../services/api';
import HabitCard from '../components/HabitCard';

const DashboardScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchHabits();
  }, []);

const fetchHabits = async () => {
    // This is the new, crucial check.
    if (!user || !user.id) {
      console.error('Error fetching habits: User ID is not available');
      setLoading(false);
      return;
    }

    try {
      // Pass the user's ID to the API call.
      // This is the line you need to fix.
      const response = await habitAPI.getMyHabits(user.id);
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  }, []);

  const handleHabitUpdated = () => {
    fetchHabits();
  };

  const getStats = () => {
    const activeHabits = habits.filter(h => h.isActive);
    const totalStreak = activeHabits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);
    const avgStreak = activeHabits.length > 0 ? Math.round(totalStreak / activeHabits.length) : 0;
    
    return {
      totalHabits: activeHabits.length,
      totalStreak,
      avgStreak,
      completedToday: activeHabits.filter(h => h.completedToday).length
    };
  };

  const stats = getStats();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName || user?.username || 'User'}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalHabits}</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completedToday}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalStreak}</Text>
          <Text style={styles.statLabel}>Total Streak Days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.avgStreak}</Text>
          <Text style={styles.statLabel}>Average Streak</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.viewAllButton]}
          onPress={() => navigation.navigate('Habits')}
        >
          <Text style={styles.quickActionIcon}>📝</Text>
          <Text style={styles.quickActionText}>View All Habits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, styles.addHabitButton]}
           onPress={() => navigation.navigate('AddHabit')}
        >
          <Text style={styles.quickActionIcon}>➕</Text>
          <Text style={styles.quickActionText}>Add Habit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, styles.remindersButton]}
          onPress={() => navigation.navigate('Reminders')}
        >
          <Text style={styles.quickActionIcon}>🔔</Text>
          <Text style={styles.quickActionText}>Reminders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, styles.friendsButton]}
          onPress={() => navigation.navigate('Friends')}
        >
          <Text style={styles.quickActionIcon}>👥</Text>
          <Text style={styles.quickActionText}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, styles.achievementsButton]}
          onPress={() => navigation.navigate('Achievements')}
        >
          <Text style={styles.quickActionIcon}>🏆</Text>
          <Text style={styles.quickActionText}>Achievements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionButton, styles.aboutButton]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.quickActionIcon}>ℹ️</Text>
          <Text style={styles.quickActionText}>About</Text>
        </TouchableOpacity>
      </View>

      {/* Habits Section */}
      <View style={styles.habitsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Habits</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Habits')}
          >
            <Text style={styles.addButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading habits...</Text>
          </View>
        ) : habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No habits yet!</Text>
            <Text style={styles.emptyText}>
              Create your first habit to start building better routines.
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => navigation.navigate('AddHabit')}
            >
              <Text style={styles.createFirstButtonText}>Create Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.habitsList}>
            {habits.slice(0, 3).map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onHabitUpdated={handleHabitUpdated}
                onPress={() => navigation.navigate('HabitDetails', { habitId: habit.id })}
                navigation={navigation}
              />
            ))}
            {habits.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreCard}
                onPress={() => navigation.navigate('Habits')}
              >
                <Text style={styles.viewMoreText}>View {habits.length - 3} more habits</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    minHeight: 80,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  habitsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  habitsList: {
    gap: 15,
    paddingBottom: 10,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
  },
  quickActionButton: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  viewAllButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  addHabitButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  remindersButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  friendsButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  achievementsButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  aboutButton: {
    borderLeftWidth: 3,
    borderLeftColor: '#34495e',
  },
  viewMoreCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default DashboardScreen;


