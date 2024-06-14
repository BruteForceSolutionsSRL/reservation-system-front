const url = import.meta.env.VITE_REACT_API_URL;

export function getReservationStatuses() {
  let token = localStorage.getItem("token");
  return fetch(url + `reservations/statuses`, {
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
