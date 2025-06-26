import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {initiateSocket, disconnectSocket} from '../../../utils/socket';
import {GetAllGroup, GetConversationList} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import useAppHooks from '../../../auth/useAppHooks';
import {scale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';

export default function ConversationsListScreen() {
  const {navigation, t} = useAppHooks();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const token = useAuthToken();

  const SENDER = useSelector(state => state?.auth?.userDetails);

  useEffect(() => {
    initiateSocket(SENDER.id);
    return () => disconnectSocket();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchConversations();
      }
    }, [token]),
  );

  const fetchConversations = async () => {
    try {
      const response = await GetConversationList(token);
      const {groupChats = [], privateChats = []} = response || {};

      const groupConvos = groupChats.map(chat => ({
        id: chat._id,
        type: 'group',
        participant: {fullName: chat.name, _id: chat._id},
        lastMessage: 'Start chatting!',
      }));

      const privateConvos = privateChats.map(chat => ({
        id: chat._id,
        type: 'private',
        participant: {
          fullName: chat.fullName,
          avatar: chat.avatar,
          _id: chat._id,
        },
        lastMessage: 'Start chatting!',
      }));

      const allConversations = [...groupConvos, ...privateConvos];

      setConversations(allConversations);
      setFilteredConversations(allConversations);
    } catch (err) {
      console.error('Conversation fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const GetGroups = async () => {
    try {
      const updatedData = await GetAllGroup(token);
      const groups =
        updatedData?.groups?.map(group => ({
          id: group._id,
          type: 'group',
          participant: {
            fullName: group.name,
            _id: group._id,
          },
          lastMessage: 'Start chatting!',
        })) || [];

      setFilteredConversations(groups);
      setActiveTab('group');
    } catch (err) {
      console.error('Group fetch error:', err?.response?.data || err);
      Alert.alert('Error', 'Could not load group data');
    }
  };

  const showAllConversations = () => {
    setFilteredConversations(conversations);
    setActiveTab('all');
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = (
      activeTab === 'group' ? filteredConversations : conversations
    ).filter(
      convo =>
        convo.participant?.fullName
          ?.toLowerCase()
          .includes(text.toLowerCase()) ||
        convo.participant?._id?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredConversations(filtered);
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
            chatType: item.type, 
            groupId: item.type === 'group' ? item.id : null, 
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

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity
            style={[
              styles.tabbar,
              activeTab === 'all' && {backgroundColor: Color.black},
            ]}
            onPress={showAllConversations}>
            <Text style={styles.tabbarTxt}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabbar,
              activeTab === 'group' && {backgroundColor: Color.black},
            ]}
            onPress={GetGroups}>
            <Text style={styles.tabbarTxt}>Group</Text>
          </TouchableOpacity>
        </View>

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
  container: {
    flex: 1,
    marginTop: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: Color.white,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    // borderBottomWidth: 0.8,
    // borderBottomColor: '#eee',
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
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  textContainer: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Color.white,
  },
  lastMessage: {
    fontSize: 14,
    color: Color.white,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Color.white,
  },
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
  headerTxt: {
    color: Color.white,
    fontWeight: '600',
    fontSize: 25,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tabbarTxt: {
    color: Color.white,
    textAlign: 'center',
  },
  tabbar: {
    padding: scale(8),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    width: 100,
  },
});
