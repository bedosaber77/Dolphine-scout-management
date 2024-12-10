import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useCallback } from 'react';

const useApi = () => {
  const { accessToken, refreshAccessToken, logout } = useAuthStore();

  return useCallback(
    async (config) => {
      if (!accessToken) {
        await refreshAccessToken();
      }

      if (!accessToken) {
        logout();
        return;
      }

      config.headers = {
        ...config.headers,
        accessToken: accessToken,
      };

      try {
        const response = await axios(config);
        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          await refreshAccessToken();
          if (!accessToken) {
            logout();
          } else {
            config.headers.accessToken = accessToken;
            return axios(config);
          }
        } else {
          throw error;
        }
      }
    },
    [accessToken, refreshAccessToken, logout]
  );
};

export default useApi;
