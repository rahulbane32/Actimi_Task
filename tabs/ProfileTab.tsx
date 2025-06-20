import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  steps: number;
  dob: string; // ISO string
  picture: string;
  gender?: string;
  joinedDate?: string; // ISO string
  rank?: number;
};

type Props = {
  route: {
    params: {
      user: User;
      rank: number;
    };
  };
  navigation: any;
};

const ProfileTab: React.FC<Props> = ({ route }) => {
  const { user, rank } = route.params;

  // Fallbacks if missing
  const joinedDate = user.joinedDate || '2023-01-01';
  const gender = user.gender || 'Not specified';

  // Format date to dd/mm/yyyy
  const formatDOB = (isoStr: string) => {
    const d = new Date(isoStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate months ago for joined date
  const monthsAgo = () => {
    const now = new Date();
    const joined = new Date(joinedDate);
    const yearsDiff = now.getFullYear() - joined.getFullYear();
    const monthsDiff = now.getMonth() - joined.getMonth() + yearsDiff * 12;
    if (monthsDiff <= 0) return 'this month';
    if (monthsDiff === 1) return '1 month ago';
    return `${monthsDiff} months ago`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.picture }} style={styles.avatar} />
      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Text style={styles.info}>
          {formatDOB(user.dob)}, {gender}
        </Text>
        <Text style={[styles.info, styles.joined]}>
          Joined {monthsAgo()}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>{user.steps.toLocaleString()}</Text>
          <Text style={styles.infoLabel}>Total Steps</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>{user.rank}</Text>
          <Text style={styles.infoLabel}>Current Rank</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#6200ee',
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  joined: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
  infoBox: {
    width: '40%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infoNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
});
