// src/App.js

import { CssBaseline } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "../src/gateway/Router";
import EmployeeDataProvider from "./customHooks/dataProviders/EmployeeDataProvider";
import UserManagentProvider from "./customHooks/dataProviders/UserManagementProvider";
import { useLoaderContext } from "./customHooks/loading/LoaderContext";
import { setupInterceptors } from "./service/interceptor/useAxiosInterceptors";
function App() {
  const { setLoading } = useLoaderContext();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);
  return (
    <>
      <CssBaseline />
      <EmployeeDataProvider>
        <UserManagentProvider>
          <Router basename="/">
            <div className="App">
              <Routing />
            </div>
          </Router>
        </UserManagentProvider>
      </EmployeeDataProvider>
    </>
  );
}

export default App;
