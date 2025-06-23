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

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  connectSocket,
  disconnectSocket,
  authenticate,
} from '../../utils/socket';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';

const ConversationsListScreen = () => {
  const SENDER_ID = '683fcd41baca306240f3a5a9';
  const RECEIVER_ID = '683fcd41baca306240f3a5c7';
  const GROUP_ID = '68469d4957c04e4770d1ea73';

  const SENDER = {
    _id: '683fcd41baca306240f3a5a9',
    name: 'Armin van Buuren',
    photo: 'https://example.com/images/armin.jpg',
  };
  const RECEIVER = {
    id: '683fcd41baca306240f3a5a7',
    name: 'Martin Garrix',
    photo: require('../../assets/image/bgimage.jpg'),
  };

  // List of users for the conversation
  const conversations = [
    {
      participant: RECEIVER,
      lastMessage: 'Hey, how’s it going?', // Placeholder; fetch from DB in production
    },
  ];

  const navigation = useNavigation();

  useEffect(() => {
    connectSocket(); // Connect on mount
    authenticate(SENDER_ID, response => {
      if (response.success) {
        console.log('🔐 Sender authenticated');
      } else {
        console.error('Authentication failed:', response.error);
      }
    });

    return () => {
      disconnectSocket(); // Disconnect on unmount
    };
  }, []);

  const renderConversation = ({item}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          user: item.participant,
          senderId: SENDER_ID,
        })
      }>
      {console.log('item', item)}
      <Image source={item?.photo} />
      <Text style={styles.conversationName}>{item.participant.name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => connectSocket()}>
            <Text style={styles.buttonText}>Socket Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => disconnectSocket()}>
            <Text style={styles.buttonText}>Socket Disconnect</Text>
          </TouchableOpacity>
        </View> */}
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.participant._id}
          style={styles.conversationList}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ConversationsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  conversationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
