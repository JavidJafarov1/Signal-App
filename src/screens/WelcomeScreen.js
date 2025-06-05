import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Pressable } from 'react-native';
import { Color } from '../assets/color/Color';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { setAuthToken } from '../store/reducer/authReducer';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '../components/ScreenWrapper';
import SoundPlayer from '../components/Sound';

const WelcomeScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    return (
        <ScreenWrapper>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingTop: verticalScale(80) }}>
                    <Text style={styles.title}>SIGNAL</Text>

                    <View style={styles.dateLocationContainer}>
                        <Text style={styles.textStyle}>15—19 August</Text>
                        <Text style={styles.textStyle}>Nikola-Lenivets</Text>
                    </View>
                    <Text style={styles.description}>
                        Экосистема c годовым жизненным циклом, Signal Festival проводит восьмой сезон в крупнейшем арт-парке Никола-Ленивец
                    </Text>
                </View>

                <View style={{ paddingBottom: verticalScale(20) }}>

                    <Pressable style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.loginButtonText}>Войти</Text>
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate('ProfileScreen') }}>
                        <Text style={styles.guestText}>Продолжить как гость</Text>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: scale(70),
        color: Color.text,
        marginBottom: 30,
        alignSelf: 'center'
    },
    dateLocationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(20),
    },
    textStyle: {
        fontSize: scale(20),
        color: Color.text,
    },
    description: {
        fontSize: scale(18),
        color: Color.text,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#0E0E0E',
        paddingVertical: verticalScale(14),
        borderRadius: 6,
        marginBottom: verticalScale(15),
    },
    loginButtonText: {
        color: Color.text,
        fontSize: scale(18),
        textAlign: 'center'
    },
    guestText: {
        color: '#CCC',
        fontSize: scale(16),
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});
