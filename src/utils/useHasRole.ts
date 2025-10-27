import { useKeycloak } from "@react-keycloak/web";

export const useIsAdmin = () => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) return false;

    const hasRole =
        keycloak.authenticated && keycloak.hasRealmRole("BOOK_ADMIN");

    return hasRole;
};

export const useIsUser = () => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) return false;

    const hasRole =
        keycloak.authenticated && keycloak.hasRealmRole("BOOK_USER");

    return hasRole;
};
