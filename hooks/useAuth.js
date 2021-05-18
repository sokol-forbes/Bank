import { setCookie, destroyCookie } from "nookies";
import { useRouter } from 'next/router';
import useMessage from "./useMessage";
import useGlobalState from "./useGlobalState";
import useHttp from "./useHttp";

const useAuth = () => {
  const router = useRouter();
  const { setSuccess, setError } = useMessage();
  const [__, dispatch] = useGlobalState();
  const { request } = useHttp();

  const login = async (fields) => {
    try {
      const { user, message } = await request('/api/auth/login', 'POST', fields);
      setCookie(null, process.env.COOKIES_STORAGE_NAME, JSON.stringify({ ...user, isAuthenticated: true }), { path: '/' });
      dispatch({ type: 'LOGIN', user });
      setSuccess(message);
    } catch (e) {
      setError(e.message);
    }
  };

  const logout = () => {
    try {
      destroyCookie(null, process.env.COOKIES_STORAGE_NAME, { path: '/' });
      dispatch({ type: 'LOGOUT' });
      setSuccess('Вы успешно вышли из аккаунта');
    } catch (e) {
      setError(e.message);
    }
  };

  const register = async (fields) => {
    try {
      const data = await request('/api/auth/register', 'POST', fields);
      setSuccess(data.message);
    } catch (e) {
      setError(e.message);
    }
  };

  return { login, logout, register };
};

export default useAuth;