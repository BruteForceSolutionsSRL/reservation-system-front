const url = import.meta.env.VITE_REACT_API_URL;

export function storeManagement(management) {
    let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "academic-managements/store", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(management),
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

export function getManagements() {
  let token = localStorage.getItem("token");
  return fetch(url + "academic-managements", {
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

export function getFaculties() {
  let token = localStorage.getItem("token");
  return fetch(url + "faculties", {
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

export function setManagement(management_id, managementEdited) { 
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `academic-managements/${management_id}/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(managementEdited),
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

export function storePeriod(period) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "academic-periods/store", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(period),
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

export function getPeriod() {
  let token = localStorage.getItem("token");
  return fetch(url + "academic-periods", {
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

export function setPeriod(period_id, periodEdited) {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `academic-periods/${period_id}/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(periodEdited),
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

export function copyPeriod(period) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + "academic-periods/copy-period", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(period),
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
