import RequestInformation from "../ReservationInfo/RequestInformation";
import { reservations } from "./ReservationList.mocks";
export default function ReservationList() {
  const waitingList = [];
  const acceptedList = [];
  const refusedList = [];

  reservations.map((element) => {
    if (element.state === -1) {
      waitingList.push(element);
    } else if (element.state === 1) {
      acceptedList.push(element);
    } else {
      refusedList.push(element);
    }
  });
  return (
    <>
      {<h1>{waitingList.length > 0 ? "Solicitudes en espera" : ""}</h1>}
      {waitingList.map((element) => {
        return (
          <div key={element.resevationId}>
            <RequestInformation {...element} key={element.resevationId} />
          </div>
        );
      })}
      {<h1>{acceptedList.length > 0 ? "Solicitudes aceptadas" : ""}</h1>}
      {acceptedList.map((element) => {
        return (
          <div key={element.resevationId}>
            <RequestInformation {...element} key={element.resevationId} />
          </div>
        );
      })}
      {<h1>{refusedList.length > 0 ? "Solicitudes rechazadas" : ""}</h1>}
      {refusedList.map((element) => {
        return (
          <div key={element.resevationId}>
            <RequestInformation {...element} key={element.resevationId} />
          </div>
        );
      })}
    </>
  );
}
