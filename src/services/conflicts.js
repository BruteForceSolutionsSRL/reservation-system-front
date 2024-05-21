const url = import.meta.env.VITE_REACT_API_URL;

export function getConflicts(id) {
  return fetch(url + `reservations/conflicts/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
