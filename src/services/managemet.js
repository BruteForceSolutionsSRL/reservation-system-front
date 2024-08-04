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