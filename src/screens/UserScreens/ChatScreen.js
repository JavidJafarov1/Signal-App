// import React, {useState, useCallback, useEffect, useRef} from 'react';
// import {GiftedChat} from 'react-native-gifted-chat';
// import 'react-native-get-random-values';
// import {v4 as uuidv4} from 'uuid';
// import io from 'socket.io-client';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import {
//   Text,
//   Platform,
//   ActionSheetIOS,
//   Alert,
//   Clipboard,
//   Share,
//   BackHandler,
// } from 'react-native';
// import { connectSocket } from '../../utils/socket';

// // Artist data
// const SENDER = {
//   _id: '68494c222f475a9a4f117134',
//   name: 'Armin van Buuren',
//   photo: 'https://example.com/images/armin.jpg',
// };
// const RECEIVER = {
//   _id: '684950531fe9b4f0c622e1e4',
//   name: 'Martin Garrix',
//   photo: 'https://example.com/images/martin.jpg',
// };

// // Initialize socket
// const socket = io('https://e2ca-103-250-149-229.ngrok-free.app', {
//   auth: {userId: SENDER._id},
// });

// export default function ChatScreen({route, navigation}) {
//   const {
//     recipientId = RECEIVER._id,
//     conversationId,
//     chatType = 'one-to-one',
//     chatTitle = RECEIVER.name,
//   } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const isMounted = useRef(true); // Track component mount state
//   const giftedChatRef = useRef(null); // Ref for GiftedChat to avoid direct mutation

//   const currentUser = {
//     _id: SENDER._id,
//     name: SENDER.name,
//     avatar: SENDER.photo,
//   };

//   useEffect(() => {
//     // Set up mount flag
//     isMounted.current = true;
//     // socket.emit('authenticate', user.id);
//     // Socket connection handlers
//    connectSocket()

//     socket.on('connect_error', err => {
//       console.error('Socket connection error:', err.message);
//       if (isMounted.current) {
//         setIsConnected(false);
//         Alert.alert('Connection Error', 'Failed to connect to the server.');
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       if (isMounted.current) setIsConnected(false);
//     });

//     // Derive conversationId
//     const derivedConversationId =
//       conversationId || [SENDER._id, recipientId].sort().join('_');

//     // Fetch messages
//     socket.emit(
//       'fetchMessages',
//       {conversationId: derivedConversationId, chatType},
//       response => {
//         console.log('Fetch messages response:', response);
//         if (isMounted.current && response.success) {
//           setMessages(
//             response.messages.map(msg => ({
//               _id: msg._id,
//               text: msg.text,
//               createdAt: new Date(msg.createdAt),
//               user: {
//                 _id: msg.senderId,
//                 name:
//                   msg.senderName ||
//                   (msg.senderId === SENDER._id ? SENDER.name : RECEIVER.name),
//                 avatar:
//                   msg.senderAvatar ||
//                   (msg.senderId === SENDER._id ? SENDER.photo : RECEIVER.photo),
//               },
//               status: msg.status || 'sent',
//             })),
//           );
//         } else if (isMounted.current) {
//           console.error('Failed to fetch messages:', response?.error);
//           Alert.alert('Error', 'Failed to load messages.');
//         }
//       },
//     );

//     // Listen for incoming messages
//     socket.on('receiveMessage', message => {
//       console.log('Received message:', message);
//       if (
//         isMounted.current &&
//         message.conversationId === derivedConversationId
//       ) {
//         setMessages(prevMessages =>
//           GiftedChat.append(prevMessages, [
//             {
//               _id: message._id,
//               text: message.text,
//               createdAt: new Date(message.createdAt),
//               user: {
//                 _id: message.senderId,
//                 name:
//                   message.senderName ||
//                   (message.senderId === SENDER._id
//                     ? SENDER.name
//                     : RECEIVER.name),
//                 avatar:
//                   message.senderAvatar ||
//                   (message.senderId === SENDER._id
//                     ? SENDER.photo
//                     : RECEIVER.photo),
//               },
//               status: message.status || 'delivered',
//             },
//           ]),
//         );
//       }
//     });

//     // Clean up
//     return () => {
//       isMounted.current = false;
//       socket.off('connect');
//       socket.off('connect_error');
//       socket.off('disconnect');
//       socket.off('receiveMessage');
//     };
//   }, [conversationId, recipientId, chatType, navigation]);

//   const onSend = useCallback(
//     (newMessages = []) => {
//       if (!isMounted.current) return; // Prevent updates if unmounted
//       const derivedConversationId =
//         conversationId || [SENDER._id, recipientId].sort().join('_');

//       newMessages.forEach(message => {
//         const messageToSend = {
//           _id: message._id || uuidv4(),
//           text: message.text,
//           createdAt: new Date().toISOString(),
//           senderId: currentUser._id,
//           senderName: SENDER.name,
//           senderAvatar: SENDER.photo,
//           recipientId: chatType === 'one-to-one' ? recipientId : undefined,
//           conversationId: derivedConversationId,
//           status: 'sending',
//         };

//         // Optimistically add to UI
//         setMessages(prevMessages =>
//           GiftedChat.append(prevMessages, [
//             {
//               ...messageToSend,
//               createdAt: new Date(messageToSend.createdAt),
//               user: currentUser,
//             },
//           ]),
//         );

//         // Send to backend with timeout to handle slow responses
//         socket.timeout(5000).emit('sendMessage', messageToSend, response => {
//           console.log('Send message response:', response);
//           if (isMounted.current && response.success) {
//             setMessages(prevMsgs =>
//               prevMsgs.map(msg =>
//                 msg._id === messageToSend._id
//                   ? {...msg, status: response.status || 'sent'}
//                   : msg,
//               ),
//             );
//           } else if (isMounted.current) {
//             setMessages(prevMsgs =>
//               prevMsgs.map(msg =>
//                 msg._id === messageToSend._id
//                   ? {...msg, status: 'failed'}
//                   : msg,
//               ),
//             );
//             Alert.alert('Error', 'Failed to send message.');
//           }
//         });
//       });
//     },
//     [conversationId, recipientId, chatType, currentUser],
//   );

//   const onLongPressMessage = (context, message) => {
//     if (!isMounted.current) return;
//     const options = ['Copy', 'Edit', 'Delete', 'Share', 'Cancel'];
//     const cancelButtonIndex = options.length - 1;

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {options, cancelButtonIndex},
//         buttonIndex => handleMessageAction(options[buttonIndex], message),
//       );
//     } else {
//       Alert.alert(
//         'Message Options',
//         '',
//         options.map(option => ({
//           text: option,
//           onPress: () => handleMessageAction(option, message),
//           style: option === 'Cancel' ? 'cancel' : 'default',
//         })),
//       );
//     }
//   };

//   const handleMessageAction = (action, message) => {
//     if (!isMounted.current) return;
//     const derivedConversationId =
//       conversationId || [SENDER._id, recipientId].sort().join('_');

//     switch (action) {
//       case 'Copy':
//         Clipboard.setString(message.text);
//         Alert.alert('Copied', 'Message copied to clipboard!');
//         break;
//       case 'Edit':
//         console.log('Edit message:', message);
//         Alert.alert('Info', 'Edit functionality is not implemented yet.');
//         break;
//       case 'Delete':
//         Alert.alert(
//           'Delete Message',
//           'Are you sure you want to delete this message?',
//           [
//             {text: 'Cancel', style: 'cancel'},
//             {
//               text: 'Delete',
//               onPress: () => {
//                 socket.emit(
//                   'deleteMessage',
//                   {
//                     messageId: message._id,
//                     conversationId: derivedConversationId,
//                   },
//                   response => {
//                     if (isMounted.current && response.success) {
//                       setMessages(prevMsgs =>
//                         prevMsgs.filter(msg => msg._id !== message._id),
//                       );
//                     } else if (isMounted.current) {
//                       Alert.alert('Error', 'Failed to delete message.');
//                     }
//                   },
//                 );
//               },
//               style: 'destructive',
//             },
//           ],
//         );
//         break;
//       case 'Share':
//         Share.share({message: message.text, title: 'Share Chat Message'})
//           .then(result => console.log(result))
//           .catch(error => console.error(error));
//         break;
//       default:
//         break;
//     }
//   };

//   // Render with error boundary
//   const renderGiftedChat = () => {
//     try {
//       return (
//         <GiftedChat
//           ref={giftedChatRef}
//           messages={messages}
//           onSend={onSend}
//           onLongPress={onLongPressMessage}
//           user={currentUser}
//           renderTicks={message => {
//             if (message.status === 'sending')
//               return (
//                 <Text
//                   style={{fontSize: 10, color: 'gray', marginHorizontal: 5}}>
//                   ⌛
//                 </Text>
//               );
//             if (message.status === 'sent')
//               return (
//                 <Text
//                   style={{fontSize: 10, color: 'white', marginHorizontal: 5}}>
//                   ✓
//                 </Text>
//               );
//             if (message.status === 'delivered')
//               return (
//                 <Text
//                   style={{fontSize: 10, color: 'white', marginHorizontal: 5}}>
//                   ✓✓
//                 </Text>
//               );
//             if (message.status === 'seen')
//               return (
//                 <Text
//                   style={{fontSize: 10, color: 'blue', marginHorizontal: 5}}>
//                   ✓✓
//                 </Text>
//               );
//             if (message.status === 'failed')
//               return (
//                 <Text style={{fontSize: 10, color: 'red', marginHorizontal: 5}}>
//                   !
//                 </Text>
//               );
//             return null;
//           }}
//           placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
//           isTyping={isConnected}
//         />
//       );
//     } catch (error) {
//       console.error('GiftedChat rendering error:', error);
//       return (
//         <Text style={{color: 'red'}}>
//           Error rendering chat. Please try again.
//         </Text>
//       );
//     }
//   };

//   // Handle back button
//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.goBack();
//         return true;
//       },
//     );
//     return () => backHandler.remove();
//   }, [navigation]);

//   return <ScreenWrapper>{renderGiftedChat()}</ScreenWrapper>;
// }

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import {onMessage, sendMessage, authenticate} from '../../utils/socket';

const ChatScreen = ({route}) => {
  const {user, senderId} = route.params; // user is RECEIVER, senderId is SENDER_ID
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Authenticate user
    authenticate(senderId, response => {
      if (response.success) {
        setIsAuthenticated(true);
        console.log('🔐 Sender authenticated in ChatScreen');
      } else {
        console.error('Authentication failed:', response.error);
      }
    });

    // Listen for incoming messages
    onMessage(msg => {
      // Only add messages for this conversation
      if (
        (msg.senderId === senderId && msg.receiverId === user._id) ||
        (msg.senderId === user._id && msg.receiverId === senderId)
      ) {
        setMessages(prevMessages => [...prevMessages, msg]);
      }
    });

    // Cleanup (optional: remove socket listeners if needed)
    return () => {};
  }, [senderId, user._id]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !isAuthenticated) return;

    const message = {
      chatType: 'private',
      content: messageText,
      senderId: senderId,
      receiverId: user._id,
      timestamp: new Date().toISOString(),
    };

    sendMessage(message);
    setMessages(prevMessages => [...prevMessages, message]);
    setMessageText('');
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === senderId
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder={
              isAuthenticated ? 'Type a message...' : 'Authenticating...'
            }
            multiline
            editable={isAuthenticated}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !isAuthenticated && styles.disabledButton,
            ]}
            onPress={handleSendMessage}
            disabled={!isAuthenticated}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
