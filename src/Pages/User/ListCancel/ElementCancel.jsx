import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export default function ElementCancel(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [show, setShow] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const {
    reservation_id,
    subject_name,
    quantity,
    reservation_date,
    time_slot,
    persons,
    classrooms,
    reason_name,
  } = props;

  const cancelRequest = async () => {
    setLoadingSpinner(true);
    setTimeout(() => {
      setLoadingSpinner(false);
    }, 2000);

    let token = localStorage.getItem("token");
    await fetch(URL + `reservations/${reservation_id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShow(false);
        props.reload(true);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
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
          <div>
            <b className="text-primary">GRUPOS: </b>
            {persons.map((p, index) => {
              return (
                <b key={index + p.person_id}>{p.name + p.last_name + ", "}</b>
              );
            })}
          </div>
          <div>
            <b className="text-primary">AMBIENTES</b>{" "}
            {classrooms.map((classroom, index) => {
              return (
                <b key={index + classroom.classroom_id}>
                  {classroom.name + ", "}
                </b>
              );
            })}
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
          <div className="col">
            <b className="text-primary">MOTIVO DE RESERVA: </b>{" "}
            <b>{reason_name}</b>
          </div>
        </div>
        <div className="col-sm-2">
          <div>
            <b className="text-primary">PERIODOS: </b>
            <b>{`${time_slot[0]} - ${time_slot[1]}`}</b>
          </div>
        </div>

        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <Button
            variant="danger"
            className="custom-btn-red-outline text-truncate"
            onClick={() => setShow(true)}
          >
            Cancelar solicitud
          </Button>
        </div>
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="request-modal">Solicitud de reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Esta seguro de cancelar la solicitud?</div>
        </Modal.Body>
        <Modal.Footer>
          {loadingSpinner && (
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          <button
            className="btn btn-danger custom-btn-danger-outline"
            onClick={cancelRequest}
          >
            Aceptar
          </button>
          <button
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={() => setShow(false)}
          >
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
