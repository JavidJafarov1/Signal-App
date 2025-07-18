import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../components/Header';
import CustomImage from '../../components/ImageComponent';
import {setArtistData, setuserDetails} from '../../store/reducer/authReducer';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomTextInput from '../../components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AllArtist} from '../../utils/Apis/AllArtist';
import {useSelector} from 'react-redux';
import {useAuthToken} from '../../utils/api';
import {useFocusEffect} from '@react-navigation/native';

const HomeScreen = () => {
  const {navigation, dispatch, t} = useAppHooks();
  const [search, setSearch] = useState('');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [artists, setArtists] = useState([]);

  const token = useAuthToken();

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
        like: item.like === 1,
        id: item._id || index.toString(),
        image: item?.photo,
        text: item.name || 'Artist',
      }));
      setArtists(enrichedArtists);
      setArtistData(enrichedArtists);
    } catch (error) {
      console.error('Error fetching artists:0*/*/**/', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (token) {
        GetAllArtists();
      }
    }, [token]),
  );

  const handleDetailsScreenNavigate = item => {
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
