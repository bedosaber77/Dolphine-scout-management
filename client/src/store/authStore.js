import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  login: async (data, onLogin) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        data,
        {
          withCredentials: true,
        }
      );
      const result = response.data;
      console.log(response);
      if (response.status === 200) {
        set({ user: result.user, accessToken: result.accessToken });

        onLogin('/');
      }
    } catch (err) {
      console.error(err);
    }
  },
  register: async (data, onRegister) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        data,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      // const result = response.data;
      if (response.status === 201) {
        onRegister('/');
      }
    } catch (err) {
      console.error(err);
    }
  },
  logout: (onLogout) => {
    set({ user: null, loading: false, accessToken: null }); //needs to be a fetch also
    try {
      axios.post(
        'http://localhost:3000/api/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
    set({ user: null, loading: false, accessToken: null }); //needs to be a fetch also
    onLogout('/login');
  },
  refreshAccessToken: async () => {
    set({ loading: true });
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/refreshToken',
        {},
        {
          withCredentials: true,
        }
      );
      console.log('Response from refresh token:', response);
      const result = response.data;
      if (response.status === 200) {
        set({
          accessToken: result.accessToken,
          user: result.user,
          loading: false,
        });

        //await fetchUserDetails(result.user.id);
      } else {
        set({ user: null, accessToken: null, loading: false });
      }
    } catch (err) {
      console.error(err);
      set({ user: null, accessToken: null, loading: false });
    }
  },
}));

const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/${userId}`,
      {
        headers: {
          accessToken: useAuthStore.getState().accessToken,
        },
      }
    );
    const result = response.data;
    console.log(response);
    if (response.status === 200) {
      useAuthStore.setState({ user: result });
    }
  } catch (err) {
    console.error(err);
  }
};

useAuthStore.subscribe((state) => console.log('State changed:', state));

export default useAuthStore;
