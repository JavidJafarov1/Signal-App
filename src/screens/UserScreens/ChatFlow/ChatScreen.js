import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
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
  deleteMessage,
  markAsRead,
  subscribeToPrivateMessages,
  subscribeToReadStatus,
  subscribeToGroupMessages,
  uploadFile,
  subscribeToDeletedMessages,
  initiateSocket,
} from '../../../utils/socket';
import ScreenWrapper from '../../../components/ScreenWrapper';
import {ChatHistory} from '../../../utils/Apis/UsersList';
import {useAuthToken} from '../../../utils/api';
import ChatHeader from '../../../components/ChatHeader';
import useAppHooks from '../../../auth/useAppHooks';
import {Color} from '../../../assets/color/Color';
import {scale} from 'react-native-size-matters';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';

export default function ChatScreen({route}) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingMessageId, setUploadingMessageId] = useState(null);

  const flatListRef = useRef(null);
  const {navigation} = useAppHooks();
  const token = useAuthToken();
  const [isUploading, setIsUploading] = useState(false);

  const {user, senderId, chatType, groupId, fullGroup} = route.params || {};
  const RECEIVER_ID = user?._id;

  const scrollToBottom = (animated = false) => {
    setTimeout(() => flatListRef.current?.scrollToEnd({animated}), 0);
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

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    viewableItems.forEach(item => {
      if (item.item.from === 'them' && !item.item.read && !item.item.deleted) {
        console.log(`Marking message as read: ${item.item._id}`);
        markAsRead(item.item._id);
        setMessages(prev =>
          insertDateHeaders(
            prev.map(m => (m._id === item.item._id ? {...m, read: true} : m)),
          ),
        );
      }
    });
  }).current;

  const insertDateHeaders = msgs => {
    const sorted = [...msgs.filter(m => m.type !== 'date-header')].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
    const result = [];
    let lastDate = null;
    let counter = 0;

    for (const msg of sorted) {
      if (msg.dateHeader !== lastDate) {
        result.push({
          _id: `date-header-${msg.dateHeader}-${counter++}`,
          type: 'date-header',
          dateHeader: msg.dateHeader,
        });
        lastDate = msg.dateHeader;
      }
      result.push(msg);
    }
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
        // console.log('Fetched chat history:', res.messages.length, 'messages');
        const formatted = res.messages.map(formatMessage);
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const newMessages = formatted.filter(
            msg => !existingIds.has(msg._id),
          );
          return insertDateHeaders([
            ...prev.filter(m => m.type !== 'date-header'),
            ...newMessages,
          ]);
        });
        scrollToBottom();
      } else {
        console.log('No messages found in chat history');
      }
    } catch (err) {
      console.error('Fetch chat history failed:', err);
    }
  }, [chatType, groupId, RECEIVER_ID, token]);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed && !selectedImage) return;

    if (selectedImage) {
      sendMediaMessage(selectedImage, trimmed);
      setSelectedImage(null);
      setMessage('');
      return;
    }

    const newMsg = {
      chatType,
      content: trimmed,
      sender: senderId,
      type: 'text',
      ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
    };

    console.log('Sending text message:', newMsg);
    scrollToBottom(true);
    sendMessage(newMsg, res => {
      if (!res?.success) {
        console.error('Send message failed:', res);
        Alert.alert('Error', 'Failed to send message');
      } else {
        console.log('Text message sent successfully:', res);
      }
    });

    setMessage('');
  }, [message, selectedImage, chatType, groupId, RECEIVER_ID, senderId]);

  const handleMediaPick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      const asset = response.assets?.[0];
      if (asset) {
        setSelectedImage(asset);
        setMessage('');
      }
    });
  };
  const sendMediaMessage = async (asset, caption) => {
    const tempId = `temp-${Date.now()}`;
    const localUri = asset.uri;

    const tempMsg = {
      _id: tempId,
      chatType,
      content: caption.trim(),
      sender: senderId,
      from: 'me',
      read: false,
      timestamp: new Date().toISOString(),
      type: 'image',
      messageType: 'image',
      media: {
        name: asset.fileName || `image-${tempId}.jpg`,
        type: asset.type || 'image/jpeg',
        uri: localUri,
      },
      ...(chatType === 'group' ? {groupId} : {receiverId: RECEIVER_ID}),
    };

    scrollToBottom();
    setIsUploading(true);

    try {
      const file = {
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      };

      const uploaded = await uploadFile(file, token);

      const finalMsg = {
        ...tempMsg,
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName,
        fileType: uploaded.fileType,
        media: {
          name: uploaded.name,
          type: uploaded.fileType,
          uri: uploaded.fileUrl,
        },
      };

      sendMessage(finalMsg, res => {
        if (!res?.success) {
          setMessages(prev =>
            insertDateHeaders(prev.filter(m => m._id !== tempId)),
          );
          Alert.alert('Error', 'Failed to send media message');
        }
      });
    } catch (err) {
      console.error('Upload/send error:', err);
      setMessages(prev =>
        insertDateHeaders(prev.filter(m => m._id !== tempId)),
      );
      Alert.alert('Error', 'Failed to send media message');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = useCallback(item => {
    if (item.from === 'me') {
      console.log('Deleting message:', item._id);
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
    const unread = messages.filter(
      m => m.from === 'them' && !m.read && !m.deleted,
    );
    unread.forEach(msg => {
      console.log('Marking unread message as read:', msg._id);
      markAsRead(msg._id);
      setMessages(prev =>
        insertDateHeaders(
          prev.map(m => (m._id === msg._id ? {...m, read: true} : m)),
        ),
      );
    });
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
    markUnreadMessages();
    scrollToBottom(false);
  }, [fetchChatHistory, markUnreadMessages]);

  useEffect(() => {
    let msgSub, readSub, deleteSub;

    const updateMessage = newMsg => {
      console.log('Received socket message:', newMsg);

      setMessages(prev => {
        const formatted = formatMessage(newMsg);

        const withoutTemp = prev.filter(
          m =>
            m._id !== newMsg._id &&
            !(m._id.startsWith('temp-') && m.timestamp === newMsg.timestamp),
        );

        const updated = insertDateHeaders([...withoutTemp, formatted]);
        scrollToBottom();

        if (newMsg.sender !== senderId && !newMsg.read) {
          console.log('Marking new message as read:', newMsg._id);
          markAsRead(newMsg._id);
          return insertDateHeaders(
            updated.map(m => (m._id === newMsg._id ? {...m, read: true} : m)),
          );
        }

        return updated;
      });
    };

    const handleReadStatus = ({messageId}) => {
      console.log('Received read status for message:', messageId);
      setMessages(prev => {
        const exists = prev.find(
          m => m._id.toString() === messageId.toString(),
        );
        if (exists) {
          console.log('Updating read status for message:', messageId);
          return insertDateHeaders(
            prev.map(m =>
              m._id.toString() === messageId.toString()
                ? {...m, read: true}
                : m,
            ),
          );
        } else {
          console.log('Message not found for read status:', messageId);
          return prev;
        }
      });
    };

    if (chatType === 'private') {
      console.log('Subscribing to private messages');
      msgSub = subscribeToPrivateMessages(updateMessage);
      readSub = subscribeToReadStatus(handleReadStatus);
    } else {
      console.log('Subscribing to group messages');
      msgSub = subscribeToGroupMessages(newMsg => {
        if (newMsg.groupId === groupId) {
          updateMessage(newMsg);
        } else {
          console.log(
            'Ignoring group message for different group:',
            newMsg.groupId,
          );
        }
      });
      readSub = subscribeToReadStatus(handleReadStatus);
    }

    deleteSub = subscribeToDeletedMessages(messageId => {
      console.log('Received delete event for message:', messageId);
      setMessages(prev =>
        insertDateHeaders(
          prev.map(m =>
            m._id.toString() === messageId.toString()
              ? {...m, deleted: true}
              : m,
          ),
        ),
      );
    });

    return () => {
      console.log('Cleaning up socket subscriptions');
      msgSub?.off?.('message');
      readSub?.off?.('messageRead');
      deleteSub?.off?.('messageDeleted');
    };
  }, [chatType, groupId, RECEIVER_ID, senderId]);

  const renderItem = ({item}) => {
    if (item.type === 'date-header') {
      return (
        <View style={styles.dateHeaderContainer}>
          <Text style={styles.dateHeaderText}>{item.dateHeader}</Text>
        </View>
      );
    }

    if (item.deleted) return null;

    const hasImage = item.media?.type?.startsWith('image/') && item.media?.uri;

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
          {hasImage &&
            item.from === 'me' &&
            uploadingMessageId === item._id && (
              <ActivityIndicator style={styles.loadingOverlay} />
            )}
          {!!item.content?.trim() && (
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
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{uri: selectedImage.uri}}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <Text numberOfLines={1} style={styles.previewFilename}>
              {selectedImage.fileName}
            </Text>
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}>
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
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
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
    color: Color?.white,
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
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: 'gray',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(5),
  },
  dateHeaderText: {
    color: Color?.white,
    fontSize: scale(12),
    fontWeight: '600',
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
