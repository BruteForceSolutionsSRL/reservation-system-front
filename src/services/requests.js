const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  return fetch(url + "reservations")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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
