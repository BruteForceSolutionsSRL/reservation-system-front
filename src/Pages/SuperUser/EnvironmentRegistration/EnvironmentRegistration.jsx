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
  const [environmentLocation, setEnvironmentLocation] = useState({
    building: "",
    floor: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [nameError, setNameError] = useState(false);

  /*   const handleEnvironmentNameChange = (event) => {
    setEnvironmentName(event.target.value);
  }; */

  const handleEnvironmentTypeChange = (event) => {
    setEnvironmentType(event.target.value);
  };

  const handleEnvironmentCapacityChange = (event) => {
    setEnvironmentCapacity(event.target.value);
  };

  const handleBuildingChange = (event) => {
    setEnvironmentLocation({
      ...environmentLocation,
      building: event.target.value,
    });
  };

  const handleFloorChange = (event) => {
    setEnvironmentLocation({
      ...environmentLocation,
      floor: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Datos del formulario:", {
      environmentName,
      environmentType,
      environmentCapacity,
      environmentLocation,
    });
  };

  const handleCancelClick = () => {
    setShowModal(true);
  };

  const handleEnvironmentNameChange = (event) => {
    const value = event.target.value;
    if (value.length > 3) {
      setEnvironmentName(value);
      setNameError(false); // valor válido, no mostramos el mensaje de error
    } else {
      setNameError(true); // valor inválido, mostramos el mensaje de error
    }
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
            />
            {nameError && (
              <Form.Text className="text-danger">
                El nombre debe tener al menos 4 caracteres.
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
            >
              <option value="">Seleccione...</option>
              <option value="Auditory">Auditorio</option>
              <option value="Laboratory">Laboratorio</option>
              <option value="Classroom">Aula</option>
              <option value="Other">Otro</option>
            </Form.Select>
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
            />
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
                    value={environmentLocation.building}
                    onChange={handleBuildingChange}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Edificio Nuevo">Edificio Nuevo</option>
                    <option value="Multiacademico">Multiacademico</option>
                    <option value="Edificio Academico">
                      Edificio Academico
                    </option>
                    <option value="Trencito">Trencito</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formFloor">
                  <Form.Label>Piso</Form.Label>
                  <Form.Control
                    type="number"
                    value={environmentLocation.floor}
                    onChange={handleFloorChange}
                  />
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
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro que quieres cancelar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
