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
  showCloseButton,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size={size} centered>
      <Modal.Header closeButton={showCloseButton}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footerButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            className={`me-3 ${
              button.variant === "primary"
                ? "btn-primary custom-btn-primary-outline"
                : "btn-secondary custom-btn-gray-outline"
            }`}
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
