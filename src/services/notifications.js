const url = import.meta.env.VITE_REACT_API_URL;

export function getUserNotifications() {
  let responseFetch = {};
  let token = localStorage.getItem("token");

  return fetch(url + `notifications/inbox`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch = { status: 500, data: [] };
      return responseFetch;
    });
}

export function getSingleNotification(notification_id) {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `notifications/inbox/${notification_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch = { status: 500, data: {} };
      return responseFetch;
    });
}

export function sendNotification(content) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + `notifications/send/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(content),
  })
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch = { status: 500, data: { message: "Error inesperado" } };
      return responseFetch;
    });
}
