const url = import.meta.env.VITE_REACT_API_URL;

export function getRequests() {
  return fetch(url + "reservations-history")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getTeacherRequests() {
  let userInformation = JSON.parse(sessionStorage.getItem("userInformation"));
  return fetch(
    url + `reservations-history/teacher/${userInformation.teacher_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getReservationsPerClassrooms(id) {
  return fetch(url + `reservations/classroom/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
