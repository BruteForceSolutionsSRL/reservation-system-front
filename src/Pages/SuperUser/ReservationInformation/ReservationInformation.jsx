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
    resevationId,
    asignament,
    teachers,
    groups,
    reason,
    environment,
    reservationDate,
    schedule,
    academicPeriods,
    state,
    capacity,
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
              state === -1
                ? { backgroundColor: "yellow" }
                : state === 0
                ? { background: "red" }
                : { background: "green" }
            }
          ></div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            {environment}
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center">
            {teachers}
          </div>
          <div className="col-sm-auto d-flex justify-content-center align-items-center">
            {schedule}
          </div>
          <div className="col-sm-auto d-flex justify-content-center align-items-center">
            {reservationDate}
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
            <i
              style={{ color: "white" }}
            >{`Solicitud ID: ${resevationId} rechazada`}</i>
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
            {`Materia: ${asignament}`}
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
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>2</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>10</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Felix</td>
                  <td>40</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Felix</td>
                  <td>20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col">
              <h6>Motivo:</h6>
              <p>{reason}</p>
              <h6>Ambiente: </h6>
              <p>{environment}</p>
            </div>
            <div className="col">
              <h6>Fecha de la reserva: </h6>
              <p>{reservationDate}</p>
              <h6>Horario: </h6>
              <p>{schedule}</p>
            </div>
            <div className="col">
              <h6>Periodos academicos: </h6>
              <p>{academicPeriods}</p>
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
