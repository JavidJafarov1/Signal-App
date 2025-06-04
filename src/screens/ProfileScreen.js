import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../assets/colors/Color';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const ProfileScreen = () => {
    return (
        <SafeAreaView style={styles.container}>

            <Header />
            <View style={{ paddingHorizontal: scale(16), flex: 1 }}>
                <View style={styles.profileContainer}>
                    <View style={styles.profileIcon}>
                        <Text style={styles.textStyle}>?</Text>
                    </View>
                    <View>
                        <Text style={styles.textStyle}>Привет,</Text>
                        <Text style={[styles.textStyle, { fontWeight: '600', fontSize: scale(20) }]}>ГОСТЬ</Text>
                        <Text style={styles.textStyle}>Вы вошли как гость.</Text>
                    </View>
                </View>

                <Text style={styles.infoText}>
                    Для доступа ко всем функциям раздела Signal People необходимо войти или зарегистрироваться
                </Text>

            </View>
            <Pressable style={styles.loginButton}>
                <Text style={styles.textStyle}>Вход/Регистрация</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.backgroundColor,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(45),
    },
    profileIcon: {
        width: scale(80),
        height: scale(80),
        backgroundColor: '#0E0E0E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(15),
    },
    textStyle: {
        color: Color.text,
        fontSize: scale(18),
    },
    infoText: {
        color: '#888',
        fontSize: 14,
        paddingTop: verticalScale(30)
    },
    loginButton: {
        backgroundColor: Color.blue,
        paddingVertical: verticalScale(15),
        alignItems: 'center',
        marginBottom: verticalScale(20),
        marginHorizontal: scale(16)
    },
});
