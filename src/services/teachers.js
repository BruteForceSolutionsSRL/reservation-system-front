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

export async function editarRol(personID) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  try {
    const response = await fetch(url + `users/${personID}/assignRoles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      //1-> encargado, 2 -> docente
      body: JSON.stringify({ role_ids: [2] }),
    });
    responseFetch.status = response.status;
    const data = await response.json();
    responseFetch.data = data;
  } catch (err) {
    console.error(err);
    responseFetch = { status: 500, data: [] };
  }
  return responseFetch;
}
