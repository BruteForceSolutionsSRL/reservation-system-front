import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { Alert, Button } from "react-bootstrap";
import "./AttentionRequest.css";

export default function AttentionRequest(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [showModal, setShowModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [reasonText, setReasonText] = useState(
    "Su solicitud de reserva fue rechazada, contacte con el administrador para mas informacion."
  );
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTextModal, setErrorTextModal] = useState("");
  const [spinnerInModal, setSpinnerInModal] = useState(false);
  const [conflicts, setConflicts] = useState({
    quantity: "",
    classroom: {
      message: "",
      list: ["", ""],
    },
  });

  const {
    reservation_id,
    subject_name,
    quantity,
    reservation_date,
    time_slot,
    groups,
    block_name,
    classrooms,
    reason_name,
    priority,
  } = props;

  const conflictsFetch = async () => {
    try {
      if (conflicts) {
        let token = localStorage.getItem("token");
        await fetch(URL + `reservations/${reservation_id}/conflicts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setConflicts(data);
          })
          .catch((err) => {
            if (err) throw console.error(err);
          });
      }
    } catch (error) {
      console.error(error);
      setConflicts({
        quantity: "",
        classroom: {
          message: "",
          list: [],
        },
        teacher: {
          message: "",
          list: [],
        },
      });
    }
  };

  const handleShowModal = () => {
    conflictsFetch();
    setShowModal(true);
  };

  const handleShowRefuseModal = () => {
    setShowRefuseModal(true);
    setShowModal(false);
  };

  const handleChangeReasonText = (e) => {
    setReasonText(e.target.value);
  };

  const acceptRequest = async () => {
    setSpinnerInModal(true);
    let token = localStorage.getItem("token");
    await fetch(URL + `reservations/${reservation_id}/assign`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setShowErrorModal(true);
          setErrorTextModal(data.message);
          if (
            data.message ===
            "La solicitud no puede aceptarse, existen ambientes ocupados"
          ) {
            refuseRequest();
          }
        } else {
          props.reload(true);
        }
      })
      .catch((err) => {
        if (err) throw console.error(err);
      })
      .finally(() => {
        setSpinnerInModal(false);
        setShowAcceptModal(false);
      });
  };

  const refuseRequest = async () => {
    setSpinnerInModal(true);
    try {
      let token = localStorage.getItem("token");
      await fetch(URL + `reservations/${reservation_id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({ message: reasonText }),
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
        className="row border border-black rounded p-2 mb-2"
        style={{ minWidth: "400px" }}
      >
        <div className="col-sm-5">
          <div className="">
            <b className="text-primary ">ID: </b>
            <b>{reservation_id}</b>
          </div>
          <div>
            <b className="text-primary">MATERIAS(S): </b>
            <b>{subject_name}</b>
          </div>
        </div>
        <div className="col-sm-3">
          <div>
            <b className="text-primary">CAPACIDAD DE ESTUDIANTES: </b>
            <b>{quantity}</b>
          </div>
          <div>
            <b className="text-primary">FECHA DE RESERVA: </b>
            <b>{reservation_date}</b>
          </div>
        </div>
        <div className="col-sm-2">
          <div>
            <b className="text-primary">PERIODOS: </b>
            <b>
              {time_slot[0]} - {time_slot[1]}
            </b>
          </div>
        </div>
        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <Button
            variant="primary"
            className="custom-btn-primary-outline text-truncate"
            onClick={handleShowModal}
          >
            Atender
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
            <h3>ATENCION DE LA SOLICITUD</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="pb-3">
              <b>MATERIA: </b> {subject_name}
            </div>

            <div className="tag-container mb-3">
              <label className="tag-label">GRUPO</label>
              <div
                className="scrol-teacher-modal h-100 overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
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
              <b>PERIODOS: </b> {time_slot[0]}-{time_slot[1]}
            </div>
            {conflicts.quantity === "" ? (
              ""
            ) : (
              <Alert variant={"warning"}>{conflicts.quantity}</Alert>
            )}
            <div className="pb-3">
              <b>CANTIDAD DE ESTUDIANTES: </b>
              {quantity}
            </div>

            <div className="tag-container mb-3">
              <label className="tag-label">AMBIENTE</label>

              <div className="pt-2 pb-2">
                <b>BLOQUE: </b> {block_name}
              </div>
              {conflicts.classroom.message === "" ? (
                ""
              ) : (
                <Alert variant={"warning"}>
                  <div className="text-center">
                    {conflicts.classroom.message}
                  </div>
                  <div>
                    {conflicts.classroom.list.map((classr, index) => {
                      return <div>{`${index + 1}: ${classr}`}</div>;
                    })}
                  </div>
                </Alert>
              )}
              <div className="row">
                <div className="col-sm-2">
                  <b>AULA(s)</b>
                </div>
                <div
                  className="scrol-teacher-modal col-sm-10 h-100 overflow-y-auto"
                  style={{ maxHeight: "200px" }}
                >
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
          <Button
            variant="success"
            className="custom-btn-green-outline"
            onClick={() => {
              setShowAcceptModal(true);
              setShowModal(false);
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={handleShowRefuseModal}
          >
            Rechazar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        dialogClassName="modal-90w"
        size="lg"
        centered={true}
        aria-labelledby="acceptModal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="acceptModal">¡Confirmacion!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>¿Está seguro de aceptar la solicitud de reserva?</h3>
          {conflicts.quantity === "" ? (
            ""
          ) : conflicts.classroom.message ? (
            ""
          ) : (
            <div className="pt-2 pb-3">
              <span> La solicitud contiene las siguientes advertencias:</span>
            </div>
          )}

          {conflicts.quantity === "" ? (
            ""
          ) : (
            <Alert variant={"warning"}>{conflicts.quantity}</Alert>
          )}
          {conflicts.classroom.message === "" ? (
            ""
          ) : (
            <Alert variant={"warning"}>{conflicts.classroom.message}</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          {spinnerInModal && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          <Button
            variant="success"
            className="custom-btn-green-outline"
            onClick={() => {
              acceptRequest();
            }}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            className="custom-btn-gray-outline"
            onClick={() => {
              setShowAcceptModal(false);
              setShowModal(true);
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRefuseModal}
        onHide={() => setShowRefuseModal(false)}
        dialogClassName="modal-90w"
        size="lg"
        centered={true}
        aria-labelledby="refuseModal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="refuseModal">¡Confirmación de rechazo!</Modal.Title>
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

          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={refuseRequest}
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
