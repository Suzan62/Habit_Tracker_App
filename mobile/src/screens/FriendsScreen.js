import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { friendsAPI } from '../services/socialApi';
import { useAuth } from '../context/AuthContext';

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching friends data...');
      
      const [friendsRes, requestsRes] = await Promise.all([
        friendsAPI.getFriends(),
        friendsAPI.getFriendRequests(),
      ]);
      
      console.log('Friends response:', friendsRes);
      console.log('Requests response:', requestsRes);
      
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
      
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      
      let errorMessage = 'Failed to load friends and requests.';
      if (error.response) {
        errorMessage += ` Status: ${error.response.status}`;
        if (error.response.data) {
          errorMessage += ` - ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        errorMessage += ' No response from server.';
      } else {
        errorMessage += ` ${error.message}`;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        setLoading(true);
        const response = await friendsAPI.searchUsers(text);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
        Alert.alert('Error', 'Failed to search for users.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendRequest = async (addresseeId) => {
    try {
      await friendsAPI.sendFriendRequest(addresseeId);
      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request.');
    }
  };

  const handleRespondRequest = async (id, status) => {
    try {
      await friendsAPI.respondToFriendRequest(id, status);
      Alert.alert('Success', `Friend request ${status.toLowerCase()}ed!`);
      fetchData();
    } catch (error) {
      console.error('Error responding to friend request:', error);
      Alert.alert('Error', 'Failed to respond to friend request.');
    }
  };

  const renderFriendItem = ({ item }) => {
    const friend = item.requesterId === user.id ? item.addressee : item.requester;
    return (
      <View style={styles.listItem}>
        <Text>{friend?.username || 'Unknown'}</Text>
      </View>
    );
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.requester?.username || 'Unknown'}</Text>
      <View style={styles.requestButtons}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleRespondRequest(item.id, 'Accepted')}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={() => handleRespondRequest(item.id, 'Declined')}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.username}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => handleSendRequest(item.id)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search for friends..."
            value={query}
            onChangeText={handleSearch}
        />
        {loading && <ActivityIndicator size="large" color="#2196F3" />}
        <FlatList
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={() => (
                <>
                    <Text style={styles.header}>Friend Requests</Text>
                    <FlatList
                        data={requests}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text style={styles.header}>Friends</Text>
                </>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  requestButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
    declineButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default FriendsScreen;

