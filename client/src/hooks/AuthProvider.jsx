import { useContext, createContext, useState } from "react";
import PropTypes from 'prop-types';
// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
async function fetchData(url, options) {
    // Simulate different responses based on the URL or request body
    if (url === "api-call") {
        return Promise.resolve({
            json: () =>
                Promise.resolve({
                    success: true,
                    data: { user: { name: "Mock User", id: 1 }, token: "mock-token" },
                }),
        });
    }

    // Simulate an error for other cases
    return Promise.resolve({
        json: () =>
            Promise.resolve({
                success: false,
                message: "Endpoint not found",
            }),
    });
}

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    // const navigate = useNavigate();

    const loginAction = async (data, onLogin) => {
        try {
            const response = await fetchData("api-call", {//mocked through the fetchData function will be replaced by regular fetch
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.data) {
                setUser(result.data.user);
                setToken(result.token);
                localStorage.setItem("site", result.token);
                onLogin('/scoutDashboard');
                return;
            }
            throw new Error(result.message);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = (onLogout) => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        onLogout("/login");
    }


    return (
        <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );


}
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}

AuthProvider.propTypes = {
    children: PropTypes.element,
};
