const url = import.meta.env.VITE_REACT_API_URL;

export function getBlocks() {
  let token = localStorage.getItem("token");
  return fetch(url + `blocks`, {
    headers: { Authorization: `Bearer ${token}`,
    "Content-Type":  "application/json"  },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function getStadisticsBlock(id) {
  let token = localStorage.getItem("token");
  return fetch(url + `blocks/${id}/statistics`, {
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
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
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
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
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
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
