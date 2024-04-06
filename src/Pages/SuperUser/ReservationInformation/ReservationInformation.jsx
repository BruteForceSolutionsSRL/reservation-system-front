import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import "./ReservationInformation.css";
export default function ReservationInformation(props) {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bg, setBg] = useState("");

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

  const handleAcceptModal = () => {
    setBg("success");
    setShow(false);
    setShowToast(true);
  };
  const handleRefuseModal = () => {
    setBg("danger");
    setShow(false);
    setShowToast(true);
  };

  return (
    <>
      <div
        className="border text-center m-3"
        id="reservation-information-card"
        onClick={() => setShow(true)}
      >
        <div className="row">
          <div
            className="col-sm-auto"
            style={
              reservationStatus.id === 1
                ? { backgroundColor: "green" }
                : reservationStatus.id === 2
                ? { backgroundColor: "red" }
                : reservationStatus.id === 3
                ? { backgroundColor: "yellow" }
                : { backgroundColor: "#f5f5f5" }
            }
          ></div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            {classrooms.map((environment) => {
              return environment.name + " ";
            })}
          </div>
          <div className="col-5 d-flex justify-content-center align-items-center">
            {asignament.map((teacher) => {
              return teacher.teacher.person.name + " ";
            })}
          </div>
          <div className="col-sm-auto d-flex justify-content-center align-items-center">
            {schedule[0].time + " - " + schedule[1].time}
          </div>
          <div className="col-sm-auto d-flex justify-content-center align-items-center">
            {date}
          </div>
        </div>
      </div>

      <ToastContainer
        className="p-3 m-3"
        position="top-end"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          bg={bg}
          autohide
        >
          <Toast.Body>
            <i
              className="fal fa-exclamation-triangle"
              style={{ color: "white" }}
            ></i>{" "}
            <i style={{ color: "white" }}>{`Solicitud ID: ${id} rechazada`}</i>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        size="lg"
        centered={true}
        aria-labelledby="reservation-info-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="reservation-info-modal">
            {`Materia: ${asignament[0].universitySubject.name}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="border scroll-modal mb-3">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Docente</th>
                  <th scope="col">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {asignament.map((teacher, index) => {
                  return (
                    <tr key={teacher.id}>
                      <th scope="row">{++index}</th>
                      <td>{teacher.teacher.person.name}</td>
                      <td>{teacher.groupNumber}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col">
              <h6>Motivo:</h6>
              <p>{reason}</p>
              <h6>Ambiente(s): </h6>
              <p>
                {classrooms.map((environment) => {
                  return <li key={environment.id}>{environment.name}</li>;
                })}
              </p>
            </div>
            <div className="col">
              <h6>Fecha de la reserva: </h6>
              <p>{date}</p>
              <h6>Horario: </h6>
              <p>{schedule[0].time + " - " + schedule[1].time}</p>
            </div>
            <div className="col">
              <h6>Cantidad de estudiantes</h6>
              <p>{numberOfStudents}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleRefuseModal}>
            Rechazar
          </Button>
          <Button variant="outline-success" onClick={handleAcceptModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
