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



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatScreen = () => {
  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})