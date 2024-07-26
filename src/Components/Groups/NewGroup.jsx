import { Modal } from "react-bootstrap";

export default function NewGroup({ show, setShow }) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex">
              <b>MATERIA: </b>
              <select className="form-select ms-2"></select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
