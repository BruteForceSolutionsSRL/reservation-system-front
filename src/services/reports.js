const url = import.meta.env.VITE_REACT_API_URL;

export function generateReport(request) {
  return fetch(url + "reservations/reports?"
        + new URLSearchParams(request))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

