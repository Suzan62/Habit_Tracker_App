import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { habitAPI } from '../services/api';

const HabitCard = ({ habit, onHabitUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    try {
      setLoading(true);
      // Create a date-only string
      const today = new Date().toISOString().split('T')[0];
      
      await habitAPI.logHabit(habit.id, {
        logDate: today,
        status: 0, // 'Completed'
        completedCount: habit.targetCount,
        targetCount: habit.targetCount
      });
      
      onHabitUpdated();
    } catch (error) {
      console.error('Error marking habit complete:', error);
      Alert.alert('Error', 'Failed to mark habit as complete');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSkipped = async () => {
    try {
      setLoading(true);
      // Create a date-only string
      const today = new Date().toISOString().split('T')[0];
      
      await habitAPI.logHabit(habit.id, {
        logDate: today,
        status: 1, // 'Skipped'
        completedCount: 0,
        targetCount: habit.targetCount,
        notes: 'Marked as skipped'
      });
      
      onHabitUpdated();
    } catch (error) {
      console.error('Error marking habit skipped:', error);
      Alert.alert('Error', 'Failed to mark habit as skipped');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await habitAPI.deleteHabit(habit.id);
              onHabitUpdated();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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

  const getStreakColor = (streak) => {
    if (streak >= 30) return '#4CAF50'; // Green for 30+ days
    if (streak >= 7) return '#FF9800';  // Orange for 7+ days
    if (streak >= 3) return '#2196F3';  // Blue for 3+ days
    return '#9E9E9E'; // Gray for less than 3 days
  };

  const formatTargetText = () => {
    const target = habit.targetCount || 1;
    const unit = habit.unit || '';
    
    if (target === 1 && !unit) {
      return 'Complete once';
    }
    
    return `${target} ${unit}${target > 1 ? 's' : ''}`;
  };

  // Check if habit was completed today (placeholder - would be calculated from habit logs)
  const isCompletedToday = false;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.habitInfo}>
          <View 
            style={[styles.categoryBadge, { backgroundColor: getCategoryColor(habit.category) }]}
          >
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          {habit.description && (
            <Text style={styles.habitDescription}>{habit.description}</Text>
          )}
        </View>
        
        <View style={styles.streakContainer}>
          <Text 
            style={[styles.streakNumber, { color: getStreakColor(habit.currentStreak || 0) }]}
          >
            {habit.currentStreak || 0}
          </Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Target:</Text> {formatTargetText()}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Frequency:</Text> {habit.type}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Points:</Text> {habit.pointsReward || 10}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!isCompletedToday ? (
          <View style={styles.completionActions}>
            <TouchableOpacity
              style={[styles.completeButton, loading && styles.buttonDisabled]}
              onPress={handleMarkComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>✓ Complete</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.skipButton, loading && styles.buttonDisabled]}
              onPress={handleMarkSkipped}
              disabled={loading}
            >
              <Text style={styles.buttonText}>⤫ Skip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.completedStatus}>
            <Text style={styles.completedText}>✓ Completed Today!</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={loading}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
    color: '#999',
  },
  details: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionActions: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedStatus: {
    flex: 1,
    alignItems: 'center',
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
  },
});

export default HabitCard;
