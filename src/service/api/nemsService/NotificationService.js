import axios from "axios";
import { Environment } from "../../../environments/Environment";

export const FetchNotifications = async (employeeId) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/notification/getNotifications/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const MarkNotificationAsRead = async (notificationId, employeeId) => {
  try {
    const notification = notificationId
      ? `notificationId=${notificationId}`
      : "";
    const employee = employeeId ? `employeeId=${employeeId}` : "";
    const response = await axios.put(
      `${Environment.nemsUrl}/notification/markAsRead?${notification}&${employee}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
