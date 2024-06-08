import { Modal, Table } from "react-bootstrap";

export default function ModalTable({
  showState,
  title,
  headers,
  contentTable,
  callbackSelectedOptions,
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
        <Table bordered hover>
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{contentTable}</tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
