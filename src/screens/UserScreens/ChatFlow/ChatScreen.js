import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  initiateSocket,
  markAsRead,
  subscribeToPrivateMessages,
  subscribeToGroupMessages,
  subscribeToReadStatus,
} from '../../../utils/socket';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {
  AddMember,
  ChatHistory,
  GetAllGroup,
} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ChatHeader from '../../../components/ChatHeader';
import {Color} from '../../../assets/color/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

export default function ChatScreen({route}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isUserPickerVisible, setIsUserPickerVisible] = useState(false);

  const flatListRef = useRef(null);
  const userData = useSelector(state => state?.user?.userList || []);

  const {user, chatType, groupId} = route.params || {};
  const RECEIVER_ID = user?._id;
  const token = useAuthToken();

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToIndex({
        index: messages.length - 1,
        animated: true,
      });
    }
  };

  const formatMessage = msg => ({
    _id: msg._id,
    chatType: msg.chatType,
    receiverId: msg.receiver || msg.groupId,
    content: msg.content,
    from: msg.sender === RECEIVER_ID ? 'me' : 'them',
    read: msg.read ?? false,
    timestamp: msg.timestamp || new Date().toISOString(),
  });

  const fetchChatHistory = useCallback(async () => {
    
    try {
      const res = await ChatHistory({
        type: chatType || 'private',
        userId: chatType === 'group' ? undefined : RECEIVER_ID,
        groupId: chatType === 'group' ? groupId : undefined,
        token,
      });
      if (res?.messages) {
        const formatted = res.messages.map(formatMessage);
        setMessages(formatted);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, [RECEIVER_ID, groupId, chatType, token]);

  const fetchGroupMembers = useCallback(async () => {
    try {
      const res = await GetAllGroup(token);
      const targetGroup = res?.groups?.find(group => group._id === groupId);
      if (targetGroup?.members) {
        setGroupMembers(targetGroup.members);
      }
    } catch (err) {
      console.error('Failed to fetch group members:', err);
    }
  }, [groupId, token]);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (editingMessageId) {
      const targetMessage = messages.find(m => m._id === editingMessageId);
      if (!targetMessage || targetMessage.from !== 'me') {
        Alert.alert('You can only edit your own messages.');
        return;
      }

      editMessage({messageId: editingMessageId, content: trimmed});
      setMessages(prev =>
        prev.map(m =>
          m._id === editingMessageId ? {...m, content: trimmed} : m,
        ),
      );
      setEditingMessageId(null);
    } else {
      const tempId = Date.now().toString();
      const newMsg = {
        _id: tempId,
        chatType: chatType || 'private',
        receiverId: chatType === 'group' ? groupId : RECEIVER_ID,
        content: trimmed,
        from: 'me',
        read: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);

      sendMessage(newMsg, res => {
        if (res?.success && res.messageId) {
          setMessages(prev =>
            prev.map(m => (m._id === tempId ? {...m, _id: res.messageId} : m)),
          );
        }
      });
    }

    setMessage('');
  }, [message, RECEIVER_ID, groupId, chatType, editingMessageId, messages]);

  const handleDelete = useCallback(item => {
    if (item.from === 'me') {
      deleteMessage(item._id);
    }
    setMessages(prev => prev.filter(m => m._id !== item._id));
  }, []);

  const showOptions = useCallback(
    item => {
      if (item.from === 'me') {
        Alert.alert('Message Options', '', [
          {
            text: 'Edit',
            onPress: () => {
              setEditingMessageId(item._id);
              setMessage(item.content);
            },
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDelete(item),
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }
    },
    [handleDelete],
  );

  const handleSelectUser = async user => {
    try {
      await AddMember(groupId, [user._id], token);
      Alert.alert('Success', `${user.firstName} added to the group.`);
      fetchGroupMembers();
    } catch (error) {
      Alert.alert('Error', 'Could not add member.');
    } finally {
      setIsUserPickerVisible(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
    if (chatType === 'group' && groupId) {
      fetchGroupMembers();
    }
  }, [fetchChatHistory, fetchGroupMembers, chatType, groupId]);

  useEffect(() => {
    initiateSocket(RECEIVER_ID, token);

    const handleNewMessage = newMsg => {
      if (
        (chatType === 'private' &&
          (newMsg.receiverId === RECEIVER_ID ||
            newMsg.sender === RECEIVER_ID)) ||
        (chatType === 'group' && newMsg.groupId === groupId)
      ) {
        const formatted = formatMessage(newMsg);
        setMessages(prev => [...prev, formatted]);

        if (formatted.from === 'them' && !formatted.read) {
          markAsRead(formatted._id);
          setMessages(prev =>
            prev.map(m => (m._id === formatted._id ? {...m, read: true} : m)),
          );
        }
      }
    };

    const handleReadStatus = ({messageId}) => {
      setMessages(prev =>
        prev.map(m => (m._id === messageId ? {...m, read: true} : m)),
      );
    };

    const unsubscribeMessage =
      chatType === 'group'
        ? subscribeToGroupMessages(handleNewMessage)
        : subscribeToPrivateMessages(handleNewMessage);
    const unsubscribeRead = subscribeToReadStatus(handleReadStatus);

    return () => {
      unsubscribeMessage?.off('groupMessage');
      unsubscribeMessage?.off('message');
      unsubscribeRead?.off('messageRead');
    };
  }, [RECEIVER_ID, groupId, chatType]);

  useEffect(() => {
    messages.forEach(msg => {
      if (msg.from === 'them' && !msg.read) {
        markAsRead(msg._id);
        setMessages(prev =>
          prev.map(m => (m._id === msg._id ? {...m, read: true} : m)),
        );
      }
    });
  }, [messages]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity onLongPress={() => showOptions(item)}>
        <View
          style={[
            styles.messageBubble,
            item.from === 'me' ? styles.myMessage : styles.theirMessage,
          ]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <View style={styles.metaContainer}>
            {item.from === 'me' && (
              <Ionicons
                name={item?.read ? 'checkmark-done-sharp' : 'checkmark-sharp'}
                color={Color?.white}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [showOptions],
  );

  return (
    <ScreenWrapper>
      <ChatHeader userName={user?.fullName} avatar={user?.avatar} />

      {chatType === 'group' && groupMembers.length > 0 && (
        <View style={styles.memberListContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.membersHeader}>Group Members:</Text>
            <TouchableOpacity
              onPress={() => setIsUserPickerVisible(true)}
              style={styles.addMemberButton}>
              <Text style={styles.addMemberText}>+ Add Member</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {groupMembers.map(member => (
              <View key={member._id} style={styles.memberItem}>
                <Text style={styles.memberName}>
                  {member.firstName || member.lastName
                    ? `${member.firstName || ''} ${
                        member.lastName || ''
                      }`.trim()
                    : member.email}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={
              editingMessageId ? 'Edit your message...' : 'Type your message...'
            }
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>
              {editingMessageId ? 'Update' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal for User Picker */}
      <Modal
        visible={isUserPickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsUserPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add User to Group</Text>

            <FlatList
              data={userData}
              keyExtractor={item => item._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectUser(item)}>
                  <Text style={styles.modalUserName}>
                    {/* {item?.participant?.firstName} {item?.participant?.lastName} */}
                    {item?.participant?.fullName}
                  </Text>
                  <Text style={styles.modalUserEmail}>{item.email}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noUsersText}>
                  No users available to add.
                </Text>
              }
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsUserPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e88e5',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#424242',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1e88e5',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
  memberListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  membersHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
    alignSelf: 'center',
  },
  memberItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 8,
    marginTop: 5,
  },
  memberName: {
    fontSize: 13,
  },
  addMemberButton: {
    backgroundColor: '#1e88e5',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  addMemberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.black,
    marginBottom: 15,
    textAlign: 'center',
  },

  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  modalUserName: {
    fontSize: 16,
    color: Color?.black,
    fontWeight: '600',
  },

  modalUserEmail: {
    fontSize: 14,
    color: '#666',
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
  },

  noUsersText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },

  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#1e88e5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userName: {
    fontSize: 16,
  },
  cancelButton: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
