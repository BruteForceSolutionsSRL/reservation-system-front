const URL = import.meta.env.VITE_REACT_API_URL;

export async function getClassrooms() {
  let responseFetch = {};
  return await fetch(URL + "classrooms?status=ALL")
    .then((res) => {
      responseFetch.status = res.status;
      return res.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    })
    .catch((err) => console.error(err));
}

export async function getDataPerRange(dataBody) {
  let responseFetch = {};
  return fetch(URL + "classrooms/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataBody),
  })
    .then((res) => {
      responseFetch.status = res.status;
      return res.json();
    })
    .then((data) => {
      responseFetch.data = data;
      return responseFetch;
    })
    .catch((err) => {
      console.error(err);
      responseFetch.data = { status: 500, data: [] };
    });
}
