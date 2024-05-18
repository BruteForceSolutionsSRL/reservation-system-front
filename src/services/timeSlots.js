const url = import.meta.env.VITE_REACT_API_URL;

export function getTimeSlots() {
  return fetch(url + `timeslots`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
