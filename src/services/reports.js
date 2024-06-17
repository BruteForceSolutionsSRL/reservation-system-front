const url = import.meta.env.VITE_REACT_API_URL;

export function generateReport(request) {
  let token = localStorage.getItem("token");
  return fetch(url + "reservations/reports?" + new URLSearchParams(request), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}
