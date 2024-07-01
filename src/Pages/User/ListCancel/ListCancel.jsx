import { useEffect, useState } from "react";
import ElementCancel from "./ElementCancel";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

export default function ListCancel() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [reservations, setReservations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reload, setReload] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInformation"));

  useEffect(() => {
    fetchData();
    setReload(false);
    setLoading(true);
  }, [reload]);

  const fetchData = async () => {
    let token = localStorage.getItem("token");
    await fetch(URL + `reservations/teacher/${user.person_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let pending = [];
        let accepted = [];
        data.forEach((element) => {
          if (element.reservation_status === "PENDIENTE") {
            pending.push(element);
          } else if (element.reservation_status === "ACEPTADO") {
            accepted.push(element);
          }
        });
        setRequests(pending);
        setReservations(accepted);
      })
      .finally(() => {
        setLoadingPage(false);
        setLoading(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  return (
    <>
      {loadingPage ? (
        <LoadingSpinner />
      ) : (
        <div className="container mt-2">
          <h1 className="text-center">Lista de solicitudes</h1>
          {loading ? (
            <div
              className="text-center d-flex justify-content-center align-items-center"
              style={{ height: "80vh" }}
            >
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {requests.length > 0 || reservations.length > 0 ? (
                <>
                  <div
                    className="container overflow-x-auto"
                    style={{ minWidth: "470px" }}
                  >
                    {requests.length > 0 && (
                      <>
                        <h3>Pendientes</h3>
                        {requests.map((each) => {
                          if (each.reservation_status === "PENDIENTE") {
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
                      </>
                    )}
                    {reservations.length > 0 && (
                      <>
                        <h3>Aceptadas</h3>
                        {reservations.map((each) => {
                          if (each.reservation_status === "ACEPTADO") {
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
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="fs-3 text-center d-flex justify-content-center align-items-center"
                    style={{ height: "80vh" }}
                  >
                    <div>
                      <div>
                        <i className="bi bi-question-circle fs-1"></i>
                      </div>
                      <div>
                        <span>
                          No hay reservas registradas. ¡Añade una nueva para
                          empezar!
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
