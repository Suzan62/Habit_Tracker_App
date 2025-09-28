import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { habitAPI } from '../services/api';
import HabitCard from '../components/HabitCard';

const HabitsListScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', 'Health', 'Fitness', 'Learning', 'Work', 'Personal', 'Social', 'Creative', 'Financial', 'Other'];
  const statusOptions = ['All', 'Active', 'Inactive'];

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    filterHabits();
  }, [habits, searchQuery, selectedCategory, selectedStatus]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await habitAPI.getMyHabits();
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

  const filterHabits = () => {
    let filtered = [...habits];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(habit =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(habit => habit.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Active') {
        filtered = filtered.filter(habit => habit.isActive);
      } else if (selectedStatus === 'Inactive') {
        filtered = filtered.filter(habit => !habit.isActive);
      }
    }

    setFilteredHabits(filtered);
  };

  const handleHabitUpdated = () => {
    fetchHabits();
  };

  const handleHabitPress = (habit) => {
    navigation.navigate('HabitDetails', { habitId: habit.id });
  };

  const getStatsText = () => {
    const total = filteredHabits.length;
    const active = filteredHabits.filter(h => h.isActive).length;
    return `${total} habit${total !== 1 ? 's' : ''} (${active} active)`;
  };

  const renderHabit = ({ item }) => (
    <HabitCard
      habit={item}
      onHabitUpdated={handleHabitUpdated}
      onPress={() => handleHabitPress(item)}
      navigation={navigation}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' 
          ? 'No matching habits'
          : 'No habits yet!'
        }
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' 
          ? 'Try adjusting your search or filters'
          : 'Create your first habit to start building better routines.'
        }
      </Text>
      {(!searchQuery && selectedCategory === 'All' && selectedStatus === 'All') && (
        <TouchableOpacity
          style={styles.createFirstButton}
          onPress={() => navigation.navigate('AddHabit')}
        >
          <Text style={styles.createFirstButtonText}>Create Your First Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterChips = () => (
    <View style={styles.filtersContainer}>
      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Category:</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.filterChipSelected
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.filterChipText,
                selectedCategory === item && styles.filterChipTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Status Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.statusFilterContainer}>
          {statusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipSelected
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                selectedStatus === status && styles.filterChipTextSelected
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filters */}
      {renderFilterChips()}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{getStatsText()}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHabit')}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Habits List */}
      <FlatList
        data={filteredHabits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
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
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterList: {
    paddingRight: 15,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  createFirstButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HabitsListScreen;
