import { useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

export default function ElementCancel(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [show, setShow] = useState(false);
  const {
    reservation_id,
    subject_name,
    quantity,
    reservation_date,
    time_slot,
    groups,
    classrooms,
    reason_name,
  } = props;

  const cancelRequest = async () => {
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
            {groups.map((teacher, index) => {
              return (
                <b key={index + teacher.teacher_name}>
                  {teacher.teacher_name + ", "}
                </b>
              );
            })}
          </div>
          <div>
            <b className="text-primary">AMBIENTES</b>{" "}
            {classrooms.map((classroom, index) => {
              return (
                <b key={index + classroom.classroom_name}>
                  {classroom.classroom_name + ", "}
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
            className="custom-btn-primary-outline text-truncate"
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
        dialogClassName="modal-90w modal-dialog-scrollable modal-sm"
        aria-labelledby="request-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="request-modal">Solicitud de reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Esta seguro de cancelar la solicitud?</div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShow(false)}
          >
            Cancelar
          </button>
          <button className="btn btn-outline-danger" onClick={cancelRequest}>
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
