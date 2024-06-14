const url = import.meta.env.VITE_REACT_API_URL;

export function getUserNotifications() {
  let responseFetch = {};
  let token = localStorage.getItem("token");

  return fetch(url + `notifications/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
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
    headers: { Authorization: `Bearer ${token}` },
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

export function sendNotification(person_id, content) {
  let responseFetch = {};
  return fetch(url + `notifications/send/${person_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
