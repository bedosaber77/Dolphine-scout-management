import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  login: async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );
      const result = response.data;
      console.log(response);
      if (response.status === 200) {
        set({ user: result.user, accessToken: result.accessToken });
        return { success: true };
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return { success: false, message: 'كلمة السر خاطئة اعد المحاولة' };
      } else if (err.response && err.response.status === 404) {
        return {
          success: false,
          message: 'لا يوجد حساب مربوط بهذا البريد الالكتروني اعد المحاولة',
        };
      }
      return {
        success: false,
        message: 'عملية تسجيل الدخول فشلت اعد المحاولة',
      };
    }
  },
  register: async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/register`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        return { success: true };
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        return {
          success: false,
          message:
            'هذا البريد الالكتروني لديه حساب بالفعل. الرجاء تسجيل الدخول بدلاً من ذلك.',
        };
      }
      return {
        success: false,
        message: 'عملية تسجيل الحساب فشلت اعد المحاولة',
      };
    }
  },

  logout: (onLogout) => {
    set({ user: null, loading: false, accessToken: null }); //needs to be a fetch also
    try {
      axios.post(
        `${import.meta.env.VITE_BASEURL}/api/auth/logout`,
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
        `${import.meta.env.VITE_BASEURL}/api/auth/refreshToken`,
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
        // await fetchUserDetailsloc(result.user.User_ID);
      } else {
        set({ user: null, accessToken: null, loading: false });
      }
    } catch (err) {
      console.error(err);
      set({ user: null, accessToken: null, loading: false });
    }
  },
  fetchUserDetails: async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/${userId}`,
        {
          headers: {
            accessToken: useAuthStore.getState().accessToken,
          },
        }
      );
      const result = response.data;
      const { password, ...res } = result;
      console.log(response);
      if (response.status === 200) {
        useAuthStore.setState({ user: res });
      }
    } catch (err) {
      console.error(err);
    }
  },
}));

// const fetchUserDetailsloc = async (userId) => {
//   try {
//     const response = await axios.get(
//       `${import.meta.env.VITE_BASEURL}/api/users/${userId}`,
//       {
//         headers: {
//           accessToken: useAuthStore.getState().accessToken,
//         },
//       }
//     );
//     const result = response.data;
//     const { password, ...res } = result;
//     console.log(response);
//     if (response.status === 200) {
//       useAuthStore.setState({ user: res });
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

useAuthStore.subscribe((state) => console.log('State changed:', state));

export default useAuthStore;
