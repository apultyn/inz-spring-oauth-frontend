import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { axiosInterceptor, keycloak } from "./utils/api.ts";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import type { AuthClientEvent, AuthClientError } from "@react-keycloak/core";

let isInterceptorAttached = false;

const handleKeycloakEvent = (
    event: AuthClientEvent,
    error?: AuthClientError
) => {
    if (event === "onReady") {
        if (!isInterceptorAttached) {
            axiosInterceptor(keycloak);
            isInterceptorAttached = true;
        }
    }
    if (event === "onAuthError") {
        console.error("Authentication error: ", error);
    }
};

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onload: "check-sso",
                silentCheckSsoRedirectUri:
                    window.location.origin + "/silent-check-sso.html",
            }}
            LoadingComponent={<div>Loading authentication...</div>}
            onEvent={handleKeycloakEvent}
        >
            <App />
        </ReactKeycloakProvider>
    </StrictMode>
);
