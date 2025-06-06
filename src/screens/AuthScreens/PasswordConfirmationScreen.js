import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { Color } from '../../assets/color/Color';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
import useAppHooks from '../../auth/useAppHooks';
import InputComponent from '../../components/Input';
import { scale, verticalScale } from 'react-native-size-matters';
import { CheckUserExistOrNot } from '../../utils/Apis/AuthApi';

const EmailConfirmationScreen = () => {
    const { navigation, t } = useAppHooks();

    const [email, setEmail] = useState('')
    console.log('email', email)

    const handleEmailConfiguration = async () => {
        // try {
        //     const response = await CheckUserExistOrNot(email);
        //     console.log('response', response);

        //     if (response?.isExists) {
        //         navigation.navigate('PasswordConfirmationScreen', { email });
        //     } else {
        //         navigation.navigate('RegistrationScreen', { email });
        //     }
        // } catch (error) {
        //     console.error('Email configuration error:', error);
        // }
    };


    return (
        <ScreenWrapper >
            <UpperImage />
            <View style={{ flex: 1, justifyContent: 'center' }}>

                <TextComponent />
                <View style={{gap: 12}}>
                    <InputComponent
                        placeholder={t('E-mail')}
                        type='email'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <ButtonComponent buttonText={t('Continue')} buttonStyle={{ backgroundColor: Color.white }} buttonTextStyle={{ color: Color.blue }} onButtonPress={() => handleEmailConfiguration()} />

                </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', bottom: verticalScale(20),gap: 20 }}>
                <View style={{ flex: 1 }}>
                    <ButtonComponent buttonText={t('VK')} />
                </View>
                <View style={{ flex: 1 }}>
                    <ButtonComponent buttonText={t('G')} />
                </View>
            </View>

        </ScreenWrapper>
    );
};

export default EmailConfirmationScreen;