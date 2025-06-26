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
import ScreenWrapper from '../../../components/ScreenWrapper';
import {initiateSocket, disconnectSocket} from '../../../utils/socket';
import {AllUsersList} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import useAppHooks from '../../../auth/useAppHooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setAllUser} from '../../../store/reducer/userReducer';

export default function ConversationsListScreen() {
  const {navigation, dispatch} = useAppHooks();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthToken();

  const SENDER = useSelector(state => state?.auth?.userDetails);
  const a = useSelector(state => state?.user?.userList);
  console.log(a);
  
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
        dispatch(setAllUser(convos));
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
            <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
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
      <Header />
      <View style={styles.container}>
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Color.white}
        />
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigation.navigate('CreateNewGroupScreen')}>
          <Ionicons name="add" size={30} color={Color.white} />
          <Text
            style={{
              color: Color?.white,
              alignSelf: 'center',
              marginLeft: 10,
              fontSize: 18,
            }}>
            New Group
          </Text>
        </TouchableOpacity>
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
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
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

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
