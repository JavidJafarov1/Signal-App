import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/color/Color'
import { scale } from 'react-native-size-matters'

const TextComponent = () => {
    return (
        <View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Вход в Signal Live</Text>
                <Text style={styles.subtitle}>
                    Войдите в приложение, чтобы получить доступ ко всем функциям
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