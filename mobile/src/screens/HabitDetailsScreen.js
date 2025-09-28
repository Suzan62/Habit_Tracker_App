import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { habitAPI } from '../services/api';

const HabitDetailsScreen = ({ route, navigation }) => {
  const { habitId } = route.params;
  const [habit, setHabit] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // week, month, quarter, year

  useEffect(() => {
    fetchHabitDetails();
  }, [habitId]);

  useEffect(() => {
    if (habit) {
      fetchAnalytics();
    }
  }, [habit, dateRange]);

  const fetchHabitDetails = async () => {
    try {
      const response = await habitAPI.getHabit(habitId);
      setHabit(response.data);
      
      // Set the navigation title
      navigation.setOptions({
        title: response.data.name || 'Habit Details'
      });
    } catch (error) {
      console.error('Error fetching habit:', error);
      Alert.alert('Error', 'Failed to load habit details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { startDate, endDate } = getDateRange(dateRange);
      const response = await habitAPI.getHabitAnalytics(habitId, startDate, endDate);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getDateRange = (range) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const handleQuickAction = async (action, data = {}) => {
    try {
      setActionLoading(true);
      
      if (action === 'complete') {
        await habitAPI.completeHabit(habitId, data);
        Alert.alert('Success', 'Habit marked as completed!');
      } else if (action === 'skip') {
        await habitAPI.skipHabit(habitId, data);
        Alert.alert('Success', 'Habit marked as skipped!');
      }
      
      // Refresh both habit and analytics
      await fetchHabitDetails();
      await fetchAnalytics();
    } catch (error) {
      console.error(`Error ${action}ing habit:`, error);
      Alert.alert('Error', `Failed to ${action} habit. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This action cannot be undone and will delete all associated data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      await habitAPI.deleteHabit(habitId);
      Alert.alert(
        'Success',
        'Habit deleted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error deleting habit:', error);
      Alert.alert('Error', 'Failed to delete habit. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
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

  const renderDateRangeSelector = () => {
    const ranges = [
      { key: 'week', label: 'Week' },
      { key: 'month', label: 'Month' },
      { key: 'quarter', label: '3 Months' },
      { key: 'year', label: 'Year' }
    ];

    return (
      <View style={styles.dateRangeSelector}>
        {ranges.map(range => (
          <TouchableOpacity
            key={range.key}
            style={[
              styles.dateRangeButton,
              dateRange === range.key && styles.dateRangeButtonSelected
            ]}
            onPress={() => setDateRange(range.key)}
          >
            <Text style={[
              styles.dateRangeButtonText,
              dateRange === range.key && styles.dateRangeButtonTextSelected
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading habit details...</Text>
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Habit not found</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Habit Header */}
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View 
            style={[styles.categoryBadge, { backgroundColor: getCategoryColor(habit.category) }]}
          >
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
        </View>
        <Text style={styles.habitName}>{habit.name}</Text>
        {habit.description && (
          <Text style={styles.habitDescription}>{habit.description}</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleQuickAction('complete')}
            disabled={actionLoading}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading ? '...' : '✓ Mark Complete'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => handleQuickAction('skip')}
            disabled={actionLoading}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading ? '...' : '⤫ Mark Skipped'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Habit Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habit Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Frequency</Text>
            <Text style={styles.infoValue}>{habit.type}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Target</Text>
            <Text style={styles.infoValue}>
              {habit.targetCount} {habit.unit || 'time(s)'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Points Reward</Text>
            <Text style={styles.infoValue}>{habit.pointsReward || 10}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Reminder Time</Text>
            <Text style={styles.infoValue}>{formatTime(habit.reminderTime)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[
              styles.infoValue,
              habit.isActive ? styles.activeStatus : styles.inactiveStatus
            ]}>
              {habit.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(habit.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Analytics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Analytics</Text>
        </View>
        
        {renderDateRangeSelector()}
        
        {analytics ? (
          <>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsValue}>{analytics.currentStreak}</Text>
                <Text style={styles.analyticsLabel}>Current Streak</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsValue}>{analytics.completedDays}</Text>
                <Text style={styles.analyticsLabel}>Completed Days</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsValue}>{analytics.skippedDays}</Text>
                <Text style={styles.analyticsLabel}>Skipped Days</Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsValue}>{analytics.completionRate}%</Text>
                <Text style={styles.analyticsLabel}>Completion Rate</Text>
              </View>
            </View>

            {/* Recent Activity */}
            {analytics.logs && analytics.logs.length > 0 && (
              <View style={styles.activitySection}>
                <Text style={styles.activityTitle}>Recent Activity</Text>
                <View style={styles.activityList}>
                  {analytics.logs.slice(-5).reverse().map((log, index) => (
                    <View
                      key={index}
                      style={[
                        styles.activityItem,
                        log.status === 'Completed' ? styles.completedActivity : styles.skippedActivity
                      ]}
                    >
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityDate}>
                          {new Date(log.logDate).toLocaleDateString()}
                        </Text>
                        <Text style={[
                          styles.activityStatus,
                          log.status === 'Completed' ? styles.completedStatus : styles.skippedStatus
                        ]}>
                          {log.status === 'Completed' ? '✓' : '⤫'} {log.status}
                        </Text>
                      </View>
                      {log.notes && (
                        <Text style={styles.activityNotes}>"{log.notes}"</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.analyticsLoading}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.analyticsLoadingText}>Loading analytics...</Text>
          </View>
        )}
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerDescription}>
          Deleting a habit will permanently remove all associated data including logs and analytics.
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={actionLoading}
        >
          <Text style={styles.deleteButtonText}>
            {actionLoading ? 'Deleting...' : '🗑️ Delete Habit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeStatus: {
    color: '#4CAF50',
  },
  inactiveStatus: {
    color: '#f44336',
  },
  dateRangeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  dateRangeButtonSelected: {
    backgroundColor: '#2196F3',
  },
  dateRangeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dateRangeButtonTextSelected: {
    color: '#fff',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  analyticsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  analyticsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  analyticsLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  activitySection: {
    marginTop: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    borderLeftWidth: 3,
  },
  completedActivity: {
    borderLeftColor: '#4CAF50',
  },
  skippedActivity: {
    borderLeftColor: '#FF9800',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedStatus: {
    color: '#4CAF50',
  },
  skippedStatus: {
    color: '#FF9800',
  },
  activityNotes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  dangerSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HabitDetailsScreen;
