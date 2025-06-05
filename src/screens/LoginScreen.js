import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Linking,
    Pressable,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { Color } from '../assets/color/Color';
import { scale, verticalScale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../store/reducer/authReducer';
import CustomImagePicker from '../components/ImagePicker';
import MapComponent from '../components/Maps';

export default function AuthScreen() {
    const [isRegister, setIsRegister] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);

    const navigation = useNavigation()
    const dispatch = useDispatch()


    return (
        <ScreenWrapper>

            {/* <MapComponent latitude={28.6139} longitude={77.2090} /> */}
            <View style={{ flex: 1 }}>
                <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={20} color={Color.white} />
                </Pressable>
                <Text style={[styles.textStyle, { fontSize: scale(28), fontWeight: '600', marginBottom: verticalScale(10) }]}>ВОЙТИ</Text>
                <Text style={styles.textStyle}>
                    Войдите в приложение, чтобы получить доступ ко всем функциям
                </Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, isRegister && styles.activeTab]}
                        onPress={() => setIsRegister(true)}
                    >
                        <Text style={[styles.textStyle, isRegister && styles.activeTabText]}>Регистрация</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, !isRegister && styles.activeTab]}
                        onPress={() => setIsRegister(false)}
                    >
                        <Text style={[styles.textStyle, !isRegister && styles.activeTabText]}>Вход</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>

                    <Text style={styles.textStyle}>Введите e-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                    />


                    {!isRegister && (
                        <>
                            <Pressable onPress={() => alert('Password reset')} style={{ alignSelf: 'flex-end' }} >
                                <Text style={[styles.textStyle, { fontSize: scale(14) }]}>Забыли пароль?</Text>
                            </Pressable>
                            <View style={styles.passwordRow}>
                                <Text style={styles.textStyle}>Введите пароль</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder=""
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </>
                    )}

                    {isRegister && (
                        <>
                            <Text style={styles.textStyle}>Данные для входа в приложение будут отправлены на указанный e-mail.</Text>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setAgree(!agree)}
                            >
                                <View style={[styles.checkbox, agree && styles.checked]}>
                                    {agree && <Text style={[styles.textStyle, { color: Color.black }]}>✓</Text>}
                                </View>
                                <Text style={styles.policyText}>
                                    Соглашаюсь с{' '}
                                    <Text
                                        style={styles.link}
                                        onPress={() => Linking.openURL('https://your-privacy-policy.com')}
                                    >
                                        политикой конфиденциальности
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={() => dispatch(setAuthToken('asd'))}>
                    <Text style={styles.textStyle}>
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        marginVertical: verticalScale(30),
    },
    tab: {
        flex: 1,
        paddingVertical: verticalScale(15),
        backgroundColor: Color.gray,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: Color.blue,
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    textStyle: {
        color: Color.text,
        fontSize: scale(16)
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        marginBottom: verticalScale(20),
        color: Color.text,
        paddingVertical: 5,
    },
    passwordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    checkbox: {
        width: scale(20),
        height: scale(20),
        borderWidth: 1,
        borderColor: '#aaa',
        marginRight: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: Color.white,
    },
    policyText: {
        color: Color.text,
        flex: 1,
        flexWrap: 'wrap',
    },
    link: {
        textDecorationLine: 'underline',
        color: Color.text,
    },
    button: {
        backgroundColor: Color.blue,
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        marginBottom: verticalScale(20)
    },
    iconButton: {
        padding: scale(12),
        backgroundColor: Color.gray,
        alignSelf: 'flex-start',
        marginVertical: verticalScale(20),
        marginBottom: verticalScale(50)
    },
});
