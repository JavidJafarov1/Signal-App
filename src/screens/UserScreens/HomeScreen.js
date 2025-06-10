import {
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import CustomImage from '../../components/ImageComponent';
import {setAuthToken} from '../../store/reducer/authReducer';
import ScreenWrapper from '../../components/ScreenWrapper';
import useAppHooks from '../../auth/useAppHooks';

const images = [
  {
    id: '0',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '1',
    backgroundImage: 'https://picsum.photos/id/1/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '2',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '3',
    backgroundImage: 'https://picsum.photos/id/1002/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '4',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '5',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '6',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '7',
    backgroundImage: 'https://picsum.photos/id/10/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
  {
    id: '8',
    backgroundImage: 'https://picsum.photos/id/1003/200/300',
    image: 'https://picsum.photos/id/1/200/300',
    text: 'abcd',
    city: 'rodnya',
    music: 'Nervmusic',
    date: 'nth, 16 apr. 04:00 - 07:00',
  },
];

const HomeScreen = () => {
  const {navigation, dispatch} = useAppHooks();

  const hadleDetailsScreenNavigate = item => {
    navigation.navigate('HomeDetailsScreen', {item});
  };

  const handleLogout = () => {
    dispatch(setAuthToken(''));
  };

  return (
    <ScreenWrapper>
      <Header singleIcon={false} />

      <View style={styles.content}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={images}
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

      <Button title="Logout" onPress={() => handleLogout()} />
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
