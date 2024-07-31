import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./EditEnvironment.css";

const ReusableModal = ({
  show,
  handleClose,
  title,
  children,
  footerButtons = [],
  size,
  backdrop,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={size}
      centered
      backdrop={backdrop}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header> 
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footerButtons.map((button, index) => (
          <Button
            className={button.className}
            key={index}
            variant={button.variant}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default ReusableModal;
