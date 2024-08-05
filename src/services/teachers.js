const url = import.meta.env.VITE_REACT_API_URL;

export function getTeachersBySubject(idSubject) {
  let token = localStorage.getItem("token");
  return fetch(url + `teacher-subjects/subject/${idSubject}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeachers() {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + `users/teachers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
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

export function getUsers() {
  let responseFetch = {};
  return fetch(url + `users`, {
    headers: {
      "Content-Type": "aplication/json",
    },
  })
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
