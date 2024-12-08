// import { useContext, createContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const state = localStorage.getItem('isAuth');
//     return state === 'true';
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     const savedAuth = localStorage.getItem('isAuth') === 'true';
//     setUser(savedUser ? JSON.parse(savedUser) : null);
//     setIsAuthenticated(savedAuth);
//     setIsLoading(false); // Mark as loaded
//   }, []);

//   const loginAction = async (data, onLogin) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/auth/login',
//         data,
//         {
//           withCredentials: true,
//         }
//       );
//       const result = response.data;
//       console.log(response);
//       console.log(result);
//       if (response.status == 200) {
//         console.log(result);
//         setUser(result.user);
//         setIsAuthenticated(true);
//         localStorage.setItem('user', JSON.stringify(result.user));
//         localStorage.setItem('isAuth', true);
//         onLogin('/home');
//         return;
//       }
//       throw new Error(result.message);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const registerAction = async (data, onRegitster) => {
//     try {
//       const response = await axios.post(
//         'http://localhost:3000/api/auth/register',
//         data,
//         {
//           withCredentials: true,
//         }
//       );
//       const result = response.data;
//       console.log(response);
//       console.log(result);
//       if (response.status == 200) {
//         console.log(result);
//         setUser(result.user);
//         setIsAuthenticated(true);
//         localStorage.setItem('user', JSON.stringify(result.user));
//         localStorage.setItem('isAuth', true);
//         onRegitster('/home');
//         return;
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const logOut = (onLogout) => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('user');
//     localStorage.removeItem('isAuth');
//     onLogout('/login');
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         isLoading,
//         user,
//         loginAction,
//         registerAction,
//         logOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export default AuthProvider;

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// AuthProvider.propTypes = {
//   children: PropTypes.element,
// };
