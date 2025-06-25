import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
import {USERS_URL} from "../config";
import type {User} from "../types/User";


type LoginInputs = {
  email: string;
  password: string;
};
type AuthContextType = {
  currentUser: User | null;
  login: (inputs: LoginInputs) => Promise<void>;
  logout: () => Promise<void>;
  authenticated: boolean;
};
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [authenticated, setAuthenticated] = useState<boolean>(
    localStorage.getItem("authenticated") === "true"
  );

 const login = async (inputs: LoginInputs) => {
    const res = await axios.post(USERS_URL + "veifyLogin", inputs);
    setCurrentUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
    setAuthenticated(true);
    localStorage.setItem("authenticated", "true");
  };
  
  const logout = async () => {
    alert("doriti sa va delogati?");
    await axios.post(USERS_URL + "logout");
    setAuthenticated(false);
    localStorage.setItem("authenticated", "false");
    setCurrentUser(null);
    localStorage.setItem("user", "null");
  };

  useEffect(() => {
    if (currentUser != null) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      setAuthenticated(true);
      localStorage.setItem("authenticated", "true");
    } else {
      localStorage.setItem("user", "null");
      setAuthenticated(false);
      localStorage.setItem("authenticated", "false");
    }
  }, [currentUser]);
  return (
    <AuthContext.Provider value={{ currentUser, login, logout, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};