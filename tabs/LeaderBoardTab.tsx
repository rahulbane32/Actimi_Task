import React, { useEffect, useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileTab from './ProfileTab';
import { AuthContext } from '../AuthContext'; 
import ProfileSettingstab from './ProfileSettings';
const Stack = createNativeStackNavigator();

type User = {
  id: string;
  firstName: string;
  lastName: string;
  steps: number;
  email: string;
  phone: string;
  country: string;
  dob: string;
  age: number;
  picture: string;
  gender?: string;
  joinedDate?: string;
  rankingHistory?: number[];
  rank?: number;
};

type SortOption = 'name' | 'steps' | 'rank';

type Props = {
  navigation: any;
};

const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('steps');
  const [error, setError] = useState<string | null>(null);

  // Get login state from context
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://randomuser.me/api/?results=100&nat=us,gb,ca,au');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();

        const mappedUsers: User[] = data.results.map((u: any) => ({
          id: u.login.uuid,
          firstName: u.name.first,
          lastName: u.name.last,
          steps: Math.floor(Math.random() * 20000), // random steps for leaderboard
          email: u.email,
          phone: u.phone,
          country: u.location.country,
          dob: u.dob.date,
          age: u.dob.age,
          picture: u.picture.thumbnail,
          gender: u.gender,
          joinedDate: u.registered.date,
        }));

        setUsers(mappedUsers);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const usersWithRank = useMemo(() => {
    const sortedBySteps = [...users].sort((a, b) => b.steps - a.steps);
    return sortedBySteps.map((user, index) => ({
      ...user,
      rank: index + 1,
      rankingHistory: [
        Math.max(1, index + 3),
        Math.max(1, index + 2),
        Math.max(1, index + 1),
        index + 1,
      ],
    }));
  }, [users]);

  // Sort
  const sortedUsers = useMemo(() => {
    if (sortBy === 'name') {
      return [...usersWithRank].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
    } else if (sortBy === 'steps') {
      return [...usersWithRank].sort((a, b) => b.steps - a.steps);
    } else if (sortBy === 'rank') {
      return [...usersWithRank].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    } else {
      return usersWithRank;
    }
  }, [usersWithRank, sortBy]);

  // Filter users by search query (first or last name)
  const filteredUsers = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return sortedUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearch) ||
        user.lastName.toLowerCase().includes(lowerSearch)
    );
  }, [sortedUsers, search]);

  // Medal icons for top ranks
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setUsers([]);
            setLoading(true);
            setError(null);
            // Could trigger fetchUsers again here for retry logic
          }}
          style={styles.retryButton}
        >
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by first or last name"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        keyboardType="default"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={styles.sortContainer}>
        {(['rank', 'steps', 'name'] as SortOption[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.sortButton, sortBy === type && styles.sortButtonActive]}
            onPress={() => setSortBy(type)}
          >
            <Text style={[styles.sortText, sortBy === type && styles.sortTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredUsers.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
          No users found 😕
        </Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const { rankingHistory, ...userWithoutRankingHistory } = item;
            return (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  if (isLoggedIn) {
                    navigation.navigate('ProfileTab', { user: userWithoutRankingHistory });
                  } else {
                    Alert.alert(
                      'Access Denied',
                      'You must be logged in to view profiles. Please go to Profile to Login',
                      [
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    );
                  }
                }}
              >
                <Text style={styles.rank}>{getRankIcon(item.rank!)}</Text>
                <Image source={{ uri: item.picture }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.userSteps}>{item.steps.toLocaleString()} steps</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6200ee',
    borderRadius: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  sortButtonActive: {
    backgroundColor: '#6200ee',
  },
  sortText: {
    color: '#6200ee',
    fontWeight: '600',
  },
  sortTextActive: {
    color: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rank: {
    width: 50,
    fontSize: 18,
    fontWeight: '700',
    color: '#6200ee',
    textAlign: 'center',
    
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    padding:1,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: { fontSize: 16, fontWeight: '600' },
  userSteps: { fontSize: 14, color: '#666' },
});
