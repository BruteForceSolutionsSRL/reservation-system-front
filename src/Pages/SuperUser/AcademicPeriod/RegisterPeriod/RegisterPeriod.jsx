import React, { useState, useEffect } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Calendar } from "primereact/calendar";
import "./RegisterPeriod.css";

function RegisterPeriod() {
  const [dates, setDates] = useState(null);
  const [startReservation, setStartReservation] = useState(null);
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [backendError, setBackendError] = useState({});
   const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
   const [minDateReservation, setMinDateReservation] = useState(null);
   const [maxDateReservation, setMaxDateReservation] = useState(null);

  const [formData, setFormData] = useState({
    gestion_name: "",
    period_name: "",
    period_duration: "",
    start_reservation: "",
  });
  const [errors, setErrors] = useState({
    gestion_name: "",
    period_name: "",
    period_duration: "",
    start_reservation: "",
  });
 
  const year = [
    {
      gestion_id: 1,
      gestion: "GESTION 2024",
      period_duration: ["2024-07-10", "2024-07-26"],
    },
    {
      gestion_id: 2,
      gestion: "GESTION 2023",
      period_duration: ["2024-07-20", "2024-07-30"],
    },
    {
      gestion_id: 3,
      gestion: "GESTION 2022",
      period_duration: ["2022-01-10", "2023-01-06"],
    },
    {
      gestion_id: 4,
      gestion: "GESTION 2021",
      period_duration: ["2021-01-04", "2022-01-06"],
    },
    {
      gestion_id: 5,
      gestion: "GESTION 2020",
      period_duration: ["2020-01-15", "2021-01-06"],
    },
  ];
  const [gestion, setGestion] = useState(year);
  const periodsA = [
    { period_id: 1, period: "SEMESTRE I-2020" },
    { period_id: 2, period: "SEMESTRE II-2020" },
    { period_id: 3, period: "VERANO 2020" },
    { period_id: 4, period: "INVIERNO 2020" },
  ];
  const [periods, setPeriodos] = useState(periodsA);

  useEffect(() => {
    const selectedGestion = gestion.find(
      (g) => g.gestion_id === Number(formData.gestion_name)
    );
    if (selectedGestion) {
      const [start, end] = selectedGestion.period_duration;
      setMinDate(new Date(start));
      setMaxDate(new Date(end));
    } else {
      setMinDate(null);
      setMaxDate(null);
    }
  }, [formData.gestion_name, gestion]);

 useEffect(() => {
   if (formData.period_duration) {
     const [start, end] = formData.period_duration.split(" - ");
     setMinDateReservation(new Date(start));
     setMaxDateReservation(new Date(end));
   } else {
     setMinDateReservation(null);
     setMaxDateReservation(null);
   }
 }, [formData.period_duration]);


  const validatePeriodDuration = (value) => {
    if (!value.trim()) return "Seleccione un periodo académico.";
    return null;
  };

  const validateStartReservations = (value) => {
    if (!value) return "Seleccione una fecha de inicio de reservas.";
    return null;
  };

  const validateGestion = (value) => {
    if (!value.trim()) return "Seleccione una gestión académica.";
    return null;
  };

  const validatePeriod = (value) => {
    if (!value.trim()) return "Seleccione un periodo académico.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.period_duration = validatePeriodDuration(
      formData.period_duration
    );
    newErrors.start_reservation = validateStartReservations(
      formData.start_reservation
    );
    newErrors.gestion_name = validateGestion(formData.gestion_name);
    newErrors.period_name = validatePeriod(formData.period_name);
    setErrors(newErrors);

    if (
      !newErrors.period_duration &&
      !newErrors.start_reservation &&
      !newErrors.gestion_name &&
      !newErrors.period_name
    ) {
      handleSaveModal();
    }
  };

  const validators = {
    gestion_name: validateGestion,
    period_name: validatePeriod,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    const error = validators[name](value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChangeDate = (value) => {
    setDates(value || []);
    const formattedDates =
      value && value.length === 2 && value[0] && value[1]
        ? `${formatDate(value[0])} - ${formatDate(value[1])}`
        : "";

    setFormData({ ...formData, period_duration: formattedDates });
    if (errors.period_duration) {
      setErrors({ ...errors, period_duration: "" });
    }
  };
  
  const handleChangeStart = (value) => {
      setStartReservation(value || null);
      const formattedDate = value ? formatDate(value) : "";
      setFormData({ ...formData, start_reservation: formattedDate });
      if (errors.start_reservation) {
        setErrors({ ...errors, start_reservation: "" });
      }
    };
   const formatDate = (date) => {
     if (!date) return "";
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, "0");
     const day = String(date.getDate()).padStart(2, "0");
     return `${year}-${month}-${day}`;
   };


  function clearDataForm() {
    setDates([]);
    setStartReservation(null);
    setFormData({
      gestion_name: "",
      period_name: "",
      period_duration: "",
      start_reservation: "",
    });
    setErrors({
      gestion_name: "",
      period_name: "",
      period_duration: "",
      start_reservation: "",
    });
  }

  const handleSaveModal = () => setRegisterModal(true);

  const handleSaveCancelModal = () => setRegisterModal(false);

  const saveGestion = async () => {
    setConfirmationLoading(true);
    try {
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
      setConfirmationModal(true);
    }
  };

  function saveBlockClose() {
    setConfirmationModal(false);
    console.log("datos del form", formData);
    clearDataForm();
  }

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
      <h1 className="text-center mt-3 mb-3">Registrar Periodo Académico</h1>
      <Container>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-3">
            <Col xs={12} md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">GESTIÓN ACADÉMICA</Form.Label>
              </Form.Group>
            </Col>
            <Col xs={12} md={10}>
              <Form.Select
                type="input"
                name="gestion_name"
                value={formData.gestion_name}
                onChange={handleChange}
                isInvalid={!!errors.gestion_name}
              >
                <option value="">Seleccione una gestión</option>
                {gestion.map((option) => (
                  <option key={option.gestion_id} value={option.gestion_id}>
                    {option.gestion}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.gestion_name}
              </Form.Control.Feedback>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={2} className="align-items-center">
              <Form.Group>
                <Form.Label className="fw-bold">PERIODO ACADÉMICO</Form.Label>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select
                name="period_name"
                value={formData.period_name}
                onChange={handleChange}
                isInvalid={!!errors.period_name}
              >
                <option value="">Seleccione un periodo académico</option>
                {periods.map((option) => (
                  <option key={option.period_id} value={option.period_id}>
                    {option.period}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.period_name}
              </Form.Control.Feedback>
            </Col>

            <Col md={2}>
              <Form.Label className="fw-bold mb-0 ">
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
                  minDate={minDate}
                  maxDate={maxDate}
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
                  placeholder="Seleccione una fecha."
                  value={startReservation}
                  onChange={(e) => handleChangeStart(e.value)}
                  className="calendar-input"
                  readOnlyInput
                  selectionMode="single"
                  minDate={minDateReservation}
                  maxDate={maxDateReservation}
                />
                {errors.start_reservation && (
                  <Form.Text className="text-danger">
                    {errors.start_reservation}
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
        show={confirmationModal}
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
