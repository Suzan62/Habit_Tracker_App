# 🤝 Friendship System Workflow

## How Friends Feature Works

### 1. **User Discovery**
```
User opens Friends Screen → Search for users by username/name → Results displayed
```

### 2. **Send Friend Request**
```
User A searches for User B → Clicks "Add Friend" → Request sent → Status: "Pending"
```

### 3. **Friend Request Management**
```
User B opens Friends Screen → Sees pending requests → Can Accept/Decline/Block
```

### 4. **Friend Request Responses**

#### ✅ **Accept**
```
User B clicks "Accept" → Status changes to "Accepted" → Both users are now friends
```

#### ❌ **Decline** 
```
User B clicks "Decline" → Status changes to "Declined" → Request removed
```

#### 🚫 **Block**
```
User B clicks "Block" → Status changes to "Blocked" → User A cannot send more requests
```

### 5. **Friends List**
```
Accepted friends appear in both users' friend lists → Can view each other's profiles
```

## Database Schema

### Friendship Table Structure:
- **Id**: Unique identifier
- **RequesterId**: User who sent the request
- **AddresseeId**: User who received the request  
- **Status**: Pending/Accepted/Declined/Blocked
- **RequestedAt**: When request was sent
- **RespondedAt**: When request was responded to

## API Endpoints

### Search Users
- **GET** `/api/users/search?query={username}`
- Returns: List of users matching search criteria

### Send Friend Request
- **POST** `/api/friends/send-request`
- Body: `{ "addresseeId": 123 }`

### Get Friend Requests (Incoming)
- **GET** `/api/friends/requests`
- Returns: Pending requests sent to current user

### Respond to Friend Request
- **PUT** `/api/friends/requests/{id}`
- Body: `{ "status": "Accepted" }` (or "Declined", "Blocked")

### Get Friends List
- **GET** `/api/friends`
- Returns: All accepted friendships for current user

## Business Rules

1. **No Self-Friendship**: Users cannot send friend requests to themselves
2. **One Request Per Pair**: Only one friendship record exists between any two users
3. **Bidirectional View**: Once accepted, both users see each other as friends
4. **Block Prevention**: Blocked users cannot send new requests
5. **Mutual Visibility**: Friends can see each other in their respective friend lists
