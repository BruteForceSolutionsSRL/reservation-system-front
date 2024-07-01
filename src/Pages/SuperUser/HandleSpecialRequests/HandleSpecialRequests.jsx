import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Alert, Button } from "react-bootstrap";
import "./HandleSpecialRequests.css";

function HandleSpecialRequests(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [showModal, setShowModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTextModal, setErrorTextModal] = useState("");
  const [spinnerInModal, setSpinnerInModal] = useState(false);

  const {
    reservation_id,
    quantity,
    time_slot,
    block_name,
    classrooms,
    priority,
    observation,
    reservation_status,
    date_end,
    date_start,
  } = props;
 
  const handleShowModal = () => {
   
    setShowModal(true);
  };

  const handleShowRefuseModal = () => {
    setShowRefuseModal(true);
    setShowModal(false);
  };


  const cancelRequest = async () => {
    setSpinnerInModal(true);
    try {
      let token = localStorage.getItem("token");
      await fetch(URL + `reservations/${reservation_id}/special/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
       
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Esta solicitud ya fue atendida") {
            setShowErrorModal(true);
            setErrorTextModal("La reservacion ya fue anteriormente rechazada.");
          } else {
            props.reload(true);
          }
        })
        .catch((err) => {
          if (err) throw console.error(err);
        })
        .finally(() => setSpinnerInModal(false));
    } catch (error) {
      setSpinnerInModal(false);
      setShowErrorModal(true);
      setErrorTextModal(error);
    }
  };

  return (
    <>
      <div
        className={`row border border-${
          priority ? "danger" : "black"
        } rounded p-2 mb-2 m-0`}
        style={{ minWidth: "400px" }}
      >
        <div className="col-sm-4">
          <div className="">
            <b className="text-primary ">ID: </b>
            <b>{reservation_id}</b>
          </div>
          <div className="">
            <b className="text-primary">ESTADO: </b>
            <b
              className={`text-light rounded p-1 ${
                reservation_status === "ACEPTADO" ? "bg-success" : "bg-danger"
              }`}
            >
              {reservation_status}
            </b>
          </div>
          <div>
            <b className="text-primary">MOTIVO DE RESERVA: </b>
            <b>{observation}</b>
          </div>
        </div>
        <div className="col-sm-4">
          <div>
            <b className="text-primary">BLOQUE: </b>
            <b>{block_name}</b>
          </div>
          <div>
            <b className="text-primary">FECHA DE RESERVA(S): </b>
            <div className="fw-bold">
              {date_start} - {date_end}
            </div>
          </div>
        </div>
        <div className="col-sm-2">
          <div>
            <b className="text-primary">PERIODOS: </b>
            <div className="fw-bold">
              {time_slot[0]} - {time_slot[1]}
            </div>
          </div>
        </div>
        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={handleShowModal}
          >
            Cancelar reserva
          </Button>
        </div>
      </div>

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
            <h3>INFORMACIÓN DE RESERVA</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="pb-3">
              <b>MOTIVO DE RESERVA: </b> {observation}
            </div>
            <div className="pb-3">
              <b className="">ESTADO: </b>
              <b
                className={`text-light rounded p-1 ${
                  reservation_status === "ACEPTADO" ? "bg-success" : "bg-danger"
                }`}
              >
                {reservation_status}
              </b>
            </div>
            <div className="tag-container mb-3 mt-2">
              <label className="tag-label">AMBIENTE</label>

              <div className="pt-2 pb-2">
                <b>BLOQUE: </b> {block_name}
              </div>

              <div className="row">
                <div className="">
                  <b>AULAS RESERVAS:</b>
                </div>
                <div className="m-3">
                  {classrooms.length === 0 ? (
                    <div className="text-center">
                      <h4 className="text-danger">
                        El BLOQUE no tiene ambientes reservados.
                      </h4>
                    </div>
                  ) : (
                    <div
                      className="d-flex flex-wrap gap-1"
                      style={{ maxHeight: "120px", overflowY: "auto" }}
                    >
                      {classrooms.map((each) => {
                        return (
                          <div
                            key={each.classroom_id}
                            className="p-1 text-light rounded bg-secondary text-center"
                            style={{ minWidth: "80px", margin: "3px" }}
                          >
                            {each.classroom_name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pb-3">
              <b>FECHAS DE RESERVA: </b> {date_start} - {date_end}
            </div>
            <div className="pb-3">
              <b>PERIODOS: </b> {time_slot[0]}-{time_slot[1]}
            </div>

            <div className="pb-3">
              <b>CANTIDAD DE ESTUDIANTES: </b>
              {quantity}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={handleShowRefuseModal}
          >
            Cancelar reserva
          </Button>
          <Button
            variant="secondary"
            className="custom-btn-gray-outline"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Atras
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal
        show={showRefuseModal}
        onHide={() => setShowRefuseModal(false)}
        dialogClassName="modal-90w"
        centered={true}
        aria-labelledby="refuseModal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="refuseModal">¡Advertencia!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Está seguro cancelar la reserva?</div>
        </Modal.Body>
        <Modal.Footer>
          {spinnerInModal === true ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            ""
          )}

          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={cancelRequest}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            className="custom-btn-gray-outline"
            onClick={() => {
              setShowModal(true);
              setShowRefuseModal(false);
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        dialogClassName="modal-90w"
        size="sm"
        centered={true}
        aria-labelledby="errorModal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="errorModal">Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-2">{errorTextModal}</div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setShowErrorModal(false);
              props.reload(true);
            }}
          >
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HandleSpecialRequests;
