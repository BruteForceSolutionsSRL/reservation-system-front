import { useEffect, useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { searchManagement } from "../../../../utils/searchManagement";
import ReusableModal from "../../EditEnvironment/ReusableModal";
import { getManagements } from "../../../../services/managemet/";
import { setManagement } from "../../../../services/managemet/";
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

  // Estado de las fechas
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const currentYear = new Date().getFullYear();
  const [originalPeriodDuration, setOriginalPeriodDuration] = useState([]);

  const [errors, setErrors] = useState({
    period_duration: "",
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
    let bl = await getManagements();
    setallManagement(bl);
    setlistManagement(bl); // Aqui se obtiene del back
  };

  const handleShowModal = (management) => {
    setcurrentManagement({ ...management, errors: {} });
    setShowModal(true);
    setChangedFields({});
    setStartDate(new Date(management.initial_date));
    setEndDate(new Date(management.end_date));
  };

  const handleSaveConfirmationsModal = async () => {
    setConfirmationLoading(true);
    await handleSaveChanges();
    setConfirmationLoading(false);
    setSaveModal(false);
    if (Object.keys(changedFields).length > 0) {
      setConfirmationsModal(true);
    }
  };

  const handleCloseConfirmationsModal = () => {
    setOriginalPeriodDuration([]);
    setConfirmationsModal(false);
  };

  const handleSaveModal = () => {
    const formHasErrors = Object.keys(errors).some((key) => errors[key]);

    if (!formHasErrors) {
      if (Object.keys(changedFields).length === 0) {
        setSaveModal(false);
      } else {
        setSaveModal(true);
        setShowModal(false);
      }
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
    const formHasErrors = Object.keys(currentManagement.errors).some(
      (key) => currentManagement.errors[key]
    );
    if (!formHasErrors) {
      let editManagement = {
        date_start: formatDate(startDate),
        date_end: formatDate(endDate),
        name: currentManagement.name,
      };
      console.log("editado una gestion", editManagement);
      await saveManagement(editManagement);
    } else {
      // console.log("Formulario inválido, llene todos los campos");
    }
  };

  const saveManagement = async (editManage) => {
    try {
      let response = await setManagement(
        currentManagement.academic_management_id,
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
  };



  const handleEndDateChange = (dates) => {
    const [start, end] = dates;
    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);

    const newPeriodDuration = [formattedStartDate, formattedEndDate];
    const hasPeriodDurationChanged =
      originalPeriodDuration[0] !== formattedStartDate ||
      originalPeriodDuration[1] !== formattedEndDate;

    setEndDate(end);
    setcurrentManagement((prev) => ({
      ...prev,
      period_duration: newPeriodDuration,
    }));

    setChangedFields((prev) => ({
      ...prev,
      ...(hasPeriodDurationChanged && {
        period_duration: `${formattedStartDate} - ${formattedEndDate}`,
      }),
    }));

    setErrors((prev) => ({
      ...prev,
      period_duration: validatePeriodDuration(newPeriodDuration),
    }));
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
            <Row className="">
              <Col md={3} className="">
                <Form.Label className="fw-bold ">
                  NOMBRE DE GESTIÓN
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentManagement.name}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={3} className="">
                <Form.Label className="fw-bold ">
                  PERIODO DE DURACIÓN
                </Form.Label>
              </Col>
              <Col md={9}>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleEndDateChange}
                  minDate={startDate}
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
            ¿Está seguro de actualizar el período académico? Se modificarán los
            siguientes campos:
            <ul>
              {Object.keys(changedFields).length === 0 ? (
                <li>No se realizaron cambios.</li>
              ) : (
                Object.keys(changedFields).map((fieldName) => {
                  let displayValue = changedFields[fieldName];
                  if (fieldName === "period_duration") {
                    displayValue = `${formatDate(startDate)} - ${formatDate(
                      endDate
                    )}`;
                  }
                  return (
                    <li key={fieldName}>
                      <span style={{ color: "red" }}>
                        {fieldLabels[fieldName] || fieldName}
                      </span>
                      : {displayValue}
                    </li>
                  );
                })
              )}
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
