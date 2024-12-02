import { useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';
// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
// async function fetchData(url, options) {
//     if (url === "api-call") {
//         return Promise.resolve({
//             json: () =>
//                 Promise.resolve({
//                     success: true,
//                     data: { user: { name: "Mock User", id: 1 }, token: "mock-token" },
//                 }),
//         });
//     }

//     // Simulate an error for other cases
//     return Promise.resolve({
//         json: () =>
//             Promise.resolve({
//                 success: false,
//                 message: "Endpoint not found",
//             }),
//     });
// }

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('site') || '');
  // const navigate = useNavigate();

  const loginAction = async (data, onLogin) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        //mocked through the fetchData function will be replaced by regular fetch
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(response);
      console.log(result);
      if (response.status == 200) {
        console.log(result);
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('site', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
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
    setToken('');
    localStorage.removeItem('site');
    localStorage.removeItem('user');
    onLogout('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.element,
};
