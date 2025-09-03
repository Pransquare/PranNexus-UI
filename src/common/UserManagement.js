import { useContext } from "react";
import { UserManagentContext } from "../customHooks/dataProviders/UserManagementProvider";

export const UserManagentCheck = (roleName) => {
  const { userManagementData } = useContext(UserManagentContext);
  if (userManagementData) {
    return userManagementData?.roleNames?.some((data) => data === roleName);
  }
};
