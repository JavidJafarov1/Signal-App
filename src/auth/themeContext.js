import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { DarkTheme, LightTheme } from '../assets/color/Color';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const getSystemTheme = () => Appearance.getColorScheme() === 'dark' ? DarkTheme : LightTheme;
    const [theme, setTheme] = useState(getSystemTheme);

    const toggleTheme = () => {
        setTheme(prev => (prev.mode === 'dark' ? LightTheme : DarkTheme));
    };

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
        });

        return () => subscription.remove();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
