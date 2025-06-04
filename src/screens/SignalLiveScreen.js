import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../components/Header';
import { Color } from '../assets/colors/Color';
import { scale, verticalScale } from 'react-native-size-matters';

const socialLinks = [
    { name: 'SoundCloud', icon: <Entypo name="soundcloud" size={26} color={Color.white} />, url: 'https://soundcloud.com' },
    { name: 'Youtube', icon: <Entypo name="youtube" size={26} color={Color.white} />, url: 'https://youtube.com' },
    { name: 'telegram', icon: <EvilIcons name="sc-telegram" size={26} color={Color.white} />, url: 'https://telegram.org' },
    { name: 'Вконтакте', icon: <Entypo name="vk" size={26} color={Color.white} />, url: 'https://vk.com' },
];

const SignalLiveScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <View style={{ paddingHorizontal: scale(16) }}>

                <Text style={styles.title}>SIGNAL LIVE</Text>
                <Text style={styles.subtitle}>Следите за нами в соцсетях:</Text>

                {socialLinks.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.linkRow}
                        onPress={() => Linking.openURL(item.url)}
                    >
                        {item.icon}
                        <Text style={styles.linkText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default SignalLiveScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.backgroundColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    iconBox: {
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 6,
    },
    title: {
        color: Color.text,
        fontSize: scale(28),
        marginTop: verticalScale(20),
    },
    subtitle: {
        color: '#CCC',
        fontSize: scale(16),
        marginBottom: verticalScale(30),
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(25),
        borderBottomWidth: 0.5,
        borderBottomColor: '#444',
        paddingBottom: verticalScale(10),
    },
    linkText: {
        color: '#fff',
        fontSize: scale(18),
        marginLeft: scale(15),
    },
});
