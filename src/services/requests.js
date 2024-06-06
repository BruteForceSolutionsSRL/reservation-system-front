const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  return fetch(url + "reservations/history")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeacherRequests() {
  let userInformation = JSON.parse(sessionStorage.getItem("userInformation"));
  return fetch(
    url + `reservations/history/teacher/${userInformation.teacher_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getReservationsPerClassrooms(id) {
  return fetch(url + `reservations/classroom/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// Talvez esto no deberia estar aqui.
export function getRequestsReasons() {
  return fetch(url + `reservations/reasons`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function sendRequest(request) {
  let responseFetch = {};
  return fetch(url + "reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
