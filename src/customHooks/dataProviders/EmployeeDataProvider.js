import React, { createContext, useState } from "react";

export const EmployeeDataContext = createContext();

const EmployeeDataProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState(null);
  return (
    <EmployeeDataContext.Provider value={{ employeeData, setEmployeeData }}>
      {children}
    </EmployeeDataContext.Provider>
  );
};

export default EmployeeDataProvider;
