import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import {
    getProfile
} from "../api/authApi";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        loadUser();

    }, []);

    const loadUser = async () => {

        try {

            const profile =
                await getProfile();

            setUser(profile);

        } catch {

            localStorage.removeItem("token");
        }

        setLoading(false);
    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

        window.location.reload();
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loadUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);
