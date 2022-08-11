import { NotificationManager } from "react-notifications";

export const Toast = ({ type = "success", message }) => {
  if (Array.isArray(message)) {
    let item;

    for (item of message) {
      NotificationManager[type](item.message);
    }
  } else {
    NotificationManager[type](message);
  }
};
