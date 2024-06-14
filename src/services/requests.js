const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  return fetch(url + "reservations/history")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeacherRequests() {
  let user = JSON.parse(localStorage.getItem("userInformation"));
  return fetch(url + `reservations/history/teacher/${user.person_id}`)
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

export function getSingleRequest(request_id) {
  let responseFetch = {};
  return fetch(url + `reservations/${request_id}`)
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => {
      console.log(err);
      responseFetch = { status: 500, data: {} };
      return responseFetch;
    });
}
