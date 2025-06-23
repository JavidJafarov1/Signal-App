// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import io from 'socket.io-client';

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
//   auth: { userId: SENDER._id },
// });

// export default function ConversationsListScreen() {
//   const navigation = useNavigation();
//   const [conversations, setConversations] = useState([
//     {
//       id: [SENDER._id, RECEIVER._id].sort().join('_'),
//       type: 'one-to-one',
//       participant: { _id: RECEIVER._id, name: RECEIVER.name, avatar: RECEIVER.photo },
//       lastMessage: 'Start chatting!',
//       unreadCount: 0,
//       timestamp: new Date(),
//     },
//   ]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Socket connection
//     socket.on('connect', () => {
//       console.log('Socket connected');
//       setIsConnected(true);
//       setIsLoading(false);
//     });

//     socket.on('connect_error', (err) => {
//       console.error('Socket error:', err.message);
//       setIsConnected(false);
//       setIsLoading(false);
//     });

//     socket.emit('fetchConversations', { userId: SENDER._id }, (response) => {
//       console.log('Fetch conversations response:', response);
//       setIsLoading(false);
//       if (response && response.success) {
//         setConversations(
//           response.conversations.map((conv) => ({
//             id: conv.id || [SENDER._id, RECEIVER._id].sort().join('_'),
//             type: 'one-to-one',
//             participant: {
//               _id: conv.receiverId === SENDER._id ? RECEIVER._id : conv.receiverId || RECEIVER._id,
//               name: conv.receiverName || (conv.receiverId === RECEIVER._id ? RECEIVER.name : 'Unknown'),
//               avatar: conv.receiverAvatar || RECEIVER.photo,
//             },
//             lastMessage: conv.lastMessage || 'Start chatting',
//             unreadCount: conv.unreadCount || 0,
//             timestamp: new Date(conv.createdTimestamp || Date.now()),
//           })),
//         );
//       } else {
//         console.error('Error or no response fetching conversations:', response?.error || 'No response from server');
//       }
//     });

//     // Listen for new messages
//     socket.on('receiveMessage', (message) => {
//       console.log('New message received:', message);
//       setConversations((prevConvs) => {
//         const updatedConvs = prevConvs.map((conv) => {
//           if (conv.id === message.conversationId) {
//             return {
//               ...conv,
//               lastMessage: message.text,
//               timestamp: new Date(message.createdAt),
//               unreadCount: conv.unreadCount + 1,
//             };
//           }
//           return conv;
//         });
//         const updatedConv = updatedConvs.find((conv) => conv.id === message.conversationId);
//         return [
//           updatedConv,
//           ...updatedConvs.filter((conv) => conv.id !== message.conversationId),
//         ].filter(Boolean);
//       });
//     });

//     // Clean up
//     return () => {
//       socket.off('connect');
//       socket.off('connect_error');
//       socket.off('receiveMessage');
//     };
//   }, []);

//   const renderConversation = ({ item }) => {
//     console.log('Rendering conversation:', item);
//     return (
//       <TouchableOpacity
//         style={styles.containerItem}
//         onPress={() => {
//           console.log('Navigating to ChatScreen with:', {
//             conversationId: item.id,
//             recipientId: item.participant._id,
//             chatType: item.type,
//             chatTitle: item.participant.name,
//           });
//           navigation.navigate('ChatScreen', {
//             conversationId: item.id,
//             recipientId: item.participant._id,
//             chatType: item.type,
//             chatTitle: item.participant.name,
//           });
//         }}
//       >
//         <View style={styles.avatarPlaceholder}>
//           <Text style={styles.avatarText}>{item.participant.name.charAt(0)}</Text>
//         </View>
//         <View style={styles.conversationContent}>
//           <Text style={styles.conversationName}>{item.participant.name}</Text>
//           <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
//         </View>
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadText}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
//         ) : isConnected ? (
//           <FlatList
//             data={conversations}
//             keyExtractor={(item) => item.id}
//             renderItem={renderConversation}
//             ListEmptyComponent={<Text style={styles.emptyText}>No conversations yet.</Text>}
//           />
//         ) : (
//           <Text style={styles.emptyText}>Connecting...</Text>
//         )}
//         <TouchableOpacity
//           style={styles.newChatButton}
//           onPress={() => {
//             console.log('New chat button pressed, navigating to:', {
//               recipientId: RECEIVER._id,
//               chatTitle: RECEIVER.name,
//             });
//             navigation.navigate('ChatScreen', {
//               recipientId: RECEIVER._id,
//               chatTitle: RECEIVER.name,
//             });
//           }}
//         >
//           <Text style={styles.newChatButtonText}>+</Text>
//         </TouchableOpacity>
//       </View>
//     </ScreenWrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   containerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#e0e0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   avatarText: { fontSize: 20, fontWeight: 'bold', color: '#555' },
//   conversationContent: { flex: 1 },
//   conversationName: { fontSize: 16, fontWeight: 'bold' },
//   lastMessage: { fontSize: 14, color: 'gray' },
//   unreadBadge: {
//     backgroundColor: 'blue',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },
//   unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
//   newChatButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: 'blue',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   newChatButtonText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
//   emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {connectSocket, disconnectSocket} from '../../utils/socket';
import ScreenWrapper from '../../components/ScreenWrapper';

const ConversationsListScreen = () => {
  useEffect(() => {
    connectSocket();
  }, []);

  const connect = () => {
    connectSocket();
  };

  const disconnect = () => {
    disconnectSocket();
  };

  return (
    <ScreenWrapper>
      <TouchableOpacity
        style={{backgroundColor: '#fff', padding: 10, margin: 5}}
        onPress={() => connect()}>
        <Text>Socket Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{backgroundColor: '#fff', padding: 10, margin: 5}}
        onPress={() => disconnect()}>
        <Text>Socket Disconnect</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default ConversationsListScreen;

const styles = StyleSheet.create({});