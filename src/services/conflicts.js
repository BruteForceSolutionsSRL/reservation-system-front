const url = import.meta.env.VITE_REACT_API_URL;

export function getConflicts(id) {
  return fetch(url + `reservation/conflicts/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
