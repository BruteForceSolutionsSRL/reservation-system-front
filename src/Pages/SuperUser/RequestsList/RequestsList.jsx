import { reservations } from "../../User/ReservationsList/ReservationList.mocks";
import ReservationInformation from "../ReservationInformation/ReservationInformation";
export default function RequestsList() {
  return (
    <div className="container">
      <h1 className="text-center">Lista de solicitud de reservas</h1>
      <div className="row text-center pt-3">
        <div className="col-sm-auto">
          <i>#</i>
        </div>
        <div className="col-3">
          <i>Ambiente</i>
        </div>

        <div className="col-6">
          <i>Docente(s)</i>
        </div>

        <div className="col-sm-auto">
          <i>Periodos</i>
        </div>
        <div className="col-sm-auto">
          <i>Fecha de reserva</i>
        </div>
      </div>
      <hr />
      {reservations.map((element) => {
        return (
          <div key={element.resevationId}>
            <ReservationInformation {...element} />
          </div>
        );
      })}
    </div>
  );
}
