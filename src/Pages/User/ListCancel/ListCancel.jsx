import { useEffect, useState } from "react";
import ElementCancel from "./ElementCancel";

export default function ListCancel() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [reservations, setReservations] = useState([]);
  const [reload, setReload] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInformation"));

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload]);

  const fetchData = async () => {
    let token = localStorage.getItem("token");
    await fetch(URL + `reservations/teacher/${user.person_id}`, {
      headers: { Authorization: `Bearer ${token}` },
      mode: "no-cors",
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  return (
    <div className="container">
      <h1 className="text-center">Lista de solicitudes</h1>
      {reservations.lenght < 1 ? (
        <div className="text-center">
          <b>No tiene solicitudes</b>
        </div>
      ) : (
        <div
          className="container overflow-x-scroll"
          style={{ minWidth: "470px" }}
        >
          <h3>Pendientes</h3>
          {reservations.map((each) => {
            if (each.reservation_status === "PENDING") {
              return (
                <div key={each.reservation_id}>
                  <ElementCancel
                    {...each}
                    reload={(change) => setReload(change)}
                  />
                </div>
              );
            }
          })}
          <h3>Aceptadas</h3>
          {reservations.map((each) => {
            if (each.reservation_status === "ACCEPTED") {
              return (
                <div key={each.reservation_id}>
                  <ElementCancel
                    {...each}
                    reload={(change) => setReload(change)}
                  />
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
