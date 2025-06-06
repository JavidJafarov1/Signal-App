import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const useAppHooks = () => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();

    return {
        navigation,
        t,
        i18n
    };
};

export default useAppHooks;