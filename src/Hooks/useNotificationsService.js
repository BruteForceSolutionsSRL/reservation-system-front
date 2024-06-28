import { useAuth } from "../contexts/AuthProvider";

export function useNotificationsService() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_REACT_API_URL;

  const getUserNotifications = async (abortController) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + "notifications/inbox", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        alert("Sesion expirada");
        logout();
        return;
      }
      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = { status: 500, data: [] };
    }
    return responseFetch;
  };

  const getSingleNotification = async (notification_id, abortController) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(
        url + `notifications/inbox/${notification_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "aplication/json",
          },
          signal: abortController.signal,
        }
      );
      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        alert("Sesion expirada");
        logout();
        return;
      }
      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = { status: 500, data: {} };
    }
    return responseFetch;
  };

  const sendNotification = async (content, abortController) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + `notifications/sendNotification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify(content),
      });
      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        alert("Sesion expirada");
        logout();
        return;
      }
      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = { status: 500, data: { message: "Error inesperado" } };
    }
    return responseFetch;
  };

  return { getUserNotifications, getSingleNotification, sendNotification };
}
