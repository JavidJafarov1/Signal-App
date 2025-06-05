import { Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import TopDrawer from '../components/TopDrawer'
import Header from '../components/Header';
import Config from '../config/config'
import i18n from '../i18Next/i18n'
import { Translation, useTranslation } from 'react-i18next'
import CustomImage from '../components/ImageComponent'
import AnimatedHamburger from '../components/MenuButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../store/reducer/authReducer';
import { Color } from '../assets/color/Color';
import BackgroundImageWrapper from '../components/BackgroundImageWrapper';
import { scale } from 'react-native-size-matters';
import ScreenWrapper from '../components/ScreenWrapper';

const images = [
    { id: "0", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "1", backgroundImage: "https://picsum.photos/id/1/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "2", backgroundImage: "https://picsum.photos/id/10/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "3", backgroundImage: "https://picsum.photos/id/1002/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "4", backgroundImage: "https://picsum.photos/id/10/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "5", backgroundImage: "https://picsum.photos/id/1003/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "6", backgroundImage: "https://picsum.photos/id/1003/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "7", backgroundImage: "https://picsum.photos/id/10/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
    { id: "8", backgroundImage: "https://picsum.photos/id/1003/200/300", image: "https://picsum.photos/id/1/200/300", text: 'abcd', city: 'rodnya', music: 'Nervmusic', date: 'nth, 16 apr. 04:00 - 07:00' },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const hadleDetailsScreenNavigate = (item) => {
        navigation.navigate('HomeDetailsScreen', { item })
    }

    return (
        <ScreenWrapper >
            <Header singleIcon={false} />

            <View style={styles.content}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={images}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => hadleDetailsScreenNavigate(item)}>
                            <CustomImage
                                backgroundImage={{ uri: item?.backgroundImage }}
                                image={{ uri: item?.image }}
                                text={item?.text}
                                fullSize={false}
                            />
                        </Pressable>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            </View>

            <Button title='Logout' onPress={() => dispatch(setAuthToken(''))} />
        </ScreenWrapper>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    content: {
        flex: 1,
        zIndex: -1
    },
    list: {
        justifyContent: "center",
    },
})