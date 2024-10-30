// Importing the useAuthStore hook from the '../store/auth' file to manage authentication state
import { useAuthStore } from "../store/authStore"

// Importing the axios library for making HTTP requests
import axios from "../axios";

// Importing jwt_decode to decode JSON Web Tokens
import jwt_decode from "jwt-decode";

// Importing the Cookies library to handle browser cookies
import Cookies from "js-cookie";


import Toast from "../../utils/Toast";
// Configuring global toast notifications using Swal.mixin

// Function to handle user login
export const login = async (email, password) => {
    try {
        // Making a POST request to obtain user tokens
        const { data, status } = await axios.post("user/token/", {
            email,
            password,
        });

        // If the request is successful (status code 200), set authentication user and display success toast
        if (status === 200) {
            setAuthUser(data.access, data.refresh);

            // Displaying a success toast notification
            Toast("success", "Signed in Successfully");
        }

        // Returning data and error information
        return { data, error: null };
    } catch (error) {
        // Handling errors and returning data and error information
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong",
        };
    }
};

// Function to handle user registration
export const register = async (full_name, email, password, password2) => {
    try {
        // Making a POST request to register a new user
        const { data } = await axios.post("user/register/", {
            full_name,
            email,
            password,
            password2,
        });

        // Logging in the newly registered user and displaying success toast
        const log = await login(email, password);
        if (log.error) {
            throw new error(log.error);
        }
        // Displaying a success toast notification
        Toast("success", "Signed Up and Logged in Successfully");
        // Returning data and error information
        return { data, error: null };
    } catch (error) {
        // Handling errors and returning data and error information
        return {
            data: null,
            error: error.response.data || "Something went wrong",
        };
    }
};

// Function to handle user logout
export const logout = () => {
    // Removing access and refresh tokens from cookies, resetting user state, and displaying success toast
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().setUser(null);

    // Displaying a success toast notification
    Toast("success", "You have been logged out");
};

// Function to set the authenticated user on page load
export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || !refreshToken) {
        return;
    }

    if (isAccessTokenExpired(accessToken)) {
        try {
            const response = await getRefreshToken();
            setAuthUser(response.access, response.refresh);
        } catch (error) {
            // Handle error (e.g., logout the user)
            logout();
            console.error("Error refreshing token:", error);
        }
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

// Function to set the authenticated user and update user state
export const setAuthUser = (access_token, refresh_token) => {
    // Setting access and refresh tokens in cookies with expiration dates
    Cookies.set("access_token", access_token, {
        expires: 1, // Access token expires in 1 day
        secure: true,
    });

    Cookies.set("refresh_token", refresh_token, {
        expires: 7, // Refresh token expires in 7 days
        secure: true,
    });

    // Decoding access token to get user information
    const user = jwt_decode(access_token) ?? null;

    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

// Function to refresh the access token using the refresh token
export const getRefreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    if (!refresh_token) {
        throw new Error("Refresh token is missing");
    }

    try {
        const response = await axios.post("user/token/refresh/", {
            refresh: refresh_token,
        });
        return response.data;
    } catch (error) {
        // Handle refresh token errors
        console.error("Failed to refresh token", error);
        throw new Error(error.response?.data?.detail || "Failed to refresh token");
    }
};


// Function to check if the access token is expired
export const isAccessTokenExpired = (accessToken) => {
    try {
        // Decoding the access token and checking if it has expired
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        // Returning true if the token is invalid or expired
        return true;
    }
};
