import { useEffect, useState } from "react";
import ReservationInformation from "../ReservationInformation/ReservationInformation";
import Spinner from "react-bootstrap/Spinner";
export default function RequestsList() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [reservations, setReservations] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);
  const [refusedList, setRefusedList] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [cancelList, setCancelList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(URL + "reservations")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations]);

  const filterReservations = () => {
    const accepted = [];
    const refused = [];
    const waiting = [];
    const cancel = [];

    reservations.forEach((element) => {
      if (element.reservationStatus.id === 1) {
        accepted.push(element);
      } else if (element.reservationStatus.id === 2) {
        refused.push(element);
      } else if (element.reservationStatus.id === 3) {
        waiting.push(element);
      } else {
        cancel.push(element);
      }
    });

    setAcceptedList(accepted);
    setRefusedList(refused);
    setWaitingList(waiting);
    setCancelList(cancel);
  };

  return (
    <div className="container">
      <h1 className="text-center">Lista de solicitud de reservas</h1>
      <div className="row text-center pt-3">
        <div className="col-sm-auto">
          <i>#</i>
        </div>
        <div className="col-3">
          <i>Ambiente(s)</i>
        </div>
        <div className="col-5">
          <i>Docente(s)</i>
        </div>
        <div className="col-sm-auto">
          <i>Periodos</i>
        </div>
        <div className="col-sm">
          <i>Fecha de reserva</i>
        </div>
      </div>
      <hr />
      {loading === true ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {waitingList.map((element) => {
            return (
              <div key={element.id}>
                <ReservationInformation {...element} />
              </div>
            );
          })}
          {cancelList.map((element) => {
            return (
              <div key={element.id}>
                <ReservationInformation {...element} />
              </div>
            );
          })}
          {refusedList.map((element) => {
            return (
              <div key={element.id}>
                <ReservationInformation {...element} />
              </div>
            );
          })}
          {acceptedList.map((element) => {
            return (
              <div key={element.id}>
                <ReservationInformation {...element} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
