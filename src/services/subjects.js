const url = import.meta.env.VITE_REACT_API_URL;

export async function getSubjects() {
  let token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInformation"));
  const response = await fetch(
    url + `teacher-subjects/teacher/${user.person_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    }
  );
  const data = await response.json();
  return { status: response.status, data: data };
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
