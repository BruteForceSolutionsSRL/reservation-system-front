import React, { useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./RegisterPeriod.css";
import { Calendar } from "primereact/calendar";

function RegisterPeriod() {
  const yearDefault = new Date().getFullYear();
  const [dates, setDates] = useState([]);
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confimationModal, setConfimationModal] = useState(false);
  const [backendError, setBackendError] = useState({});
  const [formData, setFormData] = useState({
    gestion_name: "",
    period_name: "",
    period_duration: "",
    start_reservatios: "",
  });

  const [errors, setErrors] = useState({
    gestion_name: "",
    period_name: "",
    period_duration: "",
    start_reservatios: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    const error = validators[name](value);
    setErrors({
      ...errors,
      [name]: error,
    });
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
      gestion_name: "",
      period_duration: "",
    });
    setErrors({
      gestion_name: "",
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
          data: "Periodo académico registrado exitosamente.",
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

  /**DATOS DE PRUEBA BACKEND */
  const year = [
    { gestion_id: 1, gestion: "GESTION 2020" },
    { gestion_id: 2, gestion: "GESTION 2021" },
    { gestion_id: 3, gestion: "GESTION 2022" },
    { gestion_id: 4, gestion: "GESTION 2023" },
    { gestion_id: 5, gestion: "GESTION 2024" },
  ];
  const [gestion, setGestion] = useState(year);
  const peridosA = [
    { period_id: 1, period: "SEMESTRE I-2020" },
    { period_id: 2, period: "SEMESTRE II-2020" },
    { period_id: 3, period: "VERANO 2020" },
    { period_id: 4, period: "INVIERNO 2020" },
  ];
  const [periods, setPeriodos] = useState(peridosA);

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Registrar Periodo Académico</h1>
      <Container>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col xs={12} md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">GESTIÓN ACADÉMICO</Form.Label>
              </Form.Group>
            </Col>
            <Col xs={12} md={10}>
              <Form.Select
                type="input"
                aria-label="Select environment type"
                name="gestion_id"
                value={formData.gestion_id}
                onChange={handleChange}
                isInvalid={!!errors.gestion_id}
              >
                <option value="">Seleccione una gestión</option>
                {gestion.map((option) => (
                  <option key={option.gestion_id} value={option.gestion_id}>
                    {option.gestion}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={2} className="align-items-center">
              <Form.Group>
                <Form.Label className="fw-bold">PERIODO ACADÉMICA</Form.Label>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select
                aria-label="Select environment type"
                type="input"
                name="period_id"
                value={formData.period_id}
                onChange={handleChange}
                isInvalid={!!errors.period_id}
              >
                <option value="">Seleccione un periodo academíco</option>
                {periods.map((option) => (
                  <option key={option.period_id} value={option.period_id}>
                    {option.period}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="d-flex ">
              <Form.Label className="fw-bold mb-0 ms-5">
                PERIODO DE DURACIÓN
              </Form.Label>
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

          <Row className="mb-3">
            <Col md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">INICIO DE RESERVAS</Form.Label>
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
          <div>¿Está seguro de cancelar el registro?</div>
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
          <div>¿Está seguro de registrar un nuevo periodo académico?</div>
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

export default RegisterPeriod;
