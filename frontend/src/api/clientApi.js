import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true 
});


const getAccessToken = () => Cookies.get('access_token');
const getRefreshToken = () => Cookies.get('refresh_token');
const setTokens = (accessToken, refreshToken) => {
    Cookies.set('access_token', accessToken, { expires: 1 / 24 });
    Cookies.set('refresh_token', refreshToken, { expires: 1 }); 
};
const clearTokens = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
};


const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/refresh', {
            refreshToken: getRefreshToken(),
        }, { withCredentials: true });
        const { access_token, refresh_token } = response.data;
        setTokens(access_token, refresh_token);
        return access_token;
    } catch (error) {
        clearTokens();
        throw new Error('Unable to refresh token');
    }
};

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
