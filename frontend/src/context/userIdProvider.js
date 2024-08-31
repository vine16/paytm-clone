import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  return (
    <UserContext.Provider value={{ userId, setUserId, name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
