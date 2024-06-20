import { useEffect, useState } from "react";
import ElementCancel from "./ElementCancel";
import { getListToCancel } from "../../../services/requests";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";

export default function ListCancel() {
  const [reservations, setReservations] = useState([]);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reload) {
      reloadPage();
    }
  }, [reload]);

  const reloadPage = () => {
    getReservationsList();
    setReload(false);
  };

  const getReservationsList = async () => {
    let { status, data } = await getListToCancel().finally(() => {
      setReload(false);
      setLoading(false);
    });
    if (status >= 200 && status < 300) {
      let filteredList = data.filter(
        (each) =>
          each.reservation_status !== "CANCELADO" &&
          each.reservation_status !== "RECHAZADO"
      );
      setReservations(filteredList);
    } else if (status >= 300 && status < 400 && status >= 400 && status < 500) {
      setMessage(data.message);
    } else if (status >= 500) {
      setMessage("Ocurrio un error inesperado, intente nuevamente.");
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="container">
          <h1 className="text-center pb-3">Lista de solicitudes</h1>
          <div className="overflow-y-auto overflow-x-auto">
            {reservations.length > 0 ? (
              <>
                {reservations.map((each) => {
                  return (
                    <div key={each.reservation_id}>
                      <ElementCancel
                        {...each}
                        reload={(value) => setReload(value)}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
