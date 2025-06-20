// import {
//   Button,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import Header from '../../components/Header';
// import CustomImage from '../../components/ImageComponent';
// import {setAuthToken} from '../../store/reducer/authReducer';
// import ScreenWrapper from '../../components/ScreenWrapper';
// import useAppHooks from '../../auth/useAppHooks';
// import {Color} from '../../assets/color/Color';
// import {scale, verticalScale} from 'react-native-size-matters';
// import CustomTextInput from '../../components/Input';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {AllArtist} from '../../utils/Apis/AllArtist';
// import {useSelector} from 'react-redux';

// const HomeScreen = () => {
//   const {navigation, dispatch, t} = useAppHooks();
//   const [search, setSearch] = useState();
//   const [showLikedOnly, setShowLikedOnly] = useState(false);
//   const [artists, setArtists] = useState([]);

//   const token = useSelector(state => state?.auth?.authToken);
//   const GetAllArtits = async () => {
//     console.log('----');

//     try {
//       console.log('=====');

//       const response = await AllArtist(token);
//       console.log('response', response);
//       setArtists(response);
//     } catch (error) {
//       console.error('Error fetching artists:', error);
//     }
//   };

//   const hadleDetailsScreenNavigate = item => {
//     navigation.navigate('HomeDetailsScreen', {item});
//   };

//   const searchData = () => {
//     let filtered = artists;

//     if (search && search.length > 0) {
//       filtered = filtered.filter(item =>
//         item.name?.toLowerCase().includes(search.toLowerCase()),
//       );
//     }

//     if (showLikedOnly) {
//       filtered = filtered.filter(item => item.like); // You may need to handle 'like' separately if not in API
//     }

//     return filtered;
//   };

//   const handleLogout = () => {
//     dispatch(setAuthToken(''));
//   };

//   return (
//     <ScreenWrapper>
//       <Header singleIcon={false} />

//       <View style={styles.content}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             paddingBottom: verticalScale(40),
//             paddingTop: verticalScale(20),
//           }}>
//           <Text
//             style={{
//               color: Color.text,
//               fontSize: scale(24),
//             }}>
//             {t('Artists')}
//           </Text>
//           <TouchableOpacity
//             style={{
//               backgroundColor: Color.gray,
//               height: scale(36),
//               width: scale(36),
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//             onPress={() => setShowLikedOnly(prev => !prev)}>
//             <AntDesign
//               name={showLikedOnly ? 'heart' : 'hearto'}
//               size={28}
//               color={Color.white}
//             />
//           </TouchableOpacity>
//         </View>

//         <CustomTextInput
//           placeholder={t('Search')}
//           value={search}
//           onChangeText={text => setSearch(text)}
//         />

//         <FlatList
//           showsVerticalScrollIndicator={false}
//           data={searchData(artists)}
//           renderItem={({item}) => (
//             <TouchableOpacity onPress={() => hadleDetailsScreenNavigate(item)}>
//               <CustomImage
//                 backgroundImage={{uri: item?.backgroundImage}}
//                 image={{uri: item?.image}}
//                 text={item?.text}
//                 fullSize={false}
//               />
//             </TouchableOpacity>
//           )}
//           keyExtractor={item => item.id}
//           numColumns={2}
//           contentContainerStyle={styles.list}
//         />
//       </View>
//       {/* <Button title="Logout" onPress={handleLogout} /> */}
//     </ScreenWrapper>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   content: {
//     flex: 1,
//     zIndex: -1,
//   },
//   list: {
//     justifyContent: 'center',
//   },
// });

import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import CustomImage from '../../components/ImageComponent';
import {setAuthToken} from '../../store/reducer/authReducer';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomTextInput from '../../components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AllArtist} from '../../utils/Apis/AllArtist';
import {useSelector} from 'react-redux';

const HomeScreen = () => {
  const {navigation, dispatch, t} = useAppHooks();
  const [search, setSearch] = useState('');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [artists, setArtists] = useState([]);

  const token = useSelector(state => state?.auth?.authToken);

  const GetAllArtists = async () => {
    try {
      const response = await AllArtist(token);

      const artistList = Array.isArray(response)
        ? response
        : Array.isArray(response?.artists)
        ? response.artists
        : [];

      if (!artistList.length) {
        console.warn('No artists found in response:', response);
        return;
      }

      const enrichedArtists = artistList.map((item, index) => ({
        ...item,
        like: false,
        id: item._id || index.toString(),
        backgroundImage: 'https://picsum.photos/200/300',
        image: 'https://picsum.photos/200/300',
        text: item.name || 'Artist',
      }));

      setArtists(enrichedArtists);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  useEffect(() => {
    if (token) {
      GetAllArtists();
    }
  }, [token]);

  const handleDetailsScreenNavigate = item => {
    {
      console.log('item===========', item);
    }
    navigation.navigate('HomeDetailsScreen', {item});
  };

  const filteredArtists = () => {
    let filtered = [...artists];

    if (search.trim()) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (showLikedOnly) {
      filtered = filtered.filter(item => item.like);
    }

    return filtered;
  };

  const handleLogout = () => {
    dispatch(setAuthToken(''));
  };

  return (
    <ScreenWrapper>
      <Header singleIcon={false} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>{t('Artists')}</Text>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => setShowLikedOnly(prev => !prev)}>
            <AntDesign
              name={showLikedOnly ? 'heart' : 'hearto'}
              size={28}
              color={Color.white}
            />
          </TouchableOpacity>
        </View>

        <CustomTextInput
          placeholder={t('Search')}
          value={search}
          onChangeText={text => setSearch(text)}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredArtists()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleDetailsScreenNavigate(item)}>
              <CustomImage
                backgroundImage={{uri: item.backgroundImage}}
                // image={{ uri: item.image }}
                text={item.text}
                fullSize={false}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: -1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: verticalScale(40),
    paddingTop: verticalScale(20),
  },
  heading: {
    color: Color.text,
    fontSize: scale(24),
  },
  heartButton: {
    backgroundColor: Color.gray,
    height: scale(36),
    width: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    justifyContent: 'center',
  },
});
