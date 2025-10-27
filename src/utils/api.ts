import axios from "axios";
import Keycloak from "keycloak-js";

const API_BASE_URL = "http://localhost:8080/api";

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
    url: "http://localhost:8443",
    realm: "app-realm",
    clientId: "react-app",
};

export const keycloak = new Keycloak(keycloakConfig);
