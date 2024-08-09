import React, { useState, useEffect } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { storePeriod } from "../../../../services/managemet/";
import { getManagements } from "../../../../services/managemet/";
import { getFaculties } from "../../../../services/managemet/";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { es } from "date-fns/locale";
registerLocale("es", es);
import "./RegisterPeriod.css";

function RegisterPeriod() {
  const [startReservation, setStartReservation] = useState(null);
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [backendError, setBackendError] = useState({});
  const [gestion, setGestion] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [maxDate, setMaxDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [minDateReservation, setMinDateReservation] = useState(null);
  const [maxDateReservation, setMaxDateReservation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusDateStar, setStatusDateStar] = useState(true);
  const [statusGestion, setStatusGestion] = useState(true);
  const currentDate = new Date();

  const [formData, setFormData] = useState({
    faculty_id: "",
    academic_management_id: "",
    name: "",
    period_duration: "",
    start_reservation: "",
  });

  const [errors, setErrors] = useState({
    faculty_id: "",
    academic_management_id: "",
    name: "",
    period_duration: "",
    start_reservation: "",
  });

  useEffect(() => {
    getAllManagement();
    getAllFaculties();
    // setLoading(true);
    // Promise.all([getAllManagement()]).finally(() =>
    //   setLoading(false)
    // );
  }, []);

  const getAllManagement = async () => {
    let bl = await getManagements();
    setGestion(bl);
  };

  const getAllFaculties = async () => {
    let bl = await getFaculties();
    setFaculty(bl);
  };

  const adjustDateToLocal = (date) => {
    const localDate = new Date(date);
    localDate.setHours(
      localDate.getHours() + localDate.getTimezoneOffset() / 60
    );
    return localDate;
  };

  useEffect(() => {
    const selectedGestion = gestion.find(
      (g) =>
        g.academic_management_id === Number(formData.academic_management_id)
    );

    const isGestionSelected = Boolean(formData.academic_management_id);
    setMaxDate(
      isGestionSelected
        ? adjustDateToLocal(new Date(selectedGestion?.end_date))
        : null
    );
    setMinDate(
      adjustDateToLocal(new Date(selectedGestion?.initial_date)) < currentDate
        ? currentDate
        : adjustDateToLocal(new Date(selectedGestion?.initial_date))
    );

    setStartReservation(null);
    setStartDate(null);
    setEndDate(null);
    setStatusGestion(!isGestionSelected);
    setStatusDateStar(!isGestionSelected);
    setFormData((prevData) => ({
      ...prevData,
      period_duration: "",
      start_reservation: "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      period_duration: "",
      start_reservation: "",
    }));
  }, [formData.academic_management_id, gestion]);

  useEffect(() => {
    if (formData.period_duration) {
      setMinDateReservation(
        adjustDateToLocal(new Date(formData.period_duration[0]))
      );
      setMaxDateReservation(
        adjustDateToLocal(new Date(formData.period_duration[1]))
      );
    } else {
      setMinDateReservation(null);
      setMaxDateReservation(null);
    }
  }, [formData.period_duration]);

  const validatePeriodDuration = (value) => {
    if (!value || value[0] === "" || value[1] === "")
      return "Seleccione un periodo académico.";
    return null;
  };

  const validateStartReservations = (value) => {
    if (!value) return "Seleccione una fecha de inicio de reservas.";
    return null;
  };

  const validateGestion = (value) => {
    if (!value) return "Seleccione una gestión académica.";
    return null;
  };

  const validatePeriod = (value) => {
    if (!value) return "Ingrese un nombre de periodo academíco.";
    return null;
  };

  const validateFaculty = (value) => {
    if (!value) return "Seleccione una facultad.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.faculty_id = validateFaculty(formData.faculty_id);
    newErrors.academic_management_id = validateGestion(
      formData.academic_management_id
    );
    newErrors.name = validatePeriod(formData.name);
    newErrors.period_duration = validatePeriodDuration(
      formData.period_duration
    );
    newErrors.start_reservation = validateStartReservations(
      formData.start_reservation
    );
    setErrors(newErrors);

    if (
      !newErrors.faculty_id &&
      !newErrors.period_duration &&
      !newErrors.start_reservation &&
      !newErrors.academic_management_id &&
      !newErrors.name
    ) {
      handleSaveModal();
    }
  };

  const validators = {
    faculty_id: validateFaculty,
    academic_management_id: validateGestion,
    name: validatePeriod,
    period_duration: validatePeriodDuration,
    start_reservation: validateStartReservations,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    const error = validators[name](value);
    setErrors({ ...errors, [name]: error });
  };

  const handleDateChange = (dates) => {
    setStatusDateStar(false);
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (!start || !end) {
      setStartReservation(null);
      setFormData({
        ...formData,
        period_duration: "",
        start_reservation: "",
      });
      setErrors({
        ...errors,
        period_duration: "Seleccione un periodo académico.",
        start_reservation: validateStartReservations(null),
      });
      return;
    }
    let date = [formatDate(start), formatDate(end)];
    setFormData({ ...formData, period_duration: date });
    if (errors.period_duration) {
      setErrors({ ...errors, period_duration: "" });
    }
  };

  const handleDateChangeS = (date) => {
    if (!date) {
      setStartReservation(null);
      setFormData({ ...formData, start_reservation: "" });
      setErrors({
        ...errors,
        start_reservation: validateStartReservations(null),
      });
      return;
    }
    setStartReservation(date);
    setFormData({ ...formData, start_reservation: formatDate(date) });
    if (errors.start_reservation) {
      setErrors({
        ...errors,
        start_reservation: validateStartReservations(formatDate(date)),
      });
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
    setStartReservation(null);
    setStartDate(null);
    setEndDate(null);
    setFormData({
      faculty_id: "",
      academic_management_id: "",
      name: "",
      period_duration: "",
      start_reservation: "",
    });
    setErrors({
      faculty_id: "",
      academic_management_id: "",
      name: "",
      period_duration: "",
      start_reservation: "",
    });
  }

  const handleSaveModal = () => setRegisterModal(true);

  const handleSaveCancelModal = () => setRegisterModal(false);

  const saveGestion = async () => {
    setConfirmationLoading(true);
    let newPeriod = {
      name: formData.name,
      date_start: formData.period_duration[0],
      date_end: formData.period_duration[1],
      initial_date_reservations: formData.start_reservation,
      faculty_id: formData.faculty_id,
      academic_management_id: formData.academic_management_id,
    };
    const response = await storePeriod(newPeriod).finally(() => {
      setConfirmationLoading(false);
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
    setConfirmationLoading(false);
    setRegisterModal(false);
    setConfirmationModal(true);
  };

  function saveBlockClose() {
    setConfirmationModal(false);
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

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Registrar Periodo Académico</h1>
      <Container>
        <Form onSubmit={handleSubmit} noValidate>
          <Row className="mb-1">
            <Col xs={12} md={2}>
              <Form.Group>
                <Form.Label className="fw-bold">FACULTAD</Form.Label>
              </Form.Group>
            </Col>
            <Col xs={12} md={10}>
              <Form.Select
                type="input"
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleChange}
                isInvalid={!!errors.faculty_id}
              >
                <option value="">Seleccione una falcultad</option>
                {faculty.map((option) => (
                  <option key={option.faculty_id} value={option.faculty_id}>
                    {option.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.faculty_id}
              </Form.Control.Feedback>
            </Col>
          </Row>

          <Row className="mb-1 mt-3">
            <Col md={2} className="align-items-center">
              <Form.Group>
                <Form.Label className="fw-bold">GESTIÓN ACADÉMICO</Form.Label>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select
                type="input"
                name="academic_management_id"
                value={formData.academic_management_id}
                onChange={handleChange}
                isInvalid={!!errors.academic_management_id}
              >
                <option value="">Seleccione una gestión</option>
                {gestion.map((option) => (
                  <option
                    key={option.academic_management_id}
                    value={option.academic_management_id}
                  >
                    {option.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.academic_management_id}
              </Form.Control.Feedback>
            </Col>

            <Col md={2}>
              <Form.Label className="fw-bold mb-0 ">
                PERIODO ACADÉMICO
              </Form.Label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="input"
                aria-label="Select environment type"
                placeholder="Ingrese un nombre de periodo academíco."
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
            <Col md={2} className="align-items-center">
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
                  minDate={minDate}
                  maxDate={maxDate}
                  disabled={statusGestion}
                  isClearable
                />
                {errors.period_duration && (
                  <Form.Text className="text-danger">
                    {errors.period_duration}
                  </Form.Text>
                )}
              </div>
            </Col>

            <Col md={2}>
              <Form.Label className="fw-bold mb-0 ">
                INICIO DE RESERVAS
              </Form.Label>
            </Col>
            <Col md={4}>
              <div className="calendar-container">
                <DatePicker
                  placeholder="Seleccione una fecha."
                  selectsStart
                  onChange={handleDateChangeS}
                  selected={startReservation}
                  dateFormat="dd-MM-yyyy"
                  locale={es}
                  className="form-control"
                  todayButton="Hoy"
                  scrollableYearDropdown
                  minDate={minDateReservation}
                  maxDate={maxDateReservation}
                  disabled={statusDateStar}
                  isClearable
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

export default RegisterPeriod;
