const url = import.meta.env.VITE_REACT_API_URL;

export function getConflicts(id) {
  return fetch(url + `reservations/${id}/conflicts`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
