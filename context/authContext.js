import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { getUser } from "../lib/database";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLogin(true);
      } else {
        setUser(null);
        setLogin(false);
      }
    });
    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const data = await getUser(user.uid);
        setCurrentUser(data);
      }
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, setLogin, user, setUser, currentUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
