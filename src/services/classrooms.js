const url = import.meta.env.VITE_REACT_API_URL;

export function getClassrooms() {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "classrooms", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      let status = response.status;
      responseFetch = { ...responseFetch, status: status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    });
}

export function getClassroomsByBlock(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `classrooms/block/${id}?status=ALL`, {
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

export function getSuggestsClassrooms(dataSugg) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "classrooms/reservation/suggest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(dataSugg),
  })
    .then((response) => {
      let status = response.status;
      responseFetch = { ...responseFetch, status: status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    });
}

export function getClassroomsForDeleteList() {
  let token = localStorage.getItem("token");
  return fetch(url + "classrooms/statistics/list", {
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

export function deleteEnvironment(environment) {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `classrooms/delete/${environment}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch.status = response.status;
      return response.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    });
}

export function getStatusClassroms() {
  let token = localStorage.getItem("token");
  return fetch(url + "classrooms/statuses", {
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

export function getClassromsTypes() {
  let token = localStorage.getItem("token");
  return fetch(url + "classrooms/types", {
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

export function getStatusBlock() {
  let token = localStorage.getItem("token");
  return fetch(url + "classrooms/statuses", {
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

export function getEnvironments() {
  let token = localStorage.getItem("token");
  return fetch(url + "classrooms?status=ALL", {
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

export function getBlocks() {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + "blocks", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch.status = response.status;
      return response.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    });
}

export function setEnvironment(classroom_id, environmentEdited) {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `classrooms/${classroom_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(environmentEdited),
  })
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    });
}

export function storeBlock(block) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "blocks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(block),
  })
    .then((response) => {
      responseFetch = { ...responseFetch, status: response.status };
      return response.json();
    })
    .then((data) => {
      responseFetch = { ...responseFetch, data: data };
      return responseFetch;
    })
    .catch((err) => console.error(err));
}

export async function getDisponibleClassrooms(requestData) {
  requestData = { ...requestData, quantity: 0 };
  let token = localStorage.getItem("token");
  let response = await fetch(url + "classrooms/disponible", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(requestData),
  });
  let data = await response.json();
  return { status: response.status, data: data };
}
