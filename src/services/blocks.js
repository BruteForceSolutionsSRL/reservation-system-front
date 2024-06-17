const url = import.meta.env.VITE_REACT_API_URL;

export function getBlocks() {
  let responseFetch = {};
  let token = localStorage.getItem("token");
  return fetch(url + `blocks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
  })
    .then((response) => {
      responseFetch.status = response.status;
      return response.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    })
    .catch((err) => {
      responseFetch.status = 500;
      responseFetch.data = [];
      return responseFetch;
    });
}

export function getStadisticsBlock(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `blocks/${id}/statistics`, {
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
export function deleteBlock(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `blocks/${id}`, {
    method: "DELETE",
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

export function setBlock(block_id, blockEdited) {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return fetch(url + `blocks/${block_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify(blockEdited),
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
