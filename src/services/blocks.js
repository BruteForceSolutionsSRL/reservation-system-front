const url = import.meta.env.VITE_REACT_API_URL;

export function getBlocks() {
  return fetch(url + `blocks`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
