const url = import.meta.env.VITE_REACT_API_URL;

export function getSubjects() {
  const user = JSON.parse(localStorage.getItem("userInformation"));
  return fetch(url + `teacher-subjects/teacher/${user.person_id}`)
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
