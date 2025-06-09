import React from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Color} from '../assets/color/Color';

const ScreenWrapper = ({children}) => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  React.useEffect(() => {}, [i18n, t]);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        navigation,
        t,
        i18n,
        ...child.props,
      });
    }
    return child;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Color.backgroundColor} />
      <View style={{flex: 1, paddingHorizontal: scale(16)}}>
        {childrenWithProps}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
});

export default ScreenWrapper;
