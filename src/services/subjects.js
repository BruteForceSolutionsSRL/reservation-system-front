const url = import.meta.env.VITE_REACT_API_URL;

export default function getSubjects() {
  return fetch(url + `subjects/teacher/${2}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
