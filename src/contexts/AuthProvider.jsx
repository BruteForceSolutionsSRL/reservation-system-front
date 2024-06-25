import React, { createContext, useContext, useState } from "react";
import { logoutUser } from "../services/login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    let { status, data } = await logoutUser();
    // if (status >= 200 && status < 300) {
    localStorage.removeItem("token");
    localStorage.removeItem("userInformation");
    setUser(null);
    // } else if (
    //   (status >= 300 && status < 400) ||
    //   (status >= 400 && status < 500)
    // ) {
    //   console.log(status, data);

    // }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
