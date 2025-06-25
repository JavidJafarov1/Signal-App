import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {initiateSocket, disconnectSocket} from '../../../utils/socket';
import {AllUsersList} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import useAppHooks from '../../../auth/useAppHooks';

export default function ConversationsListScreen() {
  const {navigation, t} = useAppHooks();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthToken();

  const SENDER = useSelector(state => state?.auth?.userDetails);
  console.log(SENDER);

  useEffect(() => {
    initiateSocket(SENDER.id);
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await AllUsersList(token);
        const users =
          response?.users?.filter(user => user._id !== SENDER.id) || [];
        const convos = users.map(user => ({
          id: [SENDER.id, user._id].sort().join('_'),
          participant: user,
          lastMessage: 'Start chatting!',
        }));
        setConversations(convos);
        setFilteredConversations(convos);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handleSearch = text => {
    setSearchQuery(text);
    setFilteredConversations(
      conversations.filter(
        convo =>
          convo.participant?.fullName
            ?.toLowerCase()
            .includes(text.toLowerCase()) ||
          convo.participant?._id.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const renderConversation = ({item}) => {
    const avatarUrl = item?.participant?.avatar;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            user: item.participant,
            senderId: SENDER.id,
          })
        }>
        <View style={styles.avatarPlaceholder}>
          {avatarUrl ? (
            <Image
              source={{uri: avatarUrl}}
              style={styles.avatarImage}
              // resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>
              {item?.participant?.fullName?.charAt(0).toUpperCase() || '?'}
            </Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.conversationName}>
            {item.participant?.fullName}
          </Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <Header singleIcon />
      <Text style={styles.headerTxt}>{t('Chat')}</Text>
      <View style={styles.container}>
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Color.white}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={item => item.id}
            renderItem={renderConversation}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No users found.</Text>
            }
          />
        )}
        <TouchableOpacity
          style={styles.plusIconContainer}
          onPress={() => navigation.navigate('AllUsersListScreen')}>
          <Ionicons name="add" size={30} color={Color.white} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 10},
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: Color?.white,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {fontSize: 20, fontWeight: 'bold', color: '#555'},
  textContainer: {flex: 1},
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Color.white,
  },
  lastMessage: {fontSize: 14, color: Color.white},
  emptyText: {textAlign: 'center', marginTop: 20, color: Color.white},
  plusIconContainer: {
    backgroundColor: Color.blue,
    height: 50,
    width: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTxt: {color: Color.white, fontWeight: '600', fontSize: 25},
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
