const url = import.meta.env.VITE_REACT_API_URL;

export function getTeachersBySubject(idSubject) {
  return fetch(url + `teachers/subject/${idSubject}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
