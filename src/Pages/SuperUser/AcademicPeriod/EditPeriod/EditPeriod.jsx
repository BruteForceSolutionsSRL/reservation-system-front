import { useEffect, useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { searchPeriod } from "../../../../utils/searchManagement";
import ReusableModal from "../../EditEnvironment/ReusableModal";
import { getPeriod } from "../../../../services/managemet/";
import { setPeriod } from "../../../../services/managemet/";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { es } from "date-fns/locale";
registerLocale("es", es);
import ListPeriod from "./ListPeriod";

function EditPeriod() {
  const [listManagement, setlistManagement] = useState([]);
  const [allManagement, setallManagement] = useState([]);
  const [currentManagement, setcurrentManagement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [changedFields, setChangedFields] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [confirmations, setConfirmationsModal] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [maxDateReservation, setMaxDateReservation] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const [errors, setErrors] = useState({
    period_duration: "",
    initial_date_reservations: "",
    name: "",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllManagement()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setlistManagement(allManagement);
      setMsgNoResults("");
    } else {
      const results = searchPeriod(allManagement, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setlistManagement(results);
    }
  }, [searchValue, allManagement]);

  const getAllManagement = async () => {
    let bl = await getPeriod();
    setallManagement(bl);
    setlistManagement(bl);
  };

  const adjustDateToLocal = (date) => {
    const localDate = new Date(date);
    localDate.setHours(
      localDate.getHours() + localDate.getTimezoneOffset() / 60
    );
    return localDate;
  };

  const handleShowModal = (management) => {
    setcurrentManagement({ ...management, errors: {} });
    setShowModal(true);
    setChangedFields({});
    setStartDate(adjustDateToLocal(new Date(management.initial_date)));
    setEndDate(adjustDateToLocal(new Date(management.end_date)));
  };

  const handleSaveConfirmationsModal = async () => {
    setConfirmationLoading(true);
    await handleSaveChanges();
    setConfirmationLoading(false);
    setSaveModal(false);
    setConfirmationsModal(true);
  };

  const handleCloseConfirmationsModal = () => {
    setConfirmationsModal(false);
  };

  const handleSaveModal = () => {
    const formHasErrors = Object.keys(errors).some((key) => errors[key]);
    const noChangesMade = Object.keys(changedFields).length === 0;

    if (!formHasErrors && !noChangesMade) {
      setSaveModal(true);
      setShowModal(false);
    }
  };

  const handleSaveCancelModal = () => {
    setSaveModal(false);
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setErrors({
      period_duration: "",
    });
    setCancelModal(true);
    setShowModal(false);
  };

  const handleCancelBackModal = () => {
    setShowModal(true);
    setCancelModal(false);
  };

  const handleCancelAceptedModal = () => {
    setCancelModal(false);
    setcurrentManagement(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const formHasErrors = Object.keys(errors).some((key) => errors[key]);
    if (!formHasErrors) {
      let editManagement = {
        name: currentManagement.name,
        date_start: formatDate(startDate),
        date_end: formatDate(endDate),
        initial_date_reservations: currentManagement.initial_date_reservations,
        faculty_id: currentManagement.faculty_id,
        academic_management_id: currentManagement.academic_management_id,
      };

      await savePeriod(editManagement);
    }
    console.log("Formulario", currentManagement);
  };

  const savePeriod = async (editManage) => {
    try {
      let response = await setPeriod(
        currentManagement.academic_period_id,
        editManage
      ).catch((error) => {
        setBackendError("Error al enviar los datos: " + error.message);
      });
      if (response && response.status >= 200 && response.status < 300) {
        let content = {
          status: response.status,
          data: response.data.message,
        };
        setBackendError(content);
        setConfirmationsModal(true);
      } else {
        let errorMsg = response?.data?.message || "Error inesperado.";
        setBackendError({ status: response.status, data: errorMsg });
        setConfirmationsModal(true);
      }
      getAllManagement();
    } catch (error) {
      console.error("Error while editing management:", error);
      setBackendError({ status: 500, data: "Error inesperado al guardar." });
      setConfirmationsModal(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  
  const validateEnvironmentName = (value) => {
    if (!value.trim()) {
      return "El nombre del periodo académico es obligatorio.";
    }
    return "";
  };

  const validatePeriodDuration = (value) => {
    if (!value || value.length !== 2 || !value[0] || !value[1]) {
      return "Seleccione un periodo de duración válido.";
    }
    return "";
  };

  const validateStartDate = (value) => {
    if (!value) {
      return "Seleccione una fecha de inicio de reserva.";
    }
    return "";
  };

  const footerButtonsModal = [
    {
      label: "Guardar",
      variant: "primary",
      onClick: handleSaveModal,
      className: "custom-btn-primary-outline",
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleCancelModal,
      className: "custom-btn-gray-outline",
    },
  ];

  const cancelButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleCancelAceptedModal,
      className: "custom-btn-primary-outline",
    },
    {
      label: "Atrás",
      variant: "secondary",
      onClick: handleCancelBackModal,
      className: "custom-btn-gray-outline",
    },
  ];

  const saveButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleSaveConfirmationsModal,
      className: "custom-btn-primary-outline",
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleSaveCancelModal,
      className: "custom-btn-gray-outline",
    },
  ];

  const saveButtonsConfirmationsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleCloseConfirmationsModal,
      className: "custom-btn-primary-outline",
    },
  ];

  const fieldLabels = {
    period_duration: "PERIODO DE DURACIÓN",
    initial_date_reservations: "INICIO DE RESERVAS",
    name: "PERIODO ACADÉMICO",
  };

  const handleEndDateChange = (dates) => {
    const [start, end] = dates;
    const newPeriodDuration = [formatDate(start), formatDate(end)];
    setEndDate(end);
    setcurrentManagement((prev) => ({
      ...prev,
      period_duration: newPeriodDuration,
    }));
    setSelectedDate(null);
    setcurrentManagement((prev) => ({
      ...prev,
      initial_date_reservations: null,
    }));
    setcurrentManagement((prev) => ({
      ...prev,
      end_date: formatDate(end),
    }));
    setMaxDateReservation(end);

    setErrors((prev) => ({
      ...prev,
      period_duration: validatePeriodDuration(newPeriodDuration),
    }));
    setErrors((prev) => ({
      ...prev,
      initial_date_reservations: validateStartDate(null),
    }));
    setChangedFields((prev) => ({
      ...prev,
      period_duration: newPeriodDuration,
    }));
  };

  const handleDateChangeS = (date) => {
    setSelectedDate(date);

    const errorMessage = validateStartDate(date);
    setErrors((prevErrors) => ({
      ...prevErrors,
      initial_date_reservations: errorMessage,
    }));
    setcurrentManagement((prev) => ({
      ...prev,
      initial_date_reservations: formatDate(date),
    }));
    setChangedFields((prev) => ({
      ...prev,
      initial_date_reservations: formatDate(date),
    }));
  };

  const handleEnvironmentNameChange = (event) => {
    const { name, value } = event.target;
    const filteredValue = value
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z0-9\s\-]/.test(char))
      .join("");
    const errorMessage = validateEnvironmentName(filteredValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setcurrentManagement((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));
    setChangedFields((prev) => ({ ...prev, [name]: filteredValue }));
  };

  useEffect(() => {
    if (showModal) {
      setSelectedDate(
        adjustDateToLocal(new Date(currentManagement.initial_date_reservations))
      );
      setMaxDateReservation(new Date(currentManagement.end_date));
    } else {
      setMaxDateReservation(null);
    }
  }, [showModal]);

  return (
    <div className="container mt-2">
      <h1 className="text-center">Periodos Académicos</h1>
      <SearchBar
        value={searchValue}
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9\s]*$/;
          if (regex.test(event.target.value) || event.target.value === "") {
            setSearchValue(event.target.value);
          }
        }}
      />
      <div className="container" style={{ height: "90vh" }}>
        {loading ? (
          <div className="h-100 text-center d-flex justify-content-center align-items-center">
            <div>
              <Spinner animation="border" variant="secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div>
                <span className="fs-2 ps-2">Cargando</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <hr></hr>
            <div className="h-100">
              {msgNoResults && (
                <div className="h-50 text-center d-flex justify-content-center align-items-center">
                  <div>
                    <i className="bi bi-question-circle fs-1"></i>
                    <h2>{msgNoResults}</h2>
                  </div>
                </div>
              )}

              <ListPeriod
                list={listManagement}
                handleShowModal={handleShowModal}
              />
            </div>
          </>
        )}
      </div>

      <ReusableModal
        show={showModal}
        handleClose={handleCancelModal}
        title="Información de la gestión"
        footerButtons={footerButtonsModal}
        size="lg"
      >
        {currentManagement && (
          <Form>
            <Row className="">
              <Col md={2} className="">
                <Form.Label className="fw-bold col-form-label ">
                  FACULTAD
                </Form.Label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="text"
                  name="faculty_name"
                  value={currentManagement.faculty_name}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mt-3 ">
              <Col md={2} className="">
                <Form.Label className="fw-bold col-form-label ">
                  NOMBRE DE GESTIÓN
                </Form.Label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="text"
                  name="gestion_name"
                  value={currentManagement.academic_management_name}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mt-1 ">
              <Col md={2} className="align-items-center">
                <Form.Label className="fw-bold align-items-center">
                  PERIODO ACADÉMICO
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="input"
                  aria-label="Select environment type"
                  placeholder="Ingrese un nombre de periodo academíco."
                  name="name"
                  value={currentManagement.name}
                  onChange={handleEnvironmentNameChange}
                  isInvalid={!!errors.name}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Col>

              <Col md={2} className="align-items-center">
                <Form.Label className="fw-bold align-items-center ">
                  PERIODO DE DURACION
                </Form.Label>
              </Col>
              <Col md={4}>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleEndDateChange}
                  minDate={currentDate}
                  yearDropdownItemNumber={currentYear - 1998 + 1}
                  maxDate={new Date(currentYear + 1, 4, 30)}
                  selected={endDate}
                  dateFormat="dd-MM-yyyy"
                  locale="es"
                  className="form-control"
                  placeholderText="Seleccione una fecha de fin"
                  todayButton="Hoy"
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  highlightDates={[startDate]}
                  isClearable
                />
                {errors.period_duration && (
                  <Form.Text className="text-danger">
                    {errors.period_duration}
                  </Form.Text>
                )}
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md={2} className="">
                <Form.Label className="fw-bold mb-0">
                  INICIO DE RESERVA
                </Form.Label>
              </Col>
              <Col md={4}>
                <DatePicker
                  placeholderText="Seleccione un periodo de duración."
                  selected={selectedDate}
                  onChange={handleDateChangeS}
                  dateFormat="dd-MM-yyyy"
                  locale={es}
                  className="form-control"
                  todayButton="Hoy"
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  minDate={currentDate}
                  maxDate={maxDateReservation}
                  isClearable
                />
                {errors.initial_date_reservations && (
                  <Form.Text className="text-danger">
                    {errors.initial_date_reservations}
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </ReusableModal>

      <ReusableModal
        show={cancelModal}
        handleClose={handleCancelAceptedModal}
        title="¡Alerta!"
        footerButtons={cancelButtonsModal}
        backdrop="static"
      >
        Se descartarán los cambios realizados.
      </ReusableModal>

      <Modal
        show={saveModal}
        onHide={handleSaveCancelModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            ¿Está seguro de actulizar el periodo academico? Se modificarán los
            siguientes campos:
            <ul>
              {Object.keys(changedFields).map((fieldName) => {
                let displayValue = changedFields[fieldName];
                return (
                  <li key={fieldName}>
                    <span style={{ color: "red" }}>
                      {fieldLabels[fieldName] || fieldName}
                    </span>
                    : {displayValue}
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {confirmationLoading && (
            <Spinner animation="border" variant="secondary" role="status" />
          )}
          {saveButtonsModal.map((button, index) => (
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

      <ReusableModal
        show={confirmations}
        handleClose={handleCloseConfirmationsModal}
        title={backendError.status === 200 ? "¡Exito!" : "¡Error!"}
        footerButtons={saveButtonsConfirmationsModal}
        backdrop="static"
      >
        <div>{backendError.data}</div>
      </ReusableModal>
    </div>
  );
}
export default EditPeriod;
