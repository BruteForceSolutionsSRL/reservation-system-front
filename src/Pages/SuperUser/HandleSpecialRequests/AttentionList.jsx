import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import HandleSpecialRequests from "./HandleSpecialRequests";

export default function AttentionList() {
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [specialRequest, setSpecialRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    listRequest();
  }, [reload]);

  const listRequest = async () => {
    let token = localStorage.getItem("token");
    const fetchData = await fetch(URL + "reservations/special", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
      mode: "cors",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json();
      })
      .then((data) => {
        setSpecialRequest(data);
        setLoading(false);
        setReload(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
    return fetchData;
  };


  console.log("reservas speciales", specialRequest);

  return (
    <div className="container">
      <div>
        <h1 className="text-center mt-2">Solicitudes en curso</h1>
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
      ) : specialRequest.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center">
          <i className="bi bi-check-circle fs-1"></i>
          <b className="text-center fs-2 ps-3">
            No hay solicitudes por atender
          </b>
        </div>
      ) : (
        <div className="container">
          {specialRequest.map((element) => {
            return (
              <div key={element.reservation_id} className="">
                <HandleSpecialRequests
                  {...element}
                  reload={(change) => setReload(change)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
