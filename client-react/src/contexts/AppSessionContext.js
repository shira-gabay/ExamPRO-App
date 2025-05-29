import React, { createContext, useContext, useState,useEffect } from "react";

const AppSessionContext = createContext();

export const AppSessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
 useEffect(() => {
  console.log("📌 currentUser:", currentUser);
  console.log("📌 currentSubject:", currentSubject);
}, [currentUser, currentSubject]);
  const clearSession = () => {
    setCurrentUser(null);
    setCurrentSubject(null);
  };

  return (
    <AppSessionContext.Provider
      value={{ currentUser, setCurrentUser, currentSubject, setCurrentSubject, clearSession }}
    >
      {children}
    </AppSessionContext.Provider>
  );
};

export const useAppSession = () => {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error("useAppSession must be used within AppSessionProvider");
  }
  return context;
};
