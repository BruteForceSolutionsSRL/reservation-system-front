import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./RequestInformation.css";
export default function RequestInformation(props) {
  const [show, setShow] = useState(false);
  const [color, setColor] = useState("");
  const [stateRequest, setStateRequest] = useState("");

  const {
    id,
    numberOfStudents,
    date,
    reason,
    createdAt,
    updatedAt,
    reservationStatus,
    schedule,
    asignament,
    classrooms,
  } = props;

  useEffect(() => {
    showState();
  }, []);

  const showState = () => {
    switch (reservationStatus.id) {
      case 1:
        setColor("#d1e8a1");
        setStateRequest("Aceptado");
        break;
      case 2:
        setColor("#ffc695");
        setStateRequest("Rechazado");
        break;
      case 3:
        setColor("#feffa7");
        setStateRequest("En espera");
        break;
      case 4:
        setColor("#f5f5f5");
        setStateRequest("Cancelado");
        break;
    }
  };
  return (
    <>
      <div
        className={`rounded border text-center p-3 m-3`}
        id="request-information"
        style={{ background: color }}
      >
        <div className="row p-1">
          <h6 className="d-flex align-items-start  col-3">{`ID: ${id}`}</h6>
          <h3 className="align-self-baseline col-6">
            {asignament[0].universitySubject.name}
          </h3>
        </div>
        <div className="row">
          <h3 className="col-3">{classrooms[0].name}</h3>
          <p className="col-6">{date}</p>
          <h5 className="col">{stateRequest}</h5>
        </div>
        <div className="row">
          <p className="col-12">{schedule[0].time}</p>
          <p className="col-12">{schedule[1].time}</p>
        </div>
        <div className="row">
          <Button variant="btn btn-outline-dark " onClick={() => setShow(true)}>
            Mas informacion
          </Button>
        </div>
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w modal-dialog-scrollable modal-xl"
        aria-labelledby="request-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="request-modal">Solicitud de reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <p>{`Docente(s): ${asignament.map((teacher) => {
                return teacher.teacher.person.name + " ";
              })}`}</p>
              <p>{`Ambiente: ${classrooms.map((room) => {
                return room.name + " ";
              })}`}</p>
              <p>{`Materia: ${asignament[0].universitySubject.name}`}</p>
              <p>{`Motivo: ${reason}`}</p>
            </div>
            <div className="col">
              <p>{`Fecha: ${date}`}</p>
              <p>{`Hora: ${schedule[0].time + "-" + schedule[1].time}`}</p>
              <p>{`Periodos academicos: ${1}`}</p>
              <p>{`Grupo: ${asignament.map((group) => {
                return group.groupNumber + " ";
              })}`}</p>
              <p>{`Cantidad de estudiantes: ${numberOfStudents}`}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
