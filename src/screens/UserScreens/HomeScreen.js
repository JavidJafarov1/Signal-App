import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import CustomImage from '../../components/ImageComponent';
import {setAuthToken} from '../../store/reducer/authReducer';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';
import {Color} from '../../assets/color/Color';
import {scale, verticalScale} from 'react-native-size-matters';
import CustomTextInput from '../../components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';

const images = [
  {
    id: '0',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'de',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: true,
  },
  {
    id: '1',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: false,
  },
  {
    id: '2',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: true,
  },
  {
    id: '3',
    backgroundImage: 'https://picsum.photos/id/1002/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: false,
  },
  {
    id: '4',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: true,
  },
  {
    id: '5',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: false,
  },
  {
    id: '6',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: false,
  },
  {
    id: '7',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: true,
  },
  {
    id: '8',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
    like: false,
  },
];

const HomeScreen = () => {
  const {navigation, dispatch, t} = useAppHooks();

  const [search, setSearch] = useState();
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const hadleDetailsScreenNavigate = item => {
    navigation.navigate('HomeDetailsScreen', {item});
  };

  const searchData = images => {
    let filtered = images;

    if (search && search.length > 0) {
      filtered = filtered.filter(item =>
        item.text?.toLowerCase().includes(search.toLowerCase()),
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: verticalScale(40),
            paddingTop: verticalScale(20),
          }}>
          <Text
            style={{
              color: Color.text,
              fontSize: scale(24),
            }}>
            {t('Artists')}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Color.gray,
              height: scale(36),
              width: scale(36),
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
          data={searchData(images)}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => hadleDetailsScreenNavigate(item)}>
              <CustomImage
                backgroundImage={{uri: item?.backgroundImage}}
                image={{uri: item?.image}}
                text={item?.text}
                fullSize={false}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
      <Button title="Logout" onPress={() => setAuthToken('')} />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: -1,
  },
  list: {
    justifyContent: 'center',
  },
});
