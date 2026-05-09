import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(() => localStorage.getItem('token'));
  const [user,     setUser]     = useState(() => localStorage.getItem('user'));
  const [fullName, setFullName] = useState(() => localStorage.getItem('fullName'));

  const login = useCallback(async (username, password) => {
    const res  = await authApi.login({ username, password });
    const data = res.data;
    localStorage.setItem('token',    data.token);
    localStorage.setItem('user',     data.username);
    localStorage.setItem('fullName', data.fullName);
    setToken(data.token);
    setUser(data.username);
    setFullName(data.fullName);
  }, []);

  const register = useCallback(async (fullName, username, email, password) => {
    const res  = await authApi.register({ fullName, username, email, password });
    const data = res.data;
    localStorage.setItem('token',    data.token);
    localStorage.setItem('user',     data.username);
    localStorage.setItem('fullName', data.fullName);
    setToken(data.token);
    setUser(data.username);
    setFullName(data.fullName);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('fullName');
    setToken(null);
    setUser(null);
    setFullName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, fullName, login, register, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
