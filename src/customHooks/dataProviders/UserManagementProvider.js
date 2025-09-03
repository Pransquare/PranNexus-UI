import React, { createContext, useState } from "react";

export const UserManagentContext = createContext();

const UserManagentProvider = ({ children }) => {
  const [userManagementData, setuserManagementData] = useState(null);
  return (
    <UserManagentContext.Provider
      value={{ userManagementData, setuserManagementData }}
    >
      {children}
    </UserManagentContext.Provider>
  );
};

export default UserManagentProvider;
