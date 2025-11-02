import axios from "axios";
import Keycloak from "keycloak-js";

declare global {
    interface Window {
        env: {
            API_BASE_URL: string;
            KEYCLOAK_URL: string;
            KEYCLOAK_REALM: string;
            KEYCLOAK_CLIENT_ID: string;
        };
    }
}

const API_BASE_URL = window.env.API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const axiosInterceptor = (keycloak: Keycloak) => {
    api.interceptors.request.use(
        async (config) => {
            if (!keycloak.authenticated) {
                return config;
            }

            try {
                await keycloak.updateToken(5);
            } catch (error) {
                console.error("Failed to refresh token: ", error);
                return Promise.reject(error);
            }

            if (keycloak.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

const keycloakConfig = {
    url: window.env.KEYCLOAK_URL,
    realm: window.env.KEYCLOAK_REALM,
    clientId: window.env.KEYCLOAK_CLIENT_ID,
};

export const keycloak = new Keycloak(keycloakConfig);
