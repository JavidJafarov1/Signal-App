import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {ThemeProvider} from './src/auth/themeContext';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/locales/i18n';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </I18nextProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
