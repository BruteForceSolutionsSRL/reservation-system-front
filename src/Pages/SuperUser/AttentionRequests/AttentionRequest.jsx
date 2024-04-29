import { useEffect, useState } from "react";

// Bootstrap and css imports
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import "./AttentionRequest.css";

export default function AttentionRequest(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;
  // Conflicts state
  const [conflicts, setConflicts] = useState({});
  // Modals states
  const [showModal, setShowModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [reasonText, setReasonText] = useState(
    "Su solicitud de reserva fue rechazada, contacte con el administrador para mas informacion."
  );
  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTextModal, setErrorTextModal] = useState("");

  const [spinnerInModal, setSpinnerInModal] = useState(false);

  let block_name = "Edificio nuevo";
  const {
    reservation_id,
    subject_name,
    quantity,
    reservation_date,
    timeSlot,
    groups,
    // block_name, Este valor falta obtener del endpoint
    classrooms,
    reason_name,
    priority,
    reservation_status,
  } = props;

  // Get conflicts
  useEffect(() => {
    fetch(URL + `resevation/conflicts/${reservation_id}`)
      .then((res) => res.json())
      .then((data) => {
        setConflicts(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  }, []);

  // Handlers modals
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleShowRefuseModal = () => {
    setShowRefuseModal(true);
    setShowModal(false);
  };

  const handlerErrorModal = () => {};

  const handleChangeReasonText = (e) => {
    setReasonText(e.target.value);
  };

  // Accept request
  const acceptRequest = async () => {
    console.log("Accepted");
    await fetch(URL + `reservation/assing/${reservation_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  // Refuse request
  const refuseRequest = async () => {
    console.log("Refused");
    setSpinnerInModal(true);
    await fetch(URL + `reservation/reject/${reservation_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error === "This request has already been rejected") {
          console.log("Already rejected");
          setShowErrorModal(true);
          setErrorTextModal("La reservacion ya fue anteriormente rechazada.");
        }
        setSpinnerInModal(false);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  return (
    <>
      <div className="container  rounded mb-2 mt-1">
        <div className="row border" style={{ minWidth: "470px" }}>
          <div className="col-1">
            <b>{reservation_id}</b>
          </div>
          <div className="col-2">{subject_name}</div>
          <div className="col-2">{quantity}</div>
          <div className="col-3">{reservation_date}</div>
          <div className="col-3">
            {timeSlot[0]} - {timeSlot[1]}
          </div>
          <div className="col-1">
            <button className="btn btn-primary" onClick={handleShowModal}>
              Atender
            </button>
          </div>
        </div>
      </div>

      {/* Attention modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-90w"
        size="lg"
        centered={true}
        aria-labelledby="reservation-info-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="reservation-info-modal">
            <h3>ATENCION DE LA SOLICITUD</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="pb-3">
              <b>MATERIA: </b> {subject_name}
            </div>
            <div className="border p-2">
              <div className="pb-3">
                <b>GRUPO</b>
              </div>
              <div className="table-responsive">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Grupo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((each) => {
                      return (
                        <tr key={each.group_number}>
                          <td>{each.teacher_name}</td>
                          <td>{each.group_number}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="pb-3">
              <b>FECHA DE RESERVA: </b> {reservation_date}
            </div>
            <div className="pb-3">
              <b>PERIODOS: </b> {timeSlot[0]}-{timeSlot[1]}
            </div>
            <div className="pb-3">
              <b>CANTIDAD DE ESTUDIANTES: </b>
              {quantity}
            </div>
            <div className="border p-2">
              <div className="pb-2">
                <b>AMBIENTE</b>
              </div>
              <div className="pt-2 pb-2">
                <b>BLOQUE: </b> {block_name}
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <b>AULA(s)</b>
                </div>
                <div className="col-sm-10">
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Capacidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classrooms.map((each) => {
                        return (
                          <tr key={each.classroom_name}>
                            <td>{each.classroom_name}</td>
                            <td>{each.capacity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="pt-3">
              <b>MOTIVO: </b> {reason_name}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-success" onClick={acceptRequest}>
            Aceptar
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleShowRefuseModal}
          >
            Rechazar
          </button>
        </Modal.Footer>
      </Modal>

      {/* Refuse  modal */}
      <Modal
        show={showRefuseModal}
        onHide={() => setShowRefuseModal(false)}
        dialogClassName="modal-90w"
        size="lg"
        centered={true}
        aria-labelledby="refuseModal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="refuseModal">¡Confirmacion de rechazo!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-2">
            <b>MOTIVO: </b>
          </div>
          <div className="border">
            <textarea
              className="form-control w-100 h-100"
              value={reasonText}
              onChange={(e) => handleChangeReasonText(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {spinnerInModal === true ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            ""
          )}

          <button className="btn btn-outline-danger" onClick={refuseRequest}>
            Aceptar
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setShowModal(true);
              setShowRefuseModal(false);
            }}
          >
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>

      {/* Error modal */}
      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        dialogClassName="modal-90w"
        size="sm"
        centered={true}
        aria-labelledby="errorModal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="errorModal">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-2">
            <b>{errorTextModal}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setShowErrorModal(false);
            }}
          >
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
