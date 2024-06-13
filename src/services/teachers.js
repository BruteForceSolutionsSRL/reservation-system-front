const url = import.meta.env.VITE_REACT_API_URL;

export function getTeachersBySubject(idSubject) {
  return fetch(url + `teacher-subjects/subject/${idSubject}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeachers() {
  let responseFetch = {};
  return fetch(url + `users/teachers`)
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch = { status: 500, data: [] };
      return responseFetch;
    });
}
