import { useEffect, useState } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import SearchBar from "../../../../Components/SearchBar/SearchBar";
import { searchManagement } from "../../../../utils/searchManagement";
import ReusableModal from "../../EditEnvironment/ReusableModal";
import { Calendar } from "primereact/calendar";
import ListManagement from "./ListManagement";

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

  const handleShowModal = (block) => {
    setcurrentManagement({ ...block, errors: {} });
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
        gestion_name: currentManagement.gestion_name,
        period_duration: currentManagement.period_duration,
      };
      await editBlock(editManage);
    } else {
      // console.log("Formulario inválido, llene todos los campos");
    }
  };

  const editBlock = async (editManage) => {
    try {
      let response = await setBlock(
        currentManagement.block_id,
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
      status_id: 1,
      status_name: "ACTIVO",
      gestion_name: "GESTION 2025",
      period_duration: ["2024-07-10", "2024-07-30"],
    },
    {
      status_id: 1,
      status_name: "ACTIVO",
      gestion_name: "GESTION 2024",
      period_duration: ["2024-07-10", "2024-07-26"],
    },
    {
      status_id: 2,
      status_name: "CERRADO",
      gestion_name: "GESTION 2024",
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

  const handleChangeDate = (e) => {
    setDates(e.value);
  };


  // console.log(dates);

  return (
    <div className="container mt-2">
      <h1 className="text-center">Gestiones Acedémicas</h1>
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
                <Calendar
                  placeholder="Seleccione un periodo de duración."
                  value={dates}
                  onChange={(e) => handleChangeDate(e.value)}
                  className="calendar-input"
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                  
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
            ¿Está seguro de actualizar el BLOQUE? Se modificarán los siguientes
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
