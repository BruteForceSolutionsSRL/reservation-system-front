const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  return fetch(url + "reservations")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeacherRequests({ id }) {
  return fetch(url + `all-reservations/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// Talvez esto no deberia estar aqui.
export function getRequestsReasons() {
  return fetch(url + `reservation-reasons`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function sendRequest(request) {
  return fetch(url + "reservation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
