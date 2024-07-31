import { useState } from "react";
import { Button } from "react-bootstrap";
import ModalRequestInformation from "./ModalRequestInformation";
import "./RequestInformations.css";

export default function RequestInformation({ content }) {
  const { subject, reservation_date, periods, quantity_studets, state } =
    content;

  const [show, setShow] = useState(false);

  const modalStateShow = {
    show: show,
    setShow: (change) => setShow(change),
  };

  const handleClickModal = () => {
    setShow(true);
  };

  return (
    <>
      <div
        className="row border border-black rounded py-2 my-2"
        style={{ minWidth: "300px" }}
      >
        <div className="col-md-5">
          <div className="">
            <b className="text-primary ">ESTADO: </b>
            <b
              className={`rounded p-1 text-white ${
                state === "ACEPTADO"
                  ? "bg-success"
                  : state === "RECHAZADO"
                  ? "bg-danger"
                  : state === "CANCELADO"
                  ? "bg-secondary"
                  : "bg-secondary"
              }`}
            >
              {state ?? "Sin estado"}
            </b>
          </div>
          <div>
            <b className="text-primary">MATERIAS(S): </b>
            <b>{subject ?? "Sin materia"}</b>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <b className="text-primary">CAPACIDAD DE ESTUDIANTES: </b>
            <b>{quantity_studets ?? "Sin cantidad"}</b>
          </div>
          <div>
            <b className="text-primary">FECHA DE RESERVA: </b>
            <b>{reservation_date ?? "Sin fecha"}</b>
          </div>
        </div>
        <div className="col-md-2">
          <div>
            <b className="text-primary">PERIODOS: </b>
            <b>{`${periods[0] ?? "Sin horario"} - ${periods[1] ?? ""}`}</b>
          </div>
        </div>
        <div className="col-md-2 align-self-center d-flex justify-content-end">
          <Button
            variant="primary"
            className="mt-1 custom-button btn btn-primary custom-btn-primary-outline text-truncate"
            onClick={handleClickModal}
          >
            Detalles
          </Button>
        </div>
      </div>
      <ModalRequestInformation
        show={modalStateShow.show}
        setShow={(change) => modalStateShow.setShow(change)}
        title="Informacion adicional"
        request={content}
      />
    </>
  );
}
