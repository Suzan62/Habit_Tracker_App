import api from './api';

export const friendsAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  sendFriendRequest: (addresseeId) => api.post('/friends/send-request', { addresseeId }),
  getFriendRequests: () => api.get('/friends/requests'),
  respondToFriendRequest: (id, status) => api.put(`/friends/requests/${id}`, { status }),
  getFriends: () => api.get('/friends'),
};

export const achievementsAPI = {
  getAchievements: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/my-achievements'),
};

