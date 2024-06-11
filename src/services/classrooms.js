const url = import.meta.env.VITE_REACT_API_URL;

export function getClassroomsByBlock(id) {
  return fetch(url + `classrooms/block/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getSuggestsClassrooms(dataSugg) {
  let responseFetch = {};
  return fetch(url + "classrooms/reservation/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(url + "classrooms/statistics/list")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function deleteEnvironment(environment) {
  return fetch(url + `classroom/delete/${environment}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getStatusBlock() {
  return fetch(url + "classrooms/statuses")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function storeBlock(block) {
  let responseFetch = {};
  return fetch(url + "blocks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
