import { useEffect, useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { searchManagement } from "../../../../utils/searchManagement";
import ReusableModal from "../../EditEnvironment/ReusableModal";
import { Calendar } from "primereact/calendar";

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
  const [minDateReservation, setMinDateReservation] = useState(null);
  const [maxDateReservation, setMaxDateReservation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentYear = new Date().getFullYear();

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
    setlistManagement(listA); //Aqui se obtiene del back
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
      let editManage = {
        period_name: currentManagement.period_name,
        period_name_id: currentManagement.period_name_id,
        period_duration: currentManagement.period_duration,
        start_reservation: currentManagement.start_reservation,
      };

      console.log("editado una gestion", editManage);
      await editManagement(editManagement);
    } else {
      // console.log("Formulario inválido, llene todos los campos");
    }
  };

  const editManagement = async (editManage) => {
    try {
      //aqui enviar al back
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
    if (!value.trim()) {
      return "Seleccione un periodo de duración.";
    }
    return null;
  };

  // const handleChangeDate = (value) => {
  //   setDates(value || []);
  //   const formattedDates =
  //     value && value.length === 2 && value[0] && value[1]
  //       ? `${formatDate(value[0])} - ${formatDate(value[1])}`
  //       : "";

  //   setFormData({
  //     ...formData,
  //     period_duration: formattedDates,
  //   });

  //   if (errors.period_duration) {
  //     setErrors({
  //       ...errors,
  //       period_duration: "",
  //     });
  //   }
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setcurrentManagement({
  //     ...currentManagement,
  //     [name]: value,
  //     errors: {
  //       ...currentManagement.errors,
  //       [name]: validators[name] ? validators[name](value) : null,
  //     },
  //   });
  //   setChangedFields({
  //     ...changedFields,
  //     [name]: value,
  //   });
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setcurrentManagement({
      ...currentManagement,
      [name]: value,
    });
    setChangedFields({
      ...changedFields,
      [name]: value,
    });
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
    period_name_id: "PERIODO ACADÉMICO",
  };

  const listA = [
    {
      period_id: 1,
      status_name: "ACTIVO",
      status_period: 1,
      gestion_name: "GESTION 2024",
      period_name: "SEMESTRE II-2024",
      period_name_id: 2,
      period_duration: ["2024-08-5", "2024-08-16"],
      start_reservation: "2024-08-13",
    },
    {
      period_id: 2,
      status_name: "ACTIVO",
      status_period: 1,
      gestion_name: "GESTION 2024",
      period_name: "INVIERNO 2024",
      period_name_id: 3,
      period_duration: ["2024-08-05", "2024-08-08"],
      start_reservation: "2024-07-13",
    },
    {
      period_id: 3,
      status_name: "CERRADO",
      status_period: 2,
      gestion_name: "GESTION 2024",
      period_name: "SEMESTRE I-2024",
      period_name_id: 1,
      period_duration: ["2024-01-10", "2024-06-30"],
      start_reservation: "2024-01-13",
    },
  ];

  const periodsA = [
    { period_id: 1, period: "SEMESTRE I-2020" },
    { period_id: 2, period: "SEMESTRE II-2020" },
    { period_id: 3, period: "VERANO 2020" },
    { period_id: 4, period: "INVIERNO 2020" },
  ];
  const [periods, setPeriodos] = useState(periodsA);

  const getStatusNameById = (statusId) => {
    const statusOption = periodsA.find(
      (option) => option.period_id === parseInt(statusId)
    );
    return statusOption ? statusOption.period : "";
  };

  useEffect(() => {
    if (currentManagement) {
      setStartDate(new Date(currentManagement.period_duration[0]));
      setEndDate(new Date(currentManagement.period_duration[1]));

      setMinDateReservation(new Date(currentManagement.period_duration[0]));
      setMaxDateReservation(new Date(currentManagement.period_duration[1]));
      setSelectedDate(new Date(currentManagement.start_reservation));
    } else {
      setMinDateReservation(null);
      setMaxDateReservation(null);
    }
  }, [currentManagement]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateChangeS = (dates) => {
    setSelectedDate(dates);
  };

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
            <Row className="mb-3 align-items-center">
              <Col md={2} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  NOMBRE DE GESTIÓN
                </Form.Label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="text"
                  name="gestion_name"
                  value={currentManagement.gestion_name}
                  disabled
                />
                
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md={2} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  GESTIÓN ACADÉMICA
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Select
                  name="period_name_id"
                  value={currentManagement.period_name_id}
                  onChange={handleInputChange}
                >
                  {periods.map((option) => (
                    <option key={option.period_id} value={option.period_id}>
                      {option.period}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label">
                  PERIODO DE DURACION
                </Form.Label>
              </Col>
              <Col md={4}>
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
                  yearDropdownItemNumber={currentYear - 1998 + 1}
                  minDate={new Date(1998, 0, 1)}
                  maxDate={new Date(currentYear + 1, 4, 30)}
                />
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md={2} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
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
                  minDate={minDateReservation}
                  maxDate={maxDateReservation}
                />

                {/* {errors.period_duration && (
                  <Form.Text className="text-danger">
                    {errors.period_duration}
                  </Form.Text>
                )} */}
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
            ¿Está seguro de actulizar el periodo acad? Se modificarán los
            siguientes campos:
            <ul>
              {Object.keys(changedFields).map((fieldName) => {
                let displayValue = changedFields[fieldName];
                if (fieldName === "period_name_id") {
                  displayValue = getStatusNameById(displayValue);
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
export default EditPeriod;
