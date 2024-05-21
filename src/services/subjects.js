const url = import.meta.env.VITE_REACT_API_URL;

export function getSubjects() {
  return fetch(url + `teacher-subjects/teacher/${2}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
