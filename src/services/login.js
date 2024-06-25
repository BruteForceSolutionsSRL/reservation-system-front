const url = import.meta.env.VITE_REACT_API_URL;

export function loginUser(email, password) {
  let responseFetch = {};
  return fetch(url + "login", {
    method: "POST",
    headers: {
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify({ email, password }),
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

export function logoutUser() {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + "logout", {
    method: "POST",
    headers: {
      "Content-Type": "aplication/json",
      Authorization: `Bearer ${token}`,
    },
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
