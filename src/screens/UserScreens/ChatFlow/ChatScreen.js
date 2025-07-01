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
  Image,
} from 'react-native';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  subscribeToPrivateMessages,
  subscribeToReadStatus,
  subscribeToGroupMessages,
} from '../../../utils/socket';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {ChatHistory} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ChatHeader from '../../../components/ChatHeader';
import useAppHooks from '../../../auth/useAppHooks';
import {Color} from '../../../assets/color/Color';
import {scale} from 'react-native-size-matters';
import {launchImageLibrary} from 'react-native-image-picker';


export default function ChatScreen({route}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const flatListRef = useRef(null);

  const {navigation} = useAppHooks();
  const token = useAuthToken();
  const {user, senderId, chatType, groupId} = route.params || {};
  const RECEIVER_ID = user?._id;

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const formatMessage = msg => {
    const date = new Date(msg.timestamp || msg.createdAt || new Date());
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateHeader =
      date.toDateString() === today.toDateString()
        ? 'Today'
        : date.toDateString() === yesterday.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });

    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      _id: msg._id,
      chatType: msg.chatType,
      receiverId: msg.receiver,
      content: msg.content,
      media: msg.media,
      type: msg.type || 'text',
      from:
        chatType === 'group'
          ? msg.sender === senderId
            ? 'me'
            : 'them'
          : msg.sender === RECEIVER_ID
          ? 'them'
          : 'me',
      read: msg.read ?? false,
      timestamp: msg.timestamp || date.toISOString(),
      time,
      dateHeader,
    };
  };

  const insertDateHeaders = messages => {
    const filtered = messages.filter(msg => msg.type !== 'date-header');
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    const result = [];
    let lastDate = null;

    sorted.forEach(msg => {
      if (msg.dateHeader !== lastDate) {
        result.push({
          _id: `date-${msg.dateHeader}`,
          type: 'date-header',
          dateHeader: msg.dateHeader,
        });
        lastDate = msg.dateHeader;
      }
      result.push(msg);
    });

    return result;
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const params =
        chatType === 'group'
          ? {groupId, token, type: 'group'}
          : {userId: RECEIVER_ID, token, type: 'private'};

      const res = await ChatHistory(params);
      if (res?.messages) {
        const formatted = res.messages.map(formatMessage);
        setMessages(insertDateHeaders(formatted));
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, [RECEIVER_ID, groupId, token, chatType]);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (editingMessageId) {
      const updated = messages.map(m =>
        m._id === editingMessageId ? {...m, content: trimmed} : m,
      );
      editMessage({messageId: editingMessageId, content: trimmed});
      setMessages(insertDateHeaders(updated));
      setEditingMessageId(null);
    } else {
      const tempId = Date.now().toString();
      const newMsg = {
        _id: tempId,
        chatType,
        content: trimmed,
        from: 'me',
        read: false,
        timestamp: new Date().toISOString(),
        type: 'text',
        ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
      };

      setMessages(prev => insertDateHeaders([...prev, formatMessage(newMsg)]));
      scrollToBottom();

      sendMessage(newMsg, res => {
        const isImage = media.type?.startsWith('image/');

        socket.emit('sendMessage', {
          chatType,
          receiverId: RECEIVER_ID,
          groupId,
          messageType: isImage ? 'image' : 'file',
          fileUrl: res?.fileUrl || '',
          fileName: media.name,
          fileType: media.type,
        });

        if (res?.success && res.messageId) {
          setMessages(prev =>
            insertDateHeaders(
              prev.map(m =>
                m._id === tempId ? {...m, _id: res.messageId} : m,
              ),
            ),
          );
        }
      });
    }

    setMessage('');
  }, [message, editingMessageId, messages, RECEIVER_ID, chatType, groupId]);

  const handleDelete = useCallback(item => {
    if (item.from === 'me') deleteMessage(item._id);
    setMessages(prev =>
      insertDateHeaders(prev.filter(m => m._id !== item._id)),
    );
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

  const markUnreadMessages = useCallback(() => {
    messages.forEach(msg => {
      if (msg.from === 'them' && !msg.read) {
        markAsRead(msg._id);
        setMessages(prev =>
          insertDateHeaders(
            prev.map(m => (m._id === msg._id ? {...m, read: true} : m)),
          ),
        );
      }
    });
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();

    let msgSub, readSub;

    if (chatType === 'private') {
      msgSub = subscribeToPrivateMessages(newMsg => {
        if (
          newMsg.receiverId === RECEIVER_ID ||
          newMsg.sender === RECEIVER_ID
        ) {
          setMessages(prev =>
            insertDateHeaders([...prev, formatMessage(newMsg)]),
          );
          scrollToBottom();
        }
      });

      readSub = subscribeToReadStatus(({messageId}) => {
        setMessages(prev =>
          insertDateHeaders(
            prev.map(m => (m._id === messageId ? {...m, read: true} : m)),
          ),
        );
      });
    } else {
      msgSub = subscribeToGroupMessages(newMsg => {
        if (newMsg.groupId === groupId) {
          setMessages(prev =>
            insertDateHeaders([...prev, formatMessage(newMsg)]),
          );
          scrollToBottom();
        }
      });
    }

    return () => {
      msgSub?.off?.('message');
      readSub?.off?.('messageRead');
    };
  }, [RECEIVER_ID, groupId, chatType, fetchChatHistory]);

  useEffect(() => {
    markUnreadMessages();
  }, [messages, markUnreadMessages]);

  const handleMenuPress = () => {
    if (chatType === 'group') {
      navigation.navigate('GroupInfoScreen', {
        groupId,
        members: route.params?.members || [],
      });
    }
  };
  const handleMediaPick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (
          response.didCancel ||
          response.errorCode ||
          !response.assets?.length
        ) {
          return;
        }

        const asset = response.assets[0];

        if (!asset.base64 || !asset.type?.startsWith('image/')) return;

        const media = {
          base64: asset.base64,
          uri: asset.uri,
          type: asset.type,
          name:
            asset.fileName || `media.${asset.type?.split('/')?.[1] || 'jpg'}`,
        };

        const tempId = Date.now().toString();

        const newMsg = {
          _id: tempId,
          chatType,
          content: '',
          from: 'me',
          read: false,
          timestamp: new Date().toISOString(),
          type: 'image',
          media,
          ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
        };

        // Optimistically add message to UI
        setMessages(prev =>
          insertDateHeaders([...prev, formatMessage(newMsg)]),
        );
        scrollToBottom();
        console.log('newMsg', newMsg);

        // Send message via socket
        sendMessage(newMsg, res => {
          if (res?.success && res.messageId) {
            setMessages(prev =>
              insertDateHeaders(
                prev.map(m =>
                  m._id === tempId ? {...m, _id: res.messageId} : m,
                ),
              ),
            );
          } else {
            console.error('Failed to send media message', res);
          }
        });
      },
    );
  };

  const renderItem = useCallback(
    ({item}) => {
      if (item.type === 'date-header') {
        return (
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>{item.dateHeader}</Text>
          </View>
        );
      }

      return (
        <TouchableOpacity onLongPress={() => showOptions(item)}>
          <View
            style={[
              styles.messageBubble,
              item.from === 'me' ? styles.myMessage : styles.theirMessage,
            ]}>
            {item.media?.base64 && item.media?.type?.startsWith('image/') && (
              <Image
                source={{
                  uri: `data:${item.media.type};base64,${item.media.base64}`,
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                  marginBottom: 5,
                }}
                resizeMode="cover"
              />
            )}

            <Text style={styles.messageText}>{item.content}</Text>

            <View style={styles.metaContainer}>
              {item.from === 'me' && (
                <Text style={styles.readStatus}>{item.read ? '✓✓' : '✓'}</Text>
              )}
              <Text style={styles.timestamp}>{item.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [showOptions],
  );

  return (
    <ScreenWrapper>
      <ChatHeader
        userName={user?.fullName}
        avatar={user?.avatar}
        menu={chatType === 'group'}
        onMenuPress={handleMenuPress}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          initialNumToRender={20}
          removeClippedSubviews
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleMediaPick}
            style={styles.mediaButton}>
            <Text style={styles.sendText}>📎</Text>
          </TouchableOpacity>
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: scale(10),
  },
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
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: scale(10),
    color: Color.white,
    marginLeft: 5,
  },
  readStatus: {
    fontSize: 10,
    color: '#4caf50',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1c1c1c',
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
  dateHeaderContainer: {
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: scale(10),
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    paddingVertical: scale(5),
    paddingHorizontal: scale(12),
  },
  dateHeaderText: {
    color: Color?.white,
    fontSize: scale(14),
    fontWeight: '600',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 4,
  },
});
