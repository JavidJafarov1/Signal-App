import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import TopDrawer from './TopDrawer';
import { Color } from '../assets/colors/Color';
import { scale, verticalScale } from 'react-native-size-matters';

const Header = ({ singleIcon = false }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigation = useNavigation();

    const handleDrawerToggle = () => {
        setDrawerVisible((prev) => !prev);
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.leftIcons}>
                    <Pressable style={styles.iconButton} onPress={handleDrawerToggle}>
                        <Feather name="menu" size={20} color={Color.white} />
                    </Pressable>

                    {!singleIcon && (
                        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
                            <Feather name="chevron-left" size={20} color={Color.white} />
                        </Pressable>
                    )}
                </View>

                <Pressable style={styles.iconButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Feather name="user" size={20} color={Color.white} />
                </Pressable>
            </View>

            <TopDrawer visible={drawerVisible} onClose={handleDrawerClose} />
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(20),
        backgroundColor: Color.backgroundColor,
    },
    leftIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    iconButton: {
        padding: 12,
        backgroundColor: '#0E0E0E',
    },
});