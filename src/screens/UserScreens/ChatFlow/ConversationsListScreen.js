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
import {
  AllUsersList,
  GetAllGroup,
  GetConversationList,
} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import {useSelector} from 'react-redux';
import {Color} from '../../../assets/color/Color';
import Header from '../../../components/Header';
import useAppHooks from '../../../auth/useAppHooks';
import {scale, verticalScale} from 'react-native-size-matters';
import {useFocusEffect} from '@react-navigation/native';
import {setAllUser} from '../../../store/reducer/userReducer';

export default function ConversationsListScreen() {
  const {navigation, t, dispatch} = useAppHooks();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const token = useAuthToken();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchConversations(), GetGroups()]);
    setRefreshing(false);
  };

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

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await AllUsersList(token);
        const users =
          response?.users?.filter(user => user._id !== SENDER.id) || [];
        const convos = users.map(user => ({
          id: [SENDER.id, user._id].sort().join('_'),
          participant: user,
          lastMessage: 'Start chatting!',
        }));
        dispatch(setAllUser(convos));
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
    GetGroups();
  }, [token]);
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const [privateResponse, groupResponse] = await Promise.all([
        GetConversationList(token),
        GetAllGroup(token),
      ]);

      const {privateChats = []} = privateResponse || {};
      const {groups = []} = groupResponse || {};

      const privateConvos = privateChats.map(chat => ({
        id: chat._id,
        type: 'private',
        participant: {
          fullName: chat.fullName,
          avatar: chat.avatar,
          _id: chat._id,
        },
        lastMessage: chat?.lastMessage?.text || 'Start chatting!',
        unreadCount: chat?.unreadCount || 0,
      }));

      const groupConvos = groups.map(group => ({
        id: group._id,
        type: 'group',
        participant: {
          fullName: group.name,
          _id: group._id,
        },
        members: group.members || [],
        fullGroup: group,
        lastMessage: group?.lastMessage?.text || 'Start chatting!',
        unreadCount: group?.unreadCount || 0,
      }));
      const allConversations = [...groupConvos, ...privateConvos];

      setConversations(allConversations);
      setFilteredConversations(allConversations);
      setIsLoading(false);
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

      setGroupData(groups);
    } catch (err) {
      console.error('Group fetch error:', err?.response?.data || err);
      Alert.alert('Error', 'Could not load group data');
    }
  };

  const showAllConversations = () => {
    setActiveTab('all');
    setFilteredConversations(conversations);
  };

  const showGroupChats = () => {
    setActiveTab('group');
    const onlyGroups = conversations.filter(convo => convo.type === 'group');
    setGroupData(onlyGroups);
  };

  const handleSearch = text => {
    setSearchQuery(text);

    const dataToSearch =
      activeTab === 'group'
        ? conversations.filter(convo => convo.type === 'group')
        : conversations;

    const filtered = dataToSearch.filter(
      convo =>
        convo.participant?.fullName
          ?.toLowerCase()
          .includes(text.toLowerCase()) ||
        convo.participant?._id?.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredConversations(filtered);
  };

  const handleAvatarLoadStart = id => {
    setAvatarLoading(prev => ({...prev, [id]: true}));
  };

  const handleAvatarLoadEnd = id => {
    setAvatarLoading(prev => ({...prev, [id]: false}));
  };
  const renderConversation = ({item}) => {
    const avatarUrl = item?.participant?.avatar;
    const hasUnread = item?.unreadCount > 0;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            user: item.participant,
            senderId: SENDER.id,
            chatType: item.type,
            groupId: item.type === 'group' ? item.id : null,
            members: item.type === 'group' ? item.members : undefined,
            fullGroup: item.type === 'group' ? item.fullGroup : undefined,
          })
        }>
        <View style={styles.avatarWrapper}>
          {avatarUrl ? (
            <>
              <Image
                source={{uri: avatarUrl}}
                style={styles.avatarImage}
                onLoadStart={() => handleAvatarLoadStart(item.id)}
                onLoadEnd={() => handleAvatarLoadEnd(item.id)}
              />
              {avatarLoading[item.id] && (
                <ActivityIndicator
                  size="small"
                  color={Color.blue}
                  style={styles.avatarLoader}
                />
              )}
            </>
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
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {hasUnread && (
          <View style={styles.unreadBadgeRight}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            style={[
              styles.tabbar,
              activeTab === 'all' && {
                borderBottomColor: Color.white,
                borderBottomWidth: 2,
              },
            ]}
            onPress={showAllConversations}>
            <Text style={styles.tabbarTxt}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabbar,
              activeTab === 'group' && {
                borderBottomColor: Color.white,
                borderBottomWidth: 2,
              },
            ]}
            onPress={showGroupChats}>
            <Text style={styles.tabbarTxt}>Group</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={Color?.blue} />
        ) : (
          <>
            {activeTab === 'all' ? (
              <Text style={styles?.chatTxt}>All Chats</Text>
            ) : (
              <Text style={styles?.chatTxt}>Group Chats</Text>
            )}
            <FlatList
              data={activeTab === 'all' ? filteredConversations : groupData}
              keyExtractor={item => item.id}
              renderItem={renderConversation}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No users found.</Text>
              }
            />
          </>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: Color.white,
    fontSize: 18,
    fontWeight: '600',
    padding: scale(10),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    marginTop: scale(8),
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ccc',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  avatarLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  textContainer: {
    flex: 1,
    left: scale(10),
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
  tabbarTxt: {
    color: Color.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  tabbar: {
    padding: scale(8),
    width: '50%',
  },
  chatTxt: {
    color: Color?.lightGray,
    fontSize: 22,
    fontWeight: '600',
    marginTop: verticalScale(15),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    marginTop: scale(8),
    paddingHorizontal: scale(10),
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  unreadBadgeRight: {
    backgroundColor: Color?.blue,
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: Color?.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
