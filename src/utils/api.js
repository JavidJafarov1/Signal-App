import {useSelector} from 'react-redux';

export const BASE_URL = 'https://1172aa9a6c39.ngrok-free.app';

export const useAuthToken = () => {
  return useSelector(state => state?.auth?.userDetails?.token);
};
