import React, { useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { storeManagement } from "../../../../services/managemet/";
import Container from "react-bootstrap/Container";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { es } from "date-fns/locale";
registerLocale("es", es);
import "./RegisterManagement.css";


function RegisterManagement() {
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confimationModal, setConfimationModal] = useState(false);
  const [backendError, setBackendError] = useState({});

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    name: "",
    period_duration: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    period_duration: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const validateNameGestion = (value) => {
    if (!value) {
      return "Ingrese el nombre para la gestión.";
    }
    return null;
  };

  const validatePeriodDuration = (value) => {
    if (!value) {
      return "Seleccione un periodo de duración.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.name = validateNameGestion(formData.name);
    newErrors.period_duration = validatePeriodDuration(
      formData.period_duration
    );
    setErrors(newErrors);

    if (!newErrors.period_duration && !newErrors.name) {
      // Enviar al backend
      handleSaveModal();
      // console.log("datos del form", formData);
    }
  };
  
  const handleEnvironmentNameChange = (event) => {
    const { value } = event.target;
    const transformedValue = value
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z0-9\s\-]/.test(char))
      .join("");
    setFormData({
      ...formData,
      name: transformedValue,
    });

    const error = validators.name(transformedValue);
    setErrors({
      ...errors,
      name: error,
    });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (!start || !end) {
      setFormData({ ...formData, period_duration: "" });
      setErrors({
        ...errors,
        period_duration: "Seleccione un periodo académico.",
      });
      return;
    }
    let date = [formatDate(start), formatDate(end)];
    setFormData({ ...formData, period_duration: date });
    if (errors.period_duration) {
      setErrors({ ...errors, period_duration: "" });
    }
  };

  const validators = {
    name: validateNameGestion,
  };

  function clearDataForm() {
    setStartDate(null);
    setEndDate(null);
    setFormData({
      name: "",
      period_duration: "",
    });
    setErrors({
      name: "",
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
    const response = await storeNewManagement(formData).finally(() => {
      setConfirmationLoading(false);

      setRegisterModal(false);
    });

    if (response) {
      if (response.status >= 200 && response.status < 300) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
        clearDataForm();
      } else if (response.status >= 300 && response.status < 400) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
      } else if (response.status >= 400 && response.status < 500) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
      } else if (response.status >= 500) {
        if (response.data.message) {
          setBackendError({
            status: response.status,
            data: response.data.message,
          });
        } else {
          setBackendError({
            ...backendError,
            data: "Ocurrio un error inesperado, intente nuevamente.",
          });
        }
      }
    } else {
      setBackendError({
        ...backendError,
        data: "Ocurrio un error inesperado, intente nuevamente.",
      });
    }
    setConfimationModal(true);
  };
  
  const storeNewManagement = async (newManagement) => {
    let managemetNew = {
      date_start: newManagement.period_duration[0],
      date_end: newManagement.period_duration[1],
      name: newManagement.name,
    };
    console.log("entra aqui", managemetNew);
    let response = await storeManagement(managemetNew);
    return response;
  };

  function saveBlockClose() {
    setConfimationModal(false);
    // console.log("datos del form", formData);
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
                placeholder="Ingrese un nombre de gestión."
                name="name"
                value={formData.name}
                onChange={handleEnvironmentNameChange}
                isInvalid={!!errors.name}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
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
                <DatePicker
                  selectsStart
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  dateFormat="dd-MM-yyyy"
                  locale="es"
                  className="form-control"
                  placeholder="Seleccione un periodo de duración."
                  todayButton="Hoy"
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={currentYear - 1998 + 1}
                  minDate={new Date(1998, 0, 1)}
                  maxDate={new Date(currentYear + 1, 4, 30)}
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
            {backendError.status === 200 ? "¡Éxito!" : "¡Error!"}
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
