import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

import Spinner from "react-bootstrap/Spinner";
import RequestInformation from "../../Components/RequestInformation/RequestInformation";
export default function RequestsHistory() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [loading, setLoading] = useState(false);
  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setAllReservations([]);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(URL + `all-reservations/${2}`);
      const data = await res.json();
      setAllReservations(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Historial de solicitudes</h1>

      <div className="row d-inline-flex justify-content-between">
        <Form.Select
          className="col"
          aria-label="select-input"
          style={{ maxWidth: "200px" }}
        >
          <option value="1">Todo</option>
          <option value="2">Solicitudes aceptadas</option>
          <option value="3">Solicitudes rechazadas</option>
          <option value="4">Solicitudes expiradas</option>
          <option value="5">Solicitudes canceladas</option>
        </Form.Select>
        <div className="col d-inline-flex ">
          <input className="form-control" type="text" placeholder="Buscar..." />
          <i className="fas fa-search"></i>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <div className="container">
          {allReservations.map((each) => {
            let content = {
              id: each.reservation_id,
              subject: each.subject_name,
              groups: each.groups,
              reservation_date: each.reservation_date,
              periods: each.time_slot,
              quantity_studets: each.quantity,
              block: each.block_name,
              classrooms: each.classrooms,
              reason: each.reason_name,
            };
            return (
              <div key={each.reservation_id}>
                <RequestInformation content={content} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
