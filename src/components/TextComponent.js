import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/color/Color'
import { scale } from 'react-native-size-matters'
import useAppHooks from '../auth/useAppHooks'

const TextComponent = () => {
    const {t} = useAppHooks()
    return (
        <View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{t('Login_to_Signal_Live')}</Text>
                <Text style={styles.subtitle}>
                    {t('Log_in_to_the_app_to_access_all_features')}
                </Text>
            </View>
        </View>
    )
}

export default TextComponent

const styles = StyleSheet.create({
    textContainer: {
        marginBottom: 40,
    },
    title: {
        color: Color.text,
        fontSize: scale(22),
        fontWeight: '600',
        marginBottom: 10,
    },
    subtitle: {
        color: Color.text,
        fontSize: scale(14),
    },
})