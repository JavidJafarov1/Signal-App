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
import {setAllUser, setGroupDetails} from '../../../store/reducer/userReducer';

export default function ConversationsListScreen({route}) {
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
  const SENDER = useSelector(state => state?.auth?.userDetails);

  useEffect(() => {
    initiateSocket(SENDER.id);
    return () => disconnectSocket();
  }, [SENDER.id]);

  useFocusEffect(
    useCallback(() => {
      if (token && (route.params?.refresh || !conversations.length)) {
        fetchConversations();
      }
    }, [token, route.params?.refresh]),
  );

  useEffect(() => {
    const fetchUsers = async () => {
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
      } catch (err) {
        console.error('Fetch users error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
    GetGroups();
  }, [token, SENDER.id, dispatch]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const [conversationResponse, groupResponse] = await Promise.all([
        GetConversationList(token),
        GetAllGroup(token),
      ]);

      const {privateChats = [], groupChats = []} = conversationResponse || {};
      const {groups = []} = groupResponse || {};
      dispatch(setGroupDetails(groups));
      const privateConvos = privateChats.map(chat => ({
        id: chat._id,
        type: 'private',
        participant: {
          fullName: chat.fullName,
          avatar: chat.avatar,
          _id: chat._id,
        },
        lastMessage: chat?.lastMessage?.content
          ? chat?.lastMessage?.content
          : chat?.lastMessage?.messageType || 'Start Chating',
        unreadCount: chat?.unreadCount || 0,
      }));

      const groupConvos = groupChats.map(groupChat => {
        const detailedGroup = groups.find(g => g._id === groupChat._id);
        return {
          id: groupChat._id,
          type: 'group',
          participant: {
            fullName: groupChat.name,
            _id: groupChat._id,
          },
          members: detailedGroup?.members || [],
          fullGroup: detailedGroup,
          lastMessage: groupChat?.lastMessage?.content
            ? groupChat?.lastMessage?.content
            : groupChat?.lastMessage?.messageType || 'Start Chating',
          unreadCount: groupChat?.unreadCount || 0,
        };
      });

      const allConversations = [...groupConvos, ...privateConvos];
      setConversations(allConversations);
      setFilteredConversations(allConversations);
      setGroupData(groupConvos);
    } catch (err) {
      console.error('Conversation fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const GetGroups = async () => {
    try {
      const updatedData = await GetAllGroup(token);
      const groups = updatedData?.groups || [];
      dispatch(setGroupDetails(groups));
      const groupConversations = groups.map(group => ({
        id: group._id,
        type: 'group',
        participant: {
          fullName: group.name,
          _id: group._id,
        },
        members: group.members || [],
        fullGroup: group,
        lastMessage: 'Start chatting!',
        unreadCount: 0,
      }));

      if (groupData.length === 0) {
        setGroupData(groupConversations);
      }
    } catch (err) {
      console.error('Group fetch error:', err?.response?.data || err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchConversations(), GetGroups()]);
    setRefreshing(false);
  };

  const showAllConversations = () => {
    setActiveTab('all');
    setFilteredConversations(conversations);
  };

  const showGroupChats = () => {
    setActiveTab('group');
    const groupsFromConversations = conversations.filter(
      convo => convo.type === 'group',
    );
    setFilteredConversations(groupsFromConversations);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const dataToSearch = activeTab === 'group' ? groupData : conversations;
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
    const isGroup = item.type === 'group';
    const avatarUrl = isGroup
      ? item.fullGroup?.groupIcone
      : item.participant?.avatar;
    const hasUnread = item?.unreadCount > 0;

    const avatarImage = avatarUrl
      ? {uri: avatarUrl}
      : require('../../../assets/image/avatar.png');

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            user: item.participant,
            senderId: SENDER.id,
            chatType: item.type,
            groupId: isGroup ? item.id : null,
            members: isGroup ? item.members : undefined,
            fullGroup: isGroup ? item.fullGroup : undefined,
          })
        }>
        <View style={styles.avatarWrapper}>
          <Image
            source={avatarImage}
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
            marginTop: scale(10),
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
          <ActivityIndicator size="large" color={Color.blue} />
        ) : (
          <>
            <Text style={styles.chatTxt}>
              {activeTab === 'all' ? 'All Chats' : 'Group Chats'}
            </Text>
            <FlatList
              data={filteredConversations}
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
    color: Color.white,
    fontSize: 18,
    fontWeight: '600',
    padding: scale(10),
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
    paddingVertical: 10,
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
