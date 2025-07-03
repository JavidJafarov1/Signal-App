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
import RNFS from 'react-native-fs';
import {
  request,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

export default function ChatScreen({route}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
      (msg.messageType === 'image' || msg.messageType === 'file') && msg.fileUrl
        ? {
            name: msg.fileName || '',
            type: msg.fileType || '',
            uri: msg.fileUrl || '',
          }
        : null;

    return {
      _id: msg._id,
      chatType: msg.chatType,
      receiverId: msg.receiver,
      content: msg.content || '',
      media,
      type: msg.messageType || 'text',
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
      console.error('Fetch chat history failed:', err.message);
      Alert.alert('Error', 'Failed to load chat history.');
    }
  }, [chatType, groupId, RECEIVER_ID, token]);

const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const permissionsToRequest = [];

      const apiLevel = Platform.Version;

      if (apiLevel >= 33) {
        permissionsToRequest.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        permissionsToRequest.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }

      const statuses = await requestMultiple(permissionsToRequest);

      const allGranted = Object.values(statuses).every(
        status => status === RESULTS.GRANTED,
      );

      if (!allGranted) {
        Alert.alert('Permission Denied', 'Please allow access to photos.');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        return true;
      }

      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        return true;
      }

      Alert.alert('Permission Denied', 'Please allow access to photos.');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Permission error:', err);
    return false;
  }
};

  const handleMediaPick = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.errorCode) {
        console.log('Image picker error:', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset) {
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          Alert.alert('Error', 'File size exceeds 10MB limit.');
          return;
        }
        setSelectedImage(asset);
        setMessage('');
      }
    });
  };

  const sendMediaMessage = async (asset, caption) => {
    const tempId = Date.now().toString();
    const fileName = asset.fileName || `image-${tempId}.jpg`;
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(asset.uri, tempPath);

      const tempMsg = {
        _id: tempId,
        chatType,
        content: caption.trim(),
        from: 'me',
        read: false,
        timestamp: new Date().toISOString(),
        type: 'image',
        messageType: 'image',
        media: {
          name: fileName,
          type: asset.type || 'image/jpeg',
          uri: Platform.OS === 'android' ? `file://${tempPath}` : asset.uri,
        },
        ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
      };

      setMessages(prev => insertDateHeaders([...prev, formatMessage(tempMsg)]));
      scrollToBottom();

      const file = {
        uri: Platform.OS === 'android' ? `file://${tempPath}` : asset.uri,
        name: fileName,
        type: asset.type || 'image/jpeg',
      };

      const uploaded = await uploadFile(file, token);

      const finalMsg = {
        ...tempMsg,
        _id: tempId,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        fileType: uploaded.fileType,
        messageType: 'image',
        media: {
          name: uploaded.fileName,
          type: uploaded.fileType,
          uri: uploaded.fileUrl,
        },
        sender: senderId,
        receiver: chatType === 'group' ? null : RECEIVER_ID,
        groupId: chatType === 'group' ? groupId : null,
      };

      setMessages(prev =>
        insertDateHeaders(
          prev.map(m => (m._id === tempId ? formatMessage(finalMsg) : m)),
        ),
      );

      sendMessage(finalMsg, res => {
        if (res?.success && res.messageId) {
          setMessages(prev =>
            insertDateHeaders(
              prev.map(m =>
                m._id === tempId
                  ? {...formatMessage(finalMsg), _id: res.messageId}
                  : m,
              ),
            ),
          );
        }
      });
    } catch (err) {
      console.error('Upload/send error:', err.message, err.response?.data);
      Alert.alert('Error', 'Failed to send media message.');
      setMessages(prev =>
        insertDateHeaders(prev.filter(m => m._id !== tempId)),
      );
    }
  };

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed && !selectedImage) return;

    if (selectedImage) {
      sendMediaMessage(selectedImage, trimmed);
      setSelectedImage(null);
      setMessage('');
      return;
    }

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
  }, [
    message,
    selectedImage,
    editingMessageId,
    chatType,
    groupId,
    RECEIVER_ID,
  ]);

  const handleDelete = useCallback(item => {
    if (item.from === 'me') {
      deleteMessage(item._id);
      setMessages(prev =>
        insertDateHeaders(prev.filter(m => m._id !== item._id)),
      );
    }
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
      item.media.uri.length > 0;

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
          {item.content && item.content.trim().length > 0 && (
            <Text style={styles.messageText}>{item.content.trim()}</Text>
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
  const defaultAvatar = require('../../../assets/image/avatar.png');
  const groupAvatar =
    fullGroup?.groupIcone &&
    typeof fullGroup.groupIcone === 'string' &&
    fullGroup.groupIcone.startsWith('http')
      ? fullGroup.groupIcone
      : defaultAvatar;

  const fallbackUserAvatar =
    user?.avatar &&
    typeof user.avatar === 'string' &&
    user.avatar.startsWith('http')
      ? user.avatar
      : fullGroup?.createdBy?.avatar &&
        typeof fullGroup.createdBy.avatar === 'string' &&
        fullGroup.createdBy.avatar.startsWith('http')
      ? fullGroup.createdBy.avatar
      : defaultAvatar;

  return (
    <ScreenWrapper>
      <ChatHeader
        userName={chatType === 'group' ? fullGroup?.name : user?.fullName}
        avatar={chatType === 'group' ? groupAvatar : fallbackUserAvatar}
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
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{uri: selectedImage.uri}}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <Text
              numberOfLines={1}
              style={{
                color: Color?.black,
                width: '75%',
              }}>
              {selectedImage?.fileName}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.removeImageButton}>
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
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
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  removeImageButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  removeImageText: {
    fontSize: 18,
    color: 'red',
  },
});
