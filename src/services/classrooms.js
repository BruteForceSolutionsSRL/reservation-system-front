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
