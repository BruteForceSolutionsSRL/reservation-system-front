import React, { useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./RegisterManagement.css";
import { Calendar } from "primereact/calendar";

function RegisterManagement() {
  const yearDefault = new Date().getFullYear();
  const [dates, setDates] = useState([]);
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confimationModal, setConfimationModal] = useState(false);
  const [backendError, setBackendError] = useState({});
  const [formData, setFormData] = useState({
    gestion_name: "GESTIÓN " + yearDefault,
    period_duration: "",
  });

  const [errors, setErrors] = useState({
    period_duration: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const validatePeriodDuration = (value) => {
    if (!value.trim()) {
      return "Seleccione un periodo de duración.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.period_duration = validatePeriodDuration(
      formData.period_duration
    );
    setErrors(newErrors);

    if (!newErrors.period_duration) {
      // Enviar al backend
      handleSaveModal();
      // console.log("datos del form", formData);
    }
  };

  const handleChangeDate = (value) => {
    setDates(value || []);
    const formattedDates =
      value && value.length === 2 && value[0] && value[1]
        ? `${formatDate(value[0])} - ${formatDate(value[1])}`
        : "";

    setFormData({
      ...formData,
      period_duration: formattedDates,
    });

    if (errors.period_duration) {
      setErrors({
        ...errors,
        period_duration: "",
      });
    }
  };

  function clearDataForm() {
    setDates([]);
    setFormData({
      gestion_name: "GESTIÓN " + yearDefault,
      period_duration: "", 
    });
    setErrors({
      period_duration: "",
    });
  }

  const handleSaveModal = () => {
    setRegisterModal(true);
  };

  const handleSaveCancelModal = () => {
    setRegisterModal(false);
  };

  const saveGestion = async () => {
    setConfirmationLoading(true);
    try {
      // const response = await storeNewBlock(formData);
      const response = { status: 200 };

      if (response.status === 200) {
        setBackendError({
          status: 200,
          data: "Gestión registrada exitosamente.",
        });
      } else {
        throw new Error("Error al registrar la gestión.");
      }
    } catch (error) {
      setBackendError({
        status: error.response ? error.response.status : 500,
        data: error.response ? error.response.data : "Error del servidor.",
      });
    } finally {
      setConfirmationLoading(false);
      setRegisterModal(false);
      setConfimationModal(true);
    }
  };

  function saveBlockClose() {
    setConfimationModal(false);
    console.log("datos del form", formData);
    clearDataForm();
  }

  /******************** */
  function cancelRegister() {
    setCancelRegisterModal(true);
  }

  function backRegisterClear() {
    setCancelRegisterModal(false);
  }

  function clearFormRegister() {
    clearDataForm();
    setCancelRegisterModal(false);
  }

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Registrar Gestión Académica</h1>
      <Container>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col xs={12} md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">NOMBRE DE GESTIÓN</Form.Label>
              </Form.Group>
            </Col>
            <Col xs={12} md={10}>
              <Form.Control
                type="input"
                aria-label="Select environment type"
                name="gestion_name"
                value={formData.gestion_name}
                disabled
              ></Form.Control>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">PERIODO DE DURACIÓN</Form.Label>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div className="calendar-container">
                <Calendar
                  placeholder="Seleccione un periodo de duración."
                  value={dates}
                  onChange={(e) => handleChangeDate(e.value)}
                  className="calendar-input"
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                />
                {errors.period_duration && (
                  <Form.Text className="text-danger">
                    {errors.period_duration}
                  </Form.Text>
                )}
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button
              type="submit"
              className="me-3 custom-btn-green custom-btn-green-outline btn btn-success"
            >
              Registrar
            </Button>
            <Button
              variant="secondary"
              className="me-3 btn btn-secondary custom-btn-gray-outline"
              onClick={cancelRegister}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>

      <Modal
        show={cancelRegisterModal}
        onHide={backRegisterClear}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Está de cancelar el registro?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="custom-btn-primary-outline"
            onClick={clearFormRegister}
          >
            Aceptar
          </Button>
          <Button
            className="custom-btn-gray-outline"
            variant="secondary"
            onClick={backRegisterClear}
          >
            Atrás
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={registerModal}
        onHide={handleSaveCancelModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Está seguro de registrar la nueva gestión?</div>
        </Modal.Body>
        <Modal.Footer>
          {confirmationLoading && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status" />
            </div>
          )}
          <Button className="custom-btn-primary-outline" onClick={saveGestion}>
            Aceptar
          </Button>
          <Button
            className="custom-btn-gray-outline"
            variant="secondary"
            onClick={handleSaveCancelModal}
          >
            Atrás
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={confimationModal}
        onHide={saveBlockClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {backendError.status === 200 ? "Éxito" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{backendError.data}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="custom-btn-primary-outline"
            onClick={saveBlockClose}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RegisterManagement;
