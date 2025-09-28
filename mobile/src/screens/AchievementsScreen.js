import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { achievementsAPI } from '../services/socialApi';

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsRes, userAchievementsRes] = await Promise.all([
          achievementsAPI.getAchievements(),
          achievementsAPI.getUserAchievements(),
        ]);
        setAchievements(achievementsRes.data);
        setUserAchievements(userAchievementsRes.data.map(ua => ua.achievementId));
      } catch (error) {
        console.error('Error fetching achievements:', error);
        Alert.alert('Error', 'Failed to load achievements.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAchievementItem = ({ item }) => {
    const isEarned = userAchievements.includes(item.id);
    return (
      <View style={[styles.achievementItem, isEarned && styles.earned]}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementBadge}>{item.badgeIcon || '🏆'}</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementName}>{item.name}</Text>
            <Text style={styles.achievementType}>{item.type}</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>{item.pointsReward} pts</Text>
          </View>
        </View>
        
        <Text style={styles.achievementDescription}>{item.description}</Text>
        
        <View style={styles.requirementContainer}>
          <Text style={styles.requirement}>
            Required: {item.requiredValue} {item.category ? `in ${item.category}` : ''}
          </Text>
          {isEarned && <Text style={styles.earnedText}>✅ Achieved!</Text>}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerSubtitle}>
          {userAchievements.length} of {achievements.length} unlocked
        </Text>
      </View>
      
      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
  },
  achievementItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  earned: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementBadge: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  pointsContainer: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  points: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  requirementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requirement: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  earnedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AchievementsScreen;

