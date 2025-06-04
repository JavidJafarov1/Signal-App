import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, CheckBox, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [email, setEmail] = useState('');
    const [agree, setAgree] = useState(false);

    return (
        <View style={styles.container}>
            {/* Back Icon */}
            <TouchableOpacity style={styles.backIcon}>
                <Icon name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Heading */}
            <Text style={styles.heading}>ВОЙТИ</Text>
            <Text style={styles.subHeading}>Войдите в приложение, чтобы получить доступ ко всем функциям</Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, isRegister && styles.activeTab]}
                    onPress={() => setIsRegister(true)}
                >
                    <Text style={[styles.tabText, isRegister && styles.activeTabText]}>Регистрация</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, !isRegister && styles.activeTab]}
                    onPress={() => setIsRegister(false)}
                >
                    <Text style={[styles.tabText, !isRegister && styles.activeTabText]}>Вход</Text>
                </TouchableOpacity>
            </View>

            {/* Email Input */}
            <Text style={styles.inputLabel}>Введите e-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text style={styles.infoText}>Данные для входа в приложение будут отправлены на указанный e-mail.</Text>

            {/* Checkbox */}
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={agree}
                    onValueChange={setAgree}
                    tintColors={{ true: '#fff', false: '#fff' }}
                />
                <Text style={styles.checkboxLabel}>
                    Соглашаюсь с{' '}
                    <Text style={styles.linkText} onPress={() => Linking.openURL('https://example.com/privacy')}>
                        политикой конфиденциальности
                    </Text>
                </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                    {isRegister ? 'Зарегистрироваться' : 'Войти'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 24,
        paddingTop: 60,
    },
    backIcon: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 6,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#1a1a1a',
    },
    tabText: {
        color: '#fff',
        fontSize: 16,
    },
    activeTabText: {
        color: '#00f',
    },
    inputLabel: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#555',
        color: '#fff',
        fontSize: 16,
        marginBottom: 12,
    },
    infoText: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxLabel: {
        color: '#fff',
        marginLeft: 10,
        flexShrink: 1,
    },
    linkText: {
        textDecorationLine: 'underline',
        color: '#fff',
    },
    primaryButton: {
        backgroundColor: '#001bff',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
