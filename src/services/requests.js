const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  let token = localStorage.getItem("token");
  return fetch(url + "reservations/history", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeacherRequests() {
  let token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("userInformation"));
  return fetch(url + `reservations/history/teacher/${user.person_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export async function getListToCancel() {
  let token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("userInformation"));
  let responseFetch = {};
  return fetch(url + `reservations/teacher/${user.person_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch.status = response.status;
      return response.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch.status = 500;
      responseFetch.data = [];
      return responseFetch;
    });
}

export function cancelRequest(reservation_id) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + `reservations/${reservation_id}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch.status = response.status;
      return response.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch.status = 500;
      responseFetch.data = [];
      return responseFetch;
    });
}

export function getReservationsPerClassrooms(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `reservations/classroom/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getRequestsReasons() {
  let token = localStorage.getItem("token");
  return fetch(url + `reservations/reasons`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function sendRequest(request) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "reservations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      let status = response.status;
      responseFetch = { ...responseFetch, status: status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((error) => {
      responseFetch.data = error.message;
      return responseFetch;
    });
}

export function getSingleRequest(request_id) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + `reservations/${request_id}`, {
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
