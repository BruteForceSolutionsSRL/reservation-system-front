import { Modal } from "react-bootstrap";

export default function ModalRequestInformation({ show, setShow, content }) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      size="lg"
      centered={true}
      aria-labelledby={`reservation-info-modal${content.id}`}
    >
      <Modal.Header closeButton>
        <Modal.Title id={`reservation-info-modal${content.id}`}>
          {content.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{content.body}</Modal.Body>
      <Modal.Footer>{content.footer}</Modal.Footer>
    </Modal>
  );
}
