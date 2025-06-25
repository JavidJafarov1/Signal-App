// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import ScreenWrapper from '../../../components/ScreenWrapper';
// import {AllUsersList} from '../../../utils/Apis/UsersList';
// import {useAuthToken} from '../../../utils/api';
// import {useSelector} from 'react-redux';
// import {Color} from '../../../assets/color/Color';

// const SENDER = {
//   _id: '683fcd41baca306240f3a5a9',
//   name: 'Armin van Buuren',
//   photo: 'https://example.com/images/armin.jpg',
// };

// const AllUsersListScreen = ({navigation}) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = useAuthToken();

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await AllUsersList(token);
//         const filtered = response.users.filter(user => user._id !== SENDER._id);
//         setUsers(filtered);
//       } catch (err) {
//         console.error('Failed to fetch all users', err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUsers();
//   }, [token]);

//   const renderUserItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.userItem}
//       onPress={() =>
//         navigation.navigate('ChatScreen', {
//           user: item,
//           senderId: SENDER._id,
//         })
//       }>
//       <Text style={styles.userName}>{item.fullName}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         {loading ? (
//           <ActivityIndicator size="large" color={Color.blue} />
//         ) : (
//           <FlatList
//             data={users}
//             keyExtractor={item => item._id}
//             renderItem={renderUserItem}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No users found.</Text>
//             }
//           />
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default AllUsersListScreen;

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 10},
//   userItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   userName: {
//     fontSize: 16,
//     color: Color.white,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: Color.white,
//   },
// });

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../../components/ScreenWrapper';

const AllUsersListScreen = () => {
  return (
    <ScreenWrapper>
      <View>
        <Text>AllUsersListScreen</Text>
      </View>
    </ScreenWrapper>
  );
};

export default AllUsersListScreen;

const styles = StyleSheet.create({});
