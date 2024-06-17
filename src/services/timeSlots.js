const url = import.meta.env.VITE_REACT_API_URL;

export function getTimeSlots() {
  let token = localStorage.getItem("token");
  return fetch(url + `timeslots`, {
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
