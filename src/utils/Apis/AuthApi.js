import axios from 'axios';
import {BASE_URL} from '../api';

export const CheckUserExistOrNot = async data => {
  try {
    const url = `${BASE_URL}/check-user`;
    const body = {email: data};

    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const RegisterNewUser = async data => {
  try {
    const url = `${BASE_URL}/auth/register`;
    const body = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      phoneNo: data?.phone,
      password: data?.password,
    };

    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const Login = async data => {
  try {
    const url = `${BASE_URL}/auth/login`;
    const body = {
      email: data?.email,
      password: data?.password,
    };

    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const OTPVerification = async data => {
  try {
    const url = `${BASE_URL}/auth/verify-otp`;
    const body = {
      email: data?.email,
      otp: data?.otp,
    };

    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
