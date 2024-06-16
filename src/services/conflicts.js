const url = import.meta.env.VITE_REACT_API_URL;

export function getConflicts(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `reservations/${id}/conflicts`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
