const url = import.meta.env.VITE_REACT_API_URL;

export function getClassroomsByBlock(id) {
  return fetch(url + `classrooms/block/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getSuggestsClassrooms(dataSugg) {
  return fetch(url + "reservation/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataSugg),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
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
