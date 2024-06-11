const url = import.meta.env.VITE_REACT_API_URL;

export function getBlocks() {
  return fetch(url + `blocks`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function setBlock(block_id, blockEdited) {
  let responseFetch = {};
  return fetch(url + `blocks/${block_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
