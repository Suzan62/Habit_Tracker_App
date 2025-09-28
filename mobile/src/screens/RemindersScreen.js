import {   View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Switch,
  Platform, } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as Notifications from 'expo-notifications'; // Import Notifications
import Constants from 'expo-constants'; // Import Constants
import { habitAPI } from '../services/api';

const RemindersScreen = ({ navigation }) => {
    // ... (state and functions)
    const { user } = useAuth(); // Make sure to get the user context

    // Add this function to handle token registration
    const registerForPushNotificationsAsync = async () => {
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
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        
        // Send the token to your new backend endpoint
        if (user && token) {
            await habitAPI.registerPushToken(token); // You will need to add this function to your api.js
        }
    };

    useEffect(() => {
        fetchHabits();
        registerForPushNotificationsAsync(); // Call this function on screen load
    }, [user]);

  const fetchHabits = async () => {
    // Check if the user object exists and has an id
    if (!user || !user.id) {
      console.error('Error fetching habits: User ID is not available');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await habitAPI.getMyHabits(user.id); // Pass the user ID here
      // Filter to only show active habits
      setHabits(response.data.filter(habit => habit.isActive));
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
  }, [user]); // Add user to the dependency array

  const updateHabitReminder = async (habitId, reminderTime) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const updatedHabit = {
        ...habit,
        reminderTime: reminderTime,
        updatedAt: new Date().toISOString()
      };

      await habitAPI.updateHabit(habitId, updatedHabit);
      
      // Update local state
      setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, reminderTime } : h
      ));

      Alert.alert('Success', 'Reminder updated successfully!');
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedTime && editingHabit) {
      const timeString = selectedTime.toTimeString().slice(0, 5); // HH:mm format
      updateHabitReminder(editingHabit.id, timeString);
      setEditingHabit(null);
    }
  };

  const startEditingTime = (habit) => {
    setEditingHabit(habit);
    
    // Set current time or default time
    let initialTime = new Date();
    if (habit.reminderTime) {
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      initialTime.setHours(hours, minutes, 0, 0);
    }
    
    setTempTime(initialTime);
    setShowTimePicker(true);
  };

  const removeReminder = (habit) => {
    Alert.alert(
      'Remove Reminder',
      `Remove reminder for "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => updateHabitReminder(habit.id, null) }
      ]
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Health: '#4CAF50',
      Fitness: '#FF9800',
      Learning: '#2196F3',
      Work: '#9C27B0',
      Personal: '#607D8B',
      Social: '#E91E63',
      Creative: '#FF5722',
      Financial: '#795548',
      Other: '#9E9E9E'
    };
    return colors[category] || colors.Other;
  };

  const getNextReminderText = (habit) => {
    if (!habit.reminderTime) return 'No reminder set';
    
    const now = new Date();
    const today = new Date();
    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    
    if (today <= now) {
      // Reminder time has passed today, show tomorrow
      today.setDate(today.getDate() + 1);
    }
    
    const timeString = formatTime(habit.reminderTime);
    
    if (habit.type === 'Weekly' && habit.daysOfWeek) {
      try {
        const days = JSON.parse(habit.daysOfWeek);
        const dayNames = {
          monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
          thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
        };
        const daysList = days.map(day => dayNames[day] || day).join(', ');
        return `${timeString} on ${daysList}`;
      } catch {
        return `${timeString} (weekly)`;
      }
    }
    
    const isToday = today.toDateString() === now.toDateString();
    const isTomorrow = today.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    } else {
      return `${today.toLocaleDateString()} at ${timeString}`;
    }
  };

  const renderHabitReminder = ({ item: habit }) => (
    <View style={styles.habitCard}>
      <View style={styles.habitHeader}>
        <View style={styles.habitInfo}>
          <View 
            style={[styles.categoryBadge, { backgroundColor: getCategoryColor(habit.category) }]}
          >
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
          <View style={styles.habitDetails}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.habitType}>{habit.type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.reminderSection}>
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderLabel}>Reminder</Text>
          <Text style={styles.reminderTime}>
            {getNextReminderText(habit)}
          </Text>
        </View>

        <View style={styles.reminderActions}>
          {habit.reminderTime ? (
            <>
              <TouchableOpacity
                style={styles.editTimeButton}
                onPress={() => startEditingTime(habit)}
              >
                <Text style={styles.editTimeButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeReminder(habit)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addReminderButton}
              onPress={() => startEditingTime(habit)}
            >
              <Text style={styles.addReminderButtonText}>+ Add Reminder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔔</Text>
      <Text style={styles.emptyTitle}>No Active Habits</Text>
      <Text style={styles.emptyText}>
        Create some habits first to set up reminders for them.
      </Text>
      <TouchableOpacity
        style={styles.createHabitButton}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={styles.createHabitButtonText}>Create Your First Habit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>
          Set reminder times for your active habits
        </Text>
      </View>

      {/* Reminders List */}
      <FlatList
        data={habits}
        renderItem={renderHabitReminder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📱 Reminder Tips</Text>
        <Text style={styles.infoText}>
          • Make sure to enable notifications in your device settings{'\n'}
          • Daily reminders will repeat every day at the set time{'\n'}
          • Weekly reminders will only show on selected days{'\n'}
          • You can edit or remove reminders anytime
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitHeader: {
    marginBottom: 15,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  habitType: {
    fontSize: 12,
    color: '#666',
  },
  reminderSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  reminderInfo: {
    marginBottom: 10,
  },
  reminderLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reminderTime: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addReminderButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
  },
  addReminderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editTimeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
  },
  editTimeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  createHabitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createHabitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default RemindersScreen;