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
  uploadFile,
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
  const {user, senderId, chatType, groupId, fullGroup} = route.params || {};
  const RECEIVER_ID = user?._id;

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const formatMessage = msg => {
    const date = new Date(msg.timestamp || msg.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateHeader =
      date.toDateString() === today.toDateString()
        ? 'Today'
        : date.toDateString() === yesterday.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString();

    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const media =
      msg.messageType === 'image' || msg.messageType === 'file'
        ? {
            name: msg.fileName || '',
            type: msg.fileType || '',
            uri: msg.fileUrl || '',
          }
        : msg.media || null;
    return {
      _id: msg._id,
      chatType: msg.chatType,
      receiverId: msg.receiver,
      content: msg.content || '',
      media,
      type: msg.messageType || msg.type || 'text',
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

  const insertDateHeaders = msgs => {
    const sorted = [...msgs.filter(m => m.type !== 'date-header')].sort(
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
      console.error('Fetch chat history failed:', err);
    }
  }, [chatType, groupId, RECEIVER_ID, token]);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (editingMessageId) {
      editMessage({messageId: editingMessageId, content: trimmed});
      setMessages(prev =>
        insertDateHeaders(
          prev.map(m =>
            m._id === editingMessageId ? {...m, content: trimmed} : m,
          ),
        ),
      );
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
  }, [message, editingMessageId, chatType, groupId, RECEIVER_ID]);

  const handleMediaPick = () => {
    launchImageLibrary({mediaType: 'image'}, response => {
      const asset = response.assets?.[0];
      if (asset) sendMediaMessage(asset);
    });
  };

  const sendMediaMessage = async asset => {
    const file = {
      uri: asset.uri,
      name: asset.fileName || `upload.${asset.type.split('/')[1] || 'jpg'}`,
      type: asset.type,
    };

    try {
      const uploaded = await uploadFile(file, token);
      const isImage = uploaded.fileType.startsWith('image/');
      const tempId = Date.now().toString();

      const newMsg = {
        _id: tempId,
        chatType,
        content: '',
        from: 'me',
        read: false,
        timestamp: new Date().toISOString(),
        type: isImage ? 'image' : 'file',
        media: {
          name: uploaded.fileName,
          type: uploaded.fileType,
          uri: uploaded.fileUrl,
        },
        fileUrl: uploaded.fileUrl,
        ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
      };
      setMessages(prev =>
        insertDateHeaders([...prev, newMsgFormatted(newMsg)]),
      );

      scrollToBottom();

      sendMessage(
        {
          chatType,
          receiverId: RECEIVER_ID,
          groupId,
          media: {
            name: uploaded.fileName,
            type: uploaded.fileType,
            uri: uploaded.fileUrl,
          },
          fileUrl: uploaded.fileUrl,
        },
        res => {
          if (res?.success && res.messageId) {
            setMessages(prev =>
              insertDateHeaders(
                prev.map(m =>
                  m._id === tempId ? {...m, _id: res.messageId} : m,
                ),
              ),
            );
          }
        },
      );
    } catch (err) {
      console.error('upload/send error:', err);
    }
  };

  function newMsgFormatted(msg) {
    return formatMessage({
      ...msg,
      media: msg.media,
    });
  }

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
        if ([newMsg.receiverId, newMsg.sender].includes(RECEIVER_ID)) {
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
  }, [chatType, groupId, RECEIVER_ID, fetchChatHistory]);

  useEffect(() => {
    markUnreadMessages();
  }, [markUnreadMessages]);

  const renderItem = ({item}) => {
    if (item.type === 'date-header') {
      return (
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeaderText}>{item.dateHeader}</Text>
        </View>
      );
    }

    const hasImage =
      item.media &&
      typeof item.media.type === 'string' &&
      item.media.type.startsWith('image/') &&
      typeof item.media.uri === 'string' &&
      item.media.uri.trim() !== '';

    return (
      <TouchableOpacity onLongPress={() => showOptions(item)}>
        <View
          style={[
            styles.messageBubble,
            item.from === 'me' ? styles.myMessage : styles.theirMessage,
          ]}>
          {hasImage && (
            <Image
              source={{uri: item.media.uri}}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {item.content.length > 0 && (
            <Text style={styles.messageText}>{item.content}</Text>
          )}
          <View style={styles.metaContainer}>
            {item.from === 'me' && (
              <Text style={styles.readStatus}>{item.read ? '✓✓' : '✓'}</Text>
            )}
            <Text style={styles.timestamp}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <ChatHeader
        userName={chatType === 'group' ? fullGroup?.name : user?.fullName}
        avatar={
          chatType === 'group'
            ? fullGroup?.groupIcone
            : user?.avatar || fullGroup?.createdBy?.avatar
        }
        menu={chatType === 'group'}
        onMenuPress={() => {
          if (chatType === 'group') {
            navigation.navigate('GroupInfoScreen', {
              groupId,
              members: route.params?.members || [],
            });
          }
        }}
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
              editingMessageId ? 'Edit message...' : 'Type a message...'
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
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  sendButton: {
    padding: 10,
  },
  sendText: {
    color: 'white',
    fontSize: 16,
  },
  mediaButton: {
    padding: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    color: '#ccc',
    fontSize: 12,
  },
});
