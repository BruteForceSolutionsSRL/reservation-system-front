import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { cancelRequest } from "../../../services/requests";
import { Spinner } from "react-bootstrap";

export default function ElementCancel(props) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "Advertencia",
    body: "¿Está seguro de cancelar la solicitud?",
    show: false,
    footer: 0,
  });
  const {
    reservation_id,
    subject_name,
    quantity,
    reservation_date,
    time_slot,
    groups,
    classrooms,
    reason_name,
    reservation_status,
  } = props;

  const requestCancel = async () => {
    setLoading(true);
    let response = await cancelRequest(reservation_id).finally(() => {
      setLoading(false);
    });
    let content = {};
    if (response.status >= 200 && response.status < 300) {
      content.title = "Mensaje";
      content.body = response.data.message;
    } else if (
      (response.status >= 300 && response.status < 400) ||
      (response.status >= 400 && response.status < 500)
    ) {
      content.title = "Error";
      content.body = response.data.message;
    } else if (response.status >= 500) {
      content.title = "Error";
      content.body = "Ocurrió un error inesperado, intente nuevamente.";
    }
    content.show = true;
    content.footer = 1;
    setModalContent(content);
  };

  return (
    <>
      <div className="border border-dark rounded mb-2 p-1">
        <div className="row">
          <div className="col-12 col-lg-10">
            <div className="d-flex flex-column flex-sm-row justify-content-start align-items-start mb-2">
              <span className="badge text-bg-dark w-100 text-truncate">
                {subject_name}
              </span>
              <span
                className={`badge text-bg-${
                  reason_name === "EXAMEN"
                    ? "success"
                    : reason_name === "DEFENSA DE TESIS"
                    ? "danger"
                    : reason_name === "CLASES"
                    ? "secondary"
                    : reason_name === "PRACTICA" && "info text-white"
                }`}
              >
                {reason_name}
              </span>
              <div className="d-flex flex-sm-row align-items-start">
                <b>ESTADO:</b>
                <span
                  className={`text-white badge text-bg-${
                    reservation_status === "PENDIENTE" ? "warning" : "success"
                  }`}
                >
                  {reservation_status}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-2">
              <div>
                <b>FECHA</b> <span>{reservation_date}</span>
              </div>
              <div>
                <b>PERIODOS</b>
                <span>
                  {time_slot[0]}-{time_slot[1]}
                </span>
              </div>
              <div>
                <b className="">CANTIDAD DE ESTUDIANTES</b>
                <span>{quantity}</span>
              </div>
            </div>

            <div className="d-flex flex-wrap mb-2">
              <b className="pe-2">AMBIENTES:</b>
              {classrooms.map((classroom, index) => (
                <span key={index} className="badge text-bg-secondary mx-1 mb-1">
                  {classroom.classroom_name}
                </span>
              ))}
            </div>

            <div className="d-flex flex-wrap mb-2">
              <b className="pe-2">COLABORADORES:</b>
              {groups.map((teacher, index) => (
                <span key={index} className="badge text-bg-primary mx-1 mb-1">
                  {teacher.teacher_name}
                </span>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-2 d-flex justify-content-lg-center align-items-center">
            <button
              className="w-100 btn btn-danger"
              onClick={() => setShow(true)}
            >
              <b>
                {reservation_status === "PENDIENTE"
                  ? "Cancelar solicitud"
                  : "Cancelar reserva"}
              </b>
            </button>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{modalContent.body}</div>
        </Modal.Body>
        <Modal.Footer>
          {modalContent.footer === 0 ? (
            <>
              {loading && (
                <Spinner animation="border" variant="secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              <button
                className="btn btn-outline-danger"
                onClick={requestCancel}
                disabled={loading}
              >
                Aceptar
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShow(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                setShow(false);
                props.reload(true);
              }}
            >
              Aceptar
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
