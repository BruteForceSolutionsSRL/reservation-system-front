const url = import.meta.env.VITE_REACT_API_URL;

export default function login(email, password) {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + "login", {
    method: "POST",
    headers: {
      Authentication: `Bearer ${token}`,
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
