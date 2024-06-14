const URL = import.meta.env.VITE_REACT_API_URL;

export async function getClassrooms() {
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return await fetch(URL + "classrooms?status=ALL", {
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
  })
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
  let token = localStorage.getItem("token");
  let responseFetch = {};
  return await fetch(URL + "classrooms/stats", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    mode: "no-cors",
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
