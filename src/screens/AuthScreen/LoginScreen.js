import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { Color } from '../../assets/color/Color';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import UpperImage from '../../components/UpperImage';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';

const WelcomeScreen = () => {
    const navigation = useNavigation()
    return (
        <ScreenWrapper >
            <UpperImage />
            <View style={{ flex: 1, justifyContent: 'center' }}>

                <TextComponent />
                <View style={styles.buttonContainer}>

                    <ButtonComponent buttonText={'E-mail'} onButtonPress={() => navigation.navigate('RegistrationScreen')} />
                    <ButtonComponent buttonText={'Продолжить'} buttonStyle={{ backgroundColor: Color.white }} buttonTextStyle={{ color: Color.blue }} onButtonPress={() => navigation.navigate('LoginScreen')} />

                </View>

            </View>
        </ScreenWrapper>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    buttonContainer: {
        gap: 12
    }
});
