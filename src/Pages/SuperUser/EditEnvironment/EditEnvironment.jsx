import React, { useState, useEffect } from "react";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { searchEnvironmentsForEdit } from "../../../utils/searchRequests";
import { getStatusClassroms } from "../../../services/classrooms";
import { getClassromsTypes } from "../../../services/classrooms";
import { getEnvironments } from "../../../services/classrooms";
import { getBlocks } from "../../../services/classrooms";
import { setEnvironment } from "../../../services/classrooms";
import ReusableModal from "./ReusableModal";
import ListEnvironment from "./ListEnvironment";

function EditEnvironment() {
  const [currentReservation, setCurrentReservation] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [list, setList] = useState([]);
  const [changedFields, setChangedFields] = useState({});
  const [typeOptions, setTypeOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [confirmations, setConfirmationsModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getBlockOptions(),
      getClassromTypes(),
      getAllEnvironments(),
      getStatusTypes(),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setList(environments);
      setMsgNoResults("");
    } else {
      const results = searchEnvironmentsForEdit(environments, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setList(results);
    }
  }, [searchValue, environments]);

  const getBlockOptions = async () => {
    let envl = await getBlocks();
    setBlockOptions(envl.data);
  };

  const getClassromTypes = async () => {
    let envl = await getClassromsTypes();
    setTypeOptions(envl);
  };

  const getStatusTypes = async () => {
    let envl = await getStatusClassroms();
    setStatus(envl);
  };

  const getAllEnvironments = async () => {
    let envl = await getEnvironments();
    setEnvironments(envl);
  };

  const handleShowModal = (reservation) => {
    setCurrentReservation({ ...reservation, errors: {} });
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
    const formHasErrors = Object.keys(currentReservation.errors).some(
      (key) => currentReservation.errors[key]
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
    setCurrentReservation(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const formHasErrors = Object.keys(currentReservation.errors).some(
      (key) => currentReservation.errors[key]
    );
    if (!formHasErrors) {
      let editedEnvironment = {
        classroom_id: parseInt(currentReservation.classroom_id),
        capacity: parseInt(currentReservation.capacity),
        type_id: parseInt(currentReservation.classroom_type_id),
        block_id: parseInt(currentReservation.block_id),
        floor_number: parseInt(currentReservation.floor),
        status_id: parseInt(currentReservation.classroom_status_id),
      };
      await editEnvironment(editedEnvironment);
    } else {
      console.log("Formulario inválido, llene todos los campos");
    }
  };

  const editEnvironment = async (editedEnvironment) => {
    try {
      let response = await setEnvironment(
        currentReservation.classroom_id,
        editedEnvironment
      ).catch((error) => {
        setBackendError("Error al enviar los datos: " + error.message);
      });
      setBackendError(response);
      getAllEnvironments();
    } catch (error) {
      console.error("Error while editing block:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentReservation({
      ...currentReservation,
      [name]: value,
      errors: {
        ...currentReservation.errors,
        [name]: validators[name] ? validators[name](value) : null,
      },
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
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleSaveCancelModal,
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

  const validateCantidad = (value) => {
    if (!value) {
      return "Ingrese una cantidad.";
    } else if (value < 25 || value > 500) {
      return "La cantidad de estudiantes debe ser mayor a 25 y menor o igual a 500.";
    }
    return null;
  };

  const validateFloor = (value) => {
    const maxFloor = getFloor(currentReservation.block_id);
    if (!value) {
      return "Ingrese un número de piso.";
    } else if (value > maxFloor) {
      return `El bloque seleccionado tiene ${maxFloor} pisos.`;
    }
    return null;
  };

  const validators = {
    floor: validateFloor,
    capacity: validateCantidad,
  };

  function getFloor(key) {
    const selectedElement = blockOptions.find(
      (elemento) => elemento.block_id === parseInt(key)
    );
    if (selectedElement) {
      return selectedElement.block_maxfloor;
    }
    return 0;
  }

  const handleKeyDown = (event) => {
    if (
      event.key === "-" ||
      event.key === "." ||
      event.key === "," ||
      event.key === "e" ||
      event.key === "+" ||
      event.key === "E"
    ) {
      event.preventDefault();
    }
  };
  const getBlockNameById = (blockId) => {
    const block = blockOptions.find(
      (option) => option.block_id === parseInt(blockId)
    );
    return block ? block.block_name : "";
  };

  const getStatusNameById = (statusId) => {
    const statusOption = status.find(
      (option) => option.classroom_status_id === parseInt(statusId)
    );
    return statusOption ? statusOption.classroom_status_name : "";
  };

  const getTypeNameById = (typeId) => {
    const typeOption = typeOptions.find(
      (option) => option.type_id === parseInt(typeId)
    );
    return typeOption ? typeOption.type_name : "";
  };

  const fieldLabels = {
    block_id: "BLOQUE",
    classroom_type_id: "TIPO DE AMBIENTE",
    classroom_status_id: "ESTADO",
    floor: "PISO",
    capacity: "CAPACIDAD",
  };

  return (
    <div className="container">
      <h1 className="text-center">Lista de Ambientes</h1>
      <SearchBar
        value={searchValue}
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9\s]*$/;
          if (regex.test(event.target.value) || event.target.value === "") {
            setSearchValue(event.target.value);
          }
        }}
      />
      <div className="container">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <hr></hr>
            {msgNoResults && (
              <div className="text-center">
                <h4>{msgNoResults}</h4>
              </div>
            )}
            <ListEnvironment list={list} handleShowModal={handleShowModal} />
          </div>
        )}
      </div>

      <ReusableModal
        show={showModal}
        handleClose={handleCancelModal}
        showCloseButton={true}
        title="Información del Ambiente"
        footerButtons={footerButtonsModal}
        size="lg"
      >
        {currentReservation && (
          <Form>
            <Row className="align-items-center">
              <Col md={2}>
                <Form.Label className="fw-bold col-form-label">
                  NOMBRE DE AMBIENTE
                </Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  rows={1}
                  required
                  name="classroom_name"
                  value={currentReservation.classroom_name}
                  onChange={handleInputChange}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-2 align-items-center">
              <Col md={2}>
                <Form.Label className="fw-bold col-form-label ">
                  TIPO DE AMBIENTE
                </Form.Label>
              </Col>
              <Col>
                <Form.Select
                  aria-label="Select environment type"
                  required
                  name="classroom_type_id"
                  value={currentReservation.classroom_type_id}
                  onChange={handleInputChange}
                >
                  {typeOptions.map((option) => (
                    <option key={option.type_id} value={option.type_id}>
                      {option.type_name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3} className="d-flex">
                <Form.Label className="fw-bold col-form-label mb-0">
                  CAPACIDAD DE AMBIENTE
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  min={0}
                  max={1000}
                  name="capacity"
                  onKeyDown={handleKeyDown}
                  value={currentReservation.capacity}
                  onChange={handleInputChange}
                  isInvalid={!!currentReservation.errors?.capacity}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {currentReservation.errors?.capacity}
                </Form.Control.Feedback>
              </Col>

              <Col md={2} className="d-flex ">
                <Form.Label className="fw-bold col-form-label mb-0">
                  ESTADO
                </Form.Label>
              </Col>
              <Col md={3}>
                <Form.Select
                  className="text-truncate"
                  name="classroom_status_id"
                  value={currentReservation.classroom_status_id}
                  onChange={handleInputChange}
                >
                  {status.map((option) => (
                    <option
                      key={option.classroom_status_id}
                      value={option.classroom_status_id}
                    >
                      {option.classroom_status_name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div className="tag-container position-relative mb-3 mt-4">
              <label className="tag-label">Ubicación del Ambiente</label>
              <Container>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formBlock">
                      <Form.Label className="fw-bold">BLOQUE</Form.Label>
                      <Form.Select
                        className="text-truncate"
                        name="block_id"
                        value={currentReservation.block_id}
                        onChange={handleInputChange}
                      >
                        {blockOptions.map((option) => (
                          <option key={option.block_id} value={option.block_id}>
                            {option.block_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formFloor">
                      <Form.Label className="fw-bold">PISO</Form.Label>
                      <Form.Control
                        type="number"
                        max={50}
                        min={0}
                        name="floor"
                        onKeyDown={handleKeyDown}
                        value={currentReservation.floor}
                        onChange={handleInputChange}
                        isInvalid={!!currentReservation.errors?.floor}
                        onPaste={(e) => {
                          e.preventDefault();
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {currentReservation.errors?.floor}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </div>
          </Form>
        )}
      </ReusableModal>

      <ReusableModal
        show={cancelModal}
        handleClose={handleCancelAceptedModal}
        showCloseButton={true}
        title="¡Advertencia!"
        footerButtons={cancelButtonsModal}
        backdrop="static"
      >
        ¿Está seguro de descartar los cambios realizados?
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
            ¿Está seguro de actualizar el ambiente? Se modificarán los
            siguientes campos:
            <ul>
              {Object.keys(changedFields).map((fieldName) => {
                let displayValue = changedFields[fieldName];
                if (fieldName === "block_id") {
                  displayValue = getBlockNameById(displayValue);
                } else if (fieldName === "classroom_status_id") {
                  displayValue = getStatusNameById(displayValue);
                } else if (fieldName === "classroom_type_id") {
                  displayValue = getTypeNameById(displayValue);
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
            {Object.keys(changedFields).includes("classroom_status_id") ? (
              <>
                {changedFields.classroom_status_id === "1" ? (
                  <p>
                    El ambiente quedara{" "}
                    <span style={{ color: "green" }}>HABILITADO</span> para
                    hacer reservas.
                  </p>
                ) : (
                  <p>
                    El ambiente quedará{" "}
                    <span style={{ color: "red" }}>DESHABILITADO</span>. Todas
                    las solicitudes pendientes y aceptadas hasta el momento que
                    incluyan al ambiente serán{" "}
                    <span style={{ color: "red" }}>RECHAZADAS</span>.
                  </p>
                )}
              </>
            ) : (
              <p>
                Todas las solicitudes pendientes y aceptadas asociadas al
                ambiente se actualizarán con la nueva información.
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {confirmationLoading && (
            <Spinner animation="border" variant="gray" role="status" />
          )}
          {saveButtonsModal.map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              className={`${
                button.variant === "primary"
                  ? "btn-primary custom-btn-primary-outline"
                  : "btn-secondary custom-btn-gray-outline"
              }`}
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
        showCloseButton={false}
        title={backendError.status === 200 ? "¡Exito!" : "¡Error!"}
        footerButtons={saveButtonsConfirmationsModal}
        backdrop="static"
      >
        {backendError && <p>{backendError.data.message}</p>}
      </ReusableModal>
    </div>
  );
}
export default EditEnvironment;
