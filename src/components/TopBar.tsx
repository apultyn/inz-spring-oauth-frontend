import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

export default function TopBar() {
    const navigate = useNavigate();

    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Initializing Keycloak...</div>;
    }

    const handleLogout = () => {
        keycloak.logout();
    };
    const handleLogin = () => {
        keycloak.login();
    };
    const handleRegister = () => {
        keycloak.register();
    };

    return (
        <header className="sticky top-0 z-10 bg-indigo-600 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <button
                    onClick={() => navigate("/")}
                    className="text-2xl font-bold tracking-wide transition-opacity hover:opacity-80"
                >
                    Book&nbsp;Reviews
                </button>

                <div className="flex items-center gap-4">
                    {keycloak.authenticated ? (
                        <>
                            <p className="hidden sm:block">
                                Hello&nbsp;
                                {keycloak.idTokenParsed?.preferred_username}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                            >
                                Log&nbsp;out
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogin}
                                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                            >
                                Log&nbsp;in
                            </button>
                            <button
                                onClick={handleRegister}
                                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
