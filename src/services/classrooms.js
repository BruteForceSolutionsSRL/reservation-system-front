const url = import.meta.env.VITE_REACT_API_URL;

export function getClassroomsByBlock(id) {
  return fetch(url + `classrooms/block/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
