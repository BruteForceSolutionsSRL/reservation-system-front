const url = import.meta.env.VITE_REACT_API_URL;

export function getReservationStatuses() {
  return fetch(url + `reservations/statuses`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
