import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import Modal from "react-bootstrap/Modal";

export default function ElementCancel(props) {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [open, setOpen] = useState(false);
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
    await fetch(URL + `reservation/cancel/${reservation_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setShow(false);
        props.reload(true);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };
  return (
    <>
      <div className="container-sm border rounded border-dark mb-3">
        <div className="row" style={{ minWidth: "470px" }}>
          <div className="col-6">
            <b className="text-success">MATERIA</b>
            <div>{subject_name}</div>
          </div>
          <div className="col-2">
            <b className="text-success">FECHA</b>
            <div>{reservation_date}</div>
          </div>
          <div className="col-2">
            <b className="text-success">PERIODOS</b>
            <div>
              {time_slot[0]}-{time_slot[1]}
            </div>
          </div>
          <div className="col-2">
            <button
              className="btn btn-outline-primary text-center"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              +
            </button>
          </div>
        </div>
        <div>
          <Collapse in={open}>
            <div id="example-collapse-text" className="">
              <div>
                <b className="text-success">Docente(s)</b>{" "}
                {groups.map((teacher) => {
                  return teacher.teacher_name + ", ";
                })}
              </div>
              <div className="row">
                <div className="col">
                  <b className="text-success">Cantidad de estudiantes: </b>{" "}
                  {quantity}
                </div>
                <div className="col">
                  <b className="text-success">Motivo de reserva: </b>{" "}
                  {reason_name}
                </div>
              </div>
              <div>
                <b className="text-success">Ambiente(s)</b>{" "}
                {classrooms.map((classroom) => {
                  return classroom.classroom_name + ", ";
                })}
              </div>
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => setShow(true)}
                >
                  Cancelar solicitud
                </button>
              </div>
            </div>
          </Collapse>
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
          <button className="btn btn-outline-secondary">Cancelar</button>
          <button className="btn btn-outline-danger" onClick={cancelRequest}>
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
