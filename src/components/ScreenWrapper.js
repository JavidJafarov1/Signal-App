import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Color } from '../assets/color/Color';

const ScreenWrapper = ({ children }) => {
    return <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Color.backgroundColor} />
        <View style={{ flex: 1, paddingHorizontal: scale(16) }}>

            {children}
        </View>
    </SafeAreaView>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.backgroundColor,
    },
});

export default ScreenWrapper;