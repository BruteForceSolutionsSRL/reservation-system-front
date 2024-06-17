import { Modal, Table } from "react-bootstrap";

export default function ModalTable({
  showState,
  title,
  headers,
  contentTable,
}) {
  return (
    <Modal
      show={showState.show}
      onHide={() => showState.setShow(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="h-100 overflow-y-auto" style={{ maxHeight: "300px" }}>
          <Table bordered hover>
            <thead>
              <tr>{headers}</tr>
            </thead>
            <tbody>{contentTable}</tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
}
