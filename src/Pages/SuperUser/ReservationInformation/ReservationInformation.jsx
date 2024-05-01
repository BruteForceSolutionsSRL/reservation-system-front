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
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [showRefuseModal, setShowRefuseModal] = useState(false);

  const {
    id,
    numberOfStudents,
    date,
    reason,
    createdAt,
    updatedAt,
    reservationStatus,
    schedule,
    assignment,
    classrooms,
  } = props;

  const handleAcceptModal = () => {
    let url = import.meta.env.VITE_REACT_API_URL;
    fetch(url + "reservation/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          setBg("warning");
          setToastMessage(
            `Ocurrio un problema y no se logró realizar la operacion para la solicitud ${id}`
          );
          setToastIcon("exclamation-triangle");
          new Error("Network response was not ok.");
        } else {
          setBg("success");
          setToastMessage(`Solicitud ${id} aceptada`);
          setToastIcon("check");
          return res.json();
        }
      })
      .then((data) => {
        if (data.message === "Already occupied classroom(s)") {
          setBg("warning");
          setToastMessage(
            `La solicitud ${id} no puede aceptarse por que el aula esta ocupada`
          );
          setToastIcon("times-circle");
        }
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
    setShow(false);
    setShowToast(true);
    setToastMessage("");
    setToastIcon("");
    setBg("");
  };

  const handleRefuseModal = () => {
    setShow(false);
    setShowRefuseModal(true);
  };

  const handleCloseRefuseModal = () => {
    setShowRefuseModal(false);
  };

  const refuseRequest = () => {
    let url = import.meta.env.VITE_REACT_API_URL;
    fetch(url + `reservation/reject/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setToastMessage(`La solicitud ${id} fue rechazada`);
        setBg("danger");
        setShowToast(true);
        setShow(false);
        setShowRefuseModal(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
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
            {assignment.map((teacher) => {
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
            {`Materia: ${assignment[0].universitySubject.name}`}
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
                {assignment.map((teacher, index) => {
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
            <div className="col">
              <h6>Estado de la solicitud</h6>
              <p>
                {reservationStatus.id === 1
                  ? "Aceptado"
                  : reservationStatus.id === 2
                  ? "Rechazado"
                  : reservationStatus.id === 3
                  ? "En espera"
                  : "Cancelado"}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {reservationStatus.id === 3 ? (
            <>
              <Button variant="outline-danger" onClick={handleRefuseModal}>
                Rechazar
              </Button>
              <Button variant="outline-success" onClick={handleAcceptModal}>
                Aceptar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-danger"
                onClick={handleRefuseModal}
                disabled
              >
                Rechazar
              </Button>
              <Button
                variant="outline-success"
                onClick={handleAcceptModal}
                disabled
              >
                Aceptar
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal for refuse request */}
      <Modal
        show={showRefuseModal}
        onHide={handleCloseRefuseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Esta seguro de rechazar la solicitud?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={refuseRequest}>
            Aceptar y Rechazar
          </Button>
          {/* <Button variant="primary" onClick={handleSugerir}>
            Sugerir
          </Button> */}
        </Modal.Footer>
      </Modal>

      {/* Toast message to superuser */}
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
            <i className={`fal fa-${toastIcon}`} style={{ color: "white" }}></i>{" "}
            <i style={{ color: "white" }}>{toastMessage}</i>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
