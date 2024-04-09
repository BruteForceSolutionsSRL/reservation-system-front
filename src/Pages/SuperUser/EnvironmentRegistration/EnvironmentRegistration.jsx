import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import "./EnvironmentRegistration.css";

export default function EnvironmentRegistration() {
  const [environmentName, setEnvironmentName] = useState("");
  const [environmentType, setEnvironmentType] = useState("");
  const [environmentCapacity, setEnvironmentCapacity] = useState("");
  const [environmentBuilding, setEnvironmentBuilding] = useState("");
  const [environmentFloor, setEnvironmentFloor] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [capacityError, setCapacityError] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [floorError, setFloorError] = useState(false);

  const validateAlphanumeric = (input) => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(input);
  };

  const handleEnvironmentNameChange = (event) => {
    const value = event.target.value;
    setEnvironmentName(value);
    setNameError(
      value.length < 3 ||
        value.length > 30 ||
        value === "" ||
        !validateAlphanumeric(value)
    );
  };

  const handleEnvironmentTypeChange = (event) => {
    const value = event.target.value;
    setEnvironmentType(value);
    setTypeError(value === ""); //error if empty
  };

  const handleEnvironmentCapacityChange = (event) => {
    const value = event.target.value;
    const isValidPositiveNumber =
      /^\d+(?!e)$/.test(value) && parseInt(value, 10) > 0;
    const isValidRange =
      parseInt(value, 10) >= 15 && parseInt(value, 10) <= 1000;
    setEnvironmentCapacity(value);
    setCapacityError(!isValidPositiveNumber || !isValidRange || value === "");
  };

  const handleBuildingChange = (event) => {
    const value = event.target.value;
    setEnvironmentBuilding(value);
    setBlockError(value === "");
  };

  const handleFloorChange = (event) => {
    const value = event.target.value;
    const isValidInput = /^\d+$/.test(value) && !/e/i.test(value);
    const isValidRange = parseInt(value, 10) >= 0 && parseInt(value, 10) <= 200;
    if ((isValidInput && isValidRange) || value === "") {
      setEnvironmentFloor(value);
      setFloorError(false);
    } else {
      setFloorError(true);
    }
  };
  /*  const handleFloorChange = (event) => {
    const value = event.target.value;
    const isValidRange =
      value === "" || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 200);
    const isValidInput = /^\d{0,3}$/.test(value) && !/e/i.test(value);
    if (isValidRange && isValidInput) {
      setEnvironmentFloor(value);
      setFloorError(false);
    } else {
      setFloorError(true);
    }
  }; */

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirmation = () => {
    setShowCancelModal(false);
    resetForm();
  };

  const handleModalClose = () => {
    setShowCancelModal(false);
    setShowConfirmModal(false);
  };
  const handleSubmit = () => {
    event.preventDefault();
    if (
      !environmentName ||
      !environmentType ||
      !environmentCapacity ||
      !environmentBuilding ||
      !environmentFloor ||
      nameError ||
      typeError ||
      capacityError ||
      blockError ||
      floorError
    ) {
      setNameError(!environmentName);
      setTypeError(!environmentType);
      setCapacityError(!environmentCapacity);
      setBlockError(!environmentBuilding);
      setFloorError(!environmentFloor);
      return;
    }

    console.log("Datos del formulario:", {
      environmentName,
      environmentType,
      environmentCapacity,
      environmentBuilding,
      environmentFloor,
    });

    const formData = {
      name: environmentName,
      capacity: environmentCapacity,
      classroomTypeID: environmentType,
      blockID: environmentBuilding,
      floor: environmentFloor,
    };
    setShowConfirmModal(true);

    const url = "http://localhost:8000/api/classroom";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "aplication/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request error");
        }
        return response.json();
      })
      .then((data) => {
        console.log("response", data);
        setShowConfirmModal(true);
      })
      .catch((error) => {
        console.log("response error", error);
      });
  };

  const resetForm = () => {
    setEnvironmentName("");
    setEnvironmentType("");
    setEnvironmentCapacity("");
    setEnvironmentBuilding("");
    setEnvironmentFloor("");
    setNameError(false);
    setTypeError(false);
    setCapacityError(false);
    setBlockError(false);
    setFloorError(false);
  };

  return (
    <Container>
      <h1 className="mt-5 mb-3">Registro de ambiente</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col className="mb-3" xs={2}>
            <Form.Group controlId="formEnvironmentName">
              <Form.Label>Nombre de ambiente</Form.Label>
            </Form.Group>
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              rows={1}
              value={environmentName}
              onChange={handleEnvironmentNameChange}
              isInvalid={nameError} // true = error
              required
            />
            {nameError && (
              <Form.Text className="text-danger">
                El nombre no puede estar vacío y solo debe contener letras y
                números.
              </Form.Text>
            )}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={2}>
            <Form.Group controlId="formEnvironmentType">
              <Form.Label>Seleccione un tipo de ambiente</Form.Label>
            </Form.Group>
          </Col>
          <Col>
            <Form.Select
              aria-label="Select environment type"
              value={environmentType}
              onChange={handleEnvironmentTypeChange}
              isInvalid={typeError}
              required
            >
              <option value="">Seleccione...</option>
              <option value="1">Auditorio</option>
              <option value="2">Laboratorio</option>
              <option value="3">Aula</option>
              <option value="0">Otro</option>
            </Form.Select>
            {typeError && (
              <Form.Text className="text-danger">
                El tipo de ambiente es obligatorio
              </Form.Text>
            )}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={2}>
            <Form.Group controlId="formEnvironmentCapacity">
              <Form.Label>Capacidad de Ambiente</Form.Label>
            </Form.Group>
          </Col>
          <Col>
            <Form.Control
              type="number"
              value={environmentCapacity}
              onChange={handleEnvironmentCapacityChange}
              isInvalid={capacityError}
              required
            />

            {capacityError && (
              <Form.Text className="text-danger">
                Ingresa un número entero positivo válido mayor a 15. Este campo
                es obligatorio.
              </Form.Text>
            )}
          </Col>
        </Row>

        <div className="ubicacion-container position-relative mb-3">
          <label className="ubicacion-label">Ubicacion del Ambiente</label>
          <Container>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="formBuilding">
                  <Form.Label>Bloque</Form.Label>
                  <Form.Select
                    aria-label="Select building"
                    value={environmentBuilding}
                    onChange={handleBuildingChange}
                    isInvalid={blockError && environmentBuilding === ""}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="1">Edificio Nuevo</option>
                    <option value="2">Multiacademico</option>
                    <option value="0">Edificio Academico</option>
                    <option value="Trencito">Trencito</option>
                  </Form.Select>
                  {blockError && (
                    <Form.Text className="text-danger">
                      El bloque es obligatorio.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formFloor">
                  <Form.Label>Piso</Form.Label>
                  <Form.Control
                    type="number"
                    value={environmentFloor}
                    onChange={handleFloorChange}
                    isInvalid={floorError && environmentFloor === ""}
                  />
                  {floorError && (
                    <Form.Text className="text-danger">
                      Ingresa un número entero positivo. Este campo es
                      obligatorio.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </div>

        <Button
          variant="secondary"
          className="me-3"
          onClick={handleCancelClick}
        >
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Registrar
        </Button>
      </Form>

      <Modal show={showCancelModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro que quieres cancelar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleCancelConfirmation}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¡Ambiente registrado con éxito!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
