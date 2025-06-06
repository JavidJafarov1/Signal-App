import axios from "axios";
import { BASE_URL } from "../api"

export const CheckUserExistOrNot = async (data) => {
    try {
        const url = `${BASE_URL}/check-user`;
        const body = { "email": data }

        const response = await axios.post(url, body)
        return response?.data;
    } catch (error) {
        throw error
    }
}

export const RegisterNewUser = async (data) => {
    try {
        const url = `${BASE_URL}/register`;
        const body = {
            "firstName": "user-first-name",
            "lastName": "user-last-name",
            "email": "user-email-address",
            "phoneNo": "user-phoneNo",
            "password": "user-password"
        }

        const response = await axios.post(url, body)
        return response?.data;
    } catch (error) {
        throw error
    }
}


export const PasswordConfiguration = () => {
    try {

    } catch (error) {
        throw error
    }
}