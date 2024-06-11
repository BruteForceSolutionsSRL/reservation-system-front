const url = import.meta.env.VITE_REACT_API_URL;

export function getSubjects() {
  return fetch(url + `teacher-subjects/teacher/${2}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getAllSubjects() {
  return fetch(url + 'university-subjects')
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
