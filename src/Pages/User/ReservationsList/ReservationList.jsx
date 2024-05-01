import { useEffect, useState } from "react";
import RequestInformation from "../ReservationInfo/RequestInformation";
export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const waitingList = [];
  const acceptedList = [];
  const refusedList = [];
  const cancelledList = [];
  const URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    fetch(URL + "reservations")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  }, []);

  reservations.map((element) => {
    if (element.reservationStatus.id === 3) {
      waitingList.push(element);
    } else if (element.reservationStatus.id === 1) {
      acceptedList.push(element);
    } else if (element.reservationStatus.id === 2) {
      refusedList.push(element);
    } else {
      cancelledList.push(element);
    }
  });
  return (
    <>
      {<h1>{waitingList.length > 0 ? "Solicitudes en espera" : ""}</h1>}
      {waitingList.map((element) => {
        return (
          <div key={element.id}>
            <RequestInformation {...element} />
          </div>
        );
      })}
      {<h1>{acceptedList.length > 0 ? "Solicitudes aceptadas" : ""}</h1>}
      {acceptedList.map((element) => {
        return (
          <div key={element.id}>
            <RequestInformation {...element} />
          </div>
        );
      })}
      {<h1>{refusedList.length > 0 ? "Solicitudes rechazadas" : ""}</h1>}
      {refusedList.map((element) => {
        return (
          <div key={element.id}>
            <RequestInformation {...element} />
          </div>
        );
      })}
      {<h1>{cancelledList.length > 0 ? "Solicitudes canceladas" : ""}</h1>}
      {cancelledList.map((element) => {
        return (
          <div key={element.id}>
            <RequestInformation {...element} />
          </div>
        );
      })}
    </>
  );
}
