import { useEffect } from "react";
import { Modal } from "react-bootstrap";

export default function ModalRequestInformation({
  show,
  setShow,
  content,
  showConflicts,
  conflicts,
}) {
  const URL = import.meta.env.VITE_REACT_API_URL;
  useEffect(() => {
    if (showConflicts) {
      fecthData();
    }
  }, []);

  const fecthData = async () => {
    try {
      const response = await fetch(URL + `reservation/conflicts/${content.id}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      conflicts(data);
    } catch (error) {
      console.error(error);
    }
  };

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
