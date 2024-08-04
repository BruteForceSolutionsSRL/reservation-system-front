import { useEffect, useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { searchManagement } from "../../../../utils/searchManagement";
import ReusableModal from "../../EditEnvironment/ReusableModal";
import { Calendar } from "primereact/calendar";
import ListManagement from "./ListManagement";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { es } from "date-fns/locale";
registerLocale("es", es);

function EditManagement() {
  const [listManagement, setlistManagement] = useState([]);
  const [allManagement, setallManagement] = useState([]);
  const [currentManagement, setcurrentManagement] = useState(null);
  const [dates, setDates] = useState(null);
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minDateReservation, setMinDateReservation] = useState(null);
  const [maxDateReservation, setMaxDateReservation] = useState(null);
    const currentYear = new Date().getFullYear();

  const [errors, setErrors] = useState({
    period_duration: "",
    // Otros posibles errores
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
      const results = searchManagement(allManagement, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setlistManagement(results);
    }
  }, [searchValue, allManagement]);

  const getAllManagement = async () => {
    // let bl = await getManagements();
    setallManagement(listA);
    setlistManagement(listA); // Aqui se obtiene del back
  };

  const handleShowModal = (management) => {
    setcurrentManagement({ ...management, errors: {} });
    setShowModal(true);
    setChangedFields({});
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
    const formHasErrors = Object.keys(currentManagement.errors).some(
      (key) => currentManagement.errors[key]
    );
    if (!formHasErrors) {
      setSaveModal(true);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (currentManagement) {
      setStartDate(new Date(currentManagement.period_duration[0]));
      setEndDate(new Date(currentManagement.period_duration[1]));

      setMinDateReservation(new Date(currentManagement.period_duration[0]));
      setMaxDateReservation(new Date(currentManagement.period_duration[1]));
    } else {
      setMinDateReservation(null);
      setMaxDateReservation(null);
    }
  }, [currentManagement]);

  const handleSaveCancelModal = () => {
    setSaveModal(false);
    setShowModal(true);
  };

  const handleCancelModal = () => {
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
    const formHasErrors = Object.keys(currentManagement.errors).some(
      (key) => currentManagement.errors[key]
    );
    if (!formHasErrors) {
      let editManagement = {
        gestion_name: currentManagement.gestion_name,
        period_duration: currentManagement.period_duration,
      };

      console.log("editado una gestion", editManagement);
      await editManagement(editManagement);
    } else {
      // console.log("Formulario inválido, llene todos los campos");
    }
  };

  const editManagement = async (editManage) => {
    try {
      let response = await setManagement(
        currentManagement.management_id,
        editManage
      ).catch((error) => {
        setBackendError("Error al enviar los datos: " + error.message);
      });
      if (response.status >= 200 && response.status < 300) {
        let content = {};
        content.status = response.status;
        content.data = response.data.message;
        setBackendError(content);
      } else if (response.status >= 300 && response.status < 400) {
        let content = {};
        content.status = response.status;
        content.data = response.data.message;
        setBackendError(content);
      } else if (response.status >= 400 && response.status < 500) {
        let content = {};
        content.status = response.status;
        content.data = response.data.message;
        setBackendError(content);
      } else if (response.status >= 500) {
        if (response.data.message) {
          let content = {};
          content.status = response.status;
          content.data = response.data.message;
          setBackendError(content);
        } else {
          let content = {};
          content.status = response.status;
          content.data = "Ocurrio un error inesperado, intente nuevamente.";
          setBackendError(content);
        }
      }
      getAllManagement();
    } catch (error) {
      console.error("Error while editing block:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const validatePeriodDuration = (value) => {
    if (!value || value.length !== 2 || !value[0] || !value[1]) {
      return "Seleccione un periodo de duración válido.";
    }
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
    if (!value) return "Seleccione un periodo académico.";
    return null;
  };

  const validators = {
    gestion_name: validateGestion,
    period_name: validatePeriod,
    period_duration: validatePeriodDuration,
    start_reservation: validateStartReservations,
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
  };

  const listA = [
    {
      management_id: 1,
      status_name: "ACTIVO",
      gestion_name: "GESTION 2025",
      status_management: 1,
      period_duration: ["2024-07-10", "2024-07-30"],
    },
    {
      management_id: 2,
      status_name: "ACTIVO",
      status_management: 1,
      gestion_name: "GESTION 2024",
      period_duration: ["2024-07-10", "2024-07-26"],
    },
    {
      management_id: 3,
      status_name: "CERRADO",
      gestion_name: "GESTION 2024",
      status_management: 2,
      period_duration: ["2024-07-10", "2024-07-26"],
    },
  ];

  const convertToDateArray = (dateStrings) =>
    dateStrings.map((dateStr) => new Date(dateStr));

  useEffect(() => {
    if (currentManagement) {
      setDates(convertToDateArray(currentManagement.period_duration));
    }
  }, [currentManagement]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (!start || !end) {
      setErrors({
        ...errors,
        period_duration: "Seleccione un periodo de duración válido.",
      });
      return;
    }
    setDates(dates);
    const formattedDates = [formatDate(start), formatDate(end)];
    setcurrentManagement((prevManagement) => ({
      ...prevManagement,
      period_duration: formattedDates,
      errors: {
        ...prevManagement.errors,
        period_duration: validatePeriodDuration(dates),
      },
    }));
    if (errors.period_duration) {
      setErrors({ ...errors, period_duration: "" });
    }
  };

  return (
    <div className="container mt-2">
      <h1 className="text-center">Gestiones Académicas</h1>
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

              <ListManagement
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
            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  NOMBRE DE GESTIÓN
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="gestion_name"
                  value={currentManagement.gestion_name}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  PERIODO DE DURACIÓN
                </Form.Label>
              </Col>
              <Col md={9}>
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
                  placeholderText="Fecha de Inicio"
                  todayButton="Hoy"
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  // minDate={minDateReservation}
                  // maxDate={maxDateReservation}
                  yearDropdownItemNumber={currentYear - 1998 + 1}
                  minDate={new Date(1998, 0, 1)}
                  maxDate={new Date(currentYear + 1, 4, 30)}
                  isClearable // Permitir que los usuarios borren las fechas seleccionadas
                />
                {errors.period_duration && (
                  <Form.Text className="text-danger">
                    {errors.period_duration}
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
            ¿Está seguro de actulizar la gestión? Se modificarán los siguientes
            campos:
            <ul>
              {Object.keys(changedFields).map((fieldName) => {
                let displayValue = changedFields[fieldName];
                if (fieldName === "block_id") {
                  displayValue = showBlock(displayValue);
                }
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
        title={backendError.status === 200 ? "¡Confirmación!" : "¡Error!"}
        footerButtons={saveButtonsConfirmationsModal}
        backdrop="static"
      >
        <div>{backendError.data}</div>
      </ReusableModal>
    </div>
  );
}
export default EditManagement;
