const url = import.meta.env.VITE_REACT_API_URL;

export function getSubjects() {
  let token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInformation"));
  return fetch(url + `teacher-subjects/teacher/${user.person_id}`, {
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

export function getAllSubjects() {
  let token = localStorage.getItem("token");
  return fetch(url + "university-subjects", {
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
