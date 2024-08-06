import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import AttentionRequest from "./AttentionRequest";
import ConfigModal from "./ConfigModal";

export default function AttentionList() {
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    setLoading(true);
    reloadListt();
  }, [reload]);

  const reloadListt = async () => {
    let token = localStorage.getItem("token");
    const fetchData = await fetch(URL + "reservations/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
        setLoading(false);
        setReload(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
    return fetchData;
  };

  return (
    <div className="container">
      <div>
        <h1 className="text-center mt-2">Atender solicitudes pendientes</h1>
        <div className="d-flex justify-content-end">
          <div className="d-flex align-items-center">
            <div>
              <button className="btn" onClick={() => setShowConfig(true)}>
                <i className="bi bi-gear fs-3"></i>
              </button>
            </div>
            <div>
              <span className="fs-4">Ajustes</span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {loading === true ? (
        <div className="h-50 d-flex align-items-center justify-content-center">
          <div>
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          <div className="ps-2">
            <b className="fs-4">Cargando</b>
          </div>
        </div>
      ) : reservations.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center">
          <i className="bi bi-check-circle fs-1"></i>
          <b className="text-center fs-2 ps-3">
            No tienes mas solicitudes pendientes por atender
          </b>
        </div>
      ) : (
        <div className="container">
          {reservations.map((element) => {
            return (
              <div key={element.reservation_id} className="">
                <AttentionRequest
                  {...element}
                  reload={(change) => setReload(change)}
                />
              </div>
            );
          })}
        </div>
      )}
      <ConfigModal showConfig={showConfig} setShowConfig={setShowConfig} />
    </div>
  );
}
