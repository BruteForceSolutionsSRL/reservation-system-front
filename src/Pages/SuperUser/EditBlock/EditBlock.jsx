import { useEffect, useState } from "react";
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import BlockEdit from "./BlockEdit";
import { searchEnvironmentsForEdit } from "../../../utils/searchRequests";
import { getStatusBlock } from "../../../services/classrooms";
import ReusableModal from "../EditEnvironment/ReusableModal";
import { getBlocks, setBlock } from "../../../services/blocks";
import { searchBlocks } from "../../../utils/searchBlocks";

function EditBlock() {
  const [loading, setLoading] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [currentReservation, setCurrentReservation] = useState(null);
  const [status, setStatus] = useState([]);
  const [changedFields, setChangedFields] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [confirmations, setConfirmationsModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [backendError, setBackendError] = useState("");
  const url = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    setLoading(true);
    Promise.all([getRequestStatus(), getBlocksList()]).finally(
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setList(allReservations);
      setMsgNoResults("");
    } else {
      const results = searchBlocks(allReservations, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setList(results);
    }
  }, [searchValue, allReservations]);

  const getRequestStatus = async () => {
    let rl = await getStatusBlock();
    setStatus(rl);
  };

  const getBlocksList = async () => {
    let bl = await getBlocks();
    setAllReservations(bl);
    setList(bl);
  };

  const handleShowModal = (block) => {
    setCurrentReservation({ ...block, errors: {} });
    setShowModal(true);
    setChangedFields({});
  };

  const handleSaveConfirmationsModal = () => {
    setSaveModal(false);
    setConfirmationsModal(true);
    handleSaveChanges();
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

  const handleSaveChanges = () => {
    const formHasErrors = Object.keys(currentReservation.errors).some(
      (key) => currentReservation.errors[key]
    );
    if (!formHasErrors) {
      let editedBlock = {
        block_name: currentReservation.block_name,
        block_maxfloor: currentReservation.block_maxfloor,
        block_maxclassrooms: currentReservation.block_maxclassrooms,
        block_status_id: currentReservation.block_status_id,
      };
      editBlock(editedBlock);
    } else {
      console.log("Formulario inválido, llene todos los campos");
    }
  };

  const editBlock = async (editedBlock) => {
    let response = await setBlock(
      currentReservation.block_id,
      editedBlock
    ).catch((error) => {
      setBackendError("Error al enviar los datos: " + error.message);
    });
    setBackendError({ message: response.data });
    getBlocksList();
  };

  const sendData = async (newData, classroom_id) => {
    try {
      const response = await fetch(url + `classrooms/${classroom_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
        mode: "cors",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
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
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleCancelModal,
    },
  ];

  const cancelButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleCancelAceptedModal,
    },
    {
      label: "Atrás",
      variant: "secondary",
      onClick: handleCancelBackModal,
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
    },
  ];

  const validateCantidadClassrom = (value) => {
    const matchingBlock = list.find(
      (list) => list.block_id === currentReservation.block_id
    );
    const maxClass = parseInt(matchingBlock.block_maxclassrooms);
    if (!value) {
      return `La cantidad de ambientes actual del bloque es ${maxClass} .`;
    } else if (value < maxClass || value > 25) {
      return `El ambientes debe ser mayor a ${maxClass} y menor 26.`;
    }
    return null;
  };

  const validateFloor = (value) => {
    const matchingBlock = list.find(
      (list) => list.block_id === currentReservation.block_id
    );
    const maxFloor = parseInt(matchingBlock.block_maxfloor);
    if (!value) {
      return `Numero de pisos actual del bloque es ${maxFloor}.`;
    } else if (value < maxFloor || value > 5) {
      return `El numero de piso debe ser mayor a ${maxFloor} y menor 6.`;
    }
    return null;
  };

  const validators = {
    block_maxfloor: validateFloor,
    block_maxclassrooms: validateCantidadClassrom,
  };

  const handleKeyDown = (event) => {
    if (["-", ".", ",", "e", "+", "E"].includes(event.key)) {
      event.preventDefault();
    }
  };

  const getStatusNameById = (statusId) => {
    const statusOption = status.find(
      (option) => option.classroom_status_id === parseInt(statusId)
    );
    return statusOption ? statusOption.classroom_status_name : "";
  };

  const fieldLabels = {
    block_id: "BLOQUE",
    block_status_id: "ESTADO",
    block_maxfloor: "NUMERO DE PISOS",
    block_maxclassrooms: "CANTIDAD DE AULAS",
  };

  return (
    <div className="container">
      <h1 className="text-center">Lista de Bloques</h1>
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
            <BlockEdit list={list} handleShowModal={handleShowModal} />
          </div>
        )}
      </div>

      <ReusableModal
        show={showModal}
        handleClose={handleCancelModal}
        title="Información del Bloque"
        footerButtons={footerButtonsModal}
        size="lg"
      >
        {currentReservation && (
          <Form>
            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  NOMBRE DEL BLOQUE
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="block_name"
                  placeholder="Ingrese el nombre del Bloque"
                  value={currentReservation.block_name}
                  onChange={handleInputChange}
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  CAPACIDAD DE AULAS
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Control
                  onKeyDown={handleKeyDown}
                  type="number"
                  name="block_maxclassrooms"
                  value={currentReservation.block_maxclassrooms}
                  onChange={handleInputChange}
                  isInvalid={!!currentReservation.errors?.block_maxclassrooms}
                />
                <Form.Control.Feedback type="invalid">
                  {currentReservation.errors?.block_maxclassrooms}
                </Form.Control.Feedback>
              </Col>

              <Col md={1} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  ESTADO
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Select
                  name="block_status_id"
                  value={currentReservation.block_status_id}
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

            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  NUMERO DE PISOS
                </Form.Label>
              </Col>
              <Col md={4}>
                <Form.Control
                  onKeyDown={handleKeyDown}
                  type="number"
                  name="block_maxfloor"
                  min={0}
                  value={currentReservation.block_maxfloor}
                  onChange={handleInputChange}
                  isInvalid={!!currentReservation.errors?.block_maxfloor}
                />
                <Form.Control.Feedback type="invalid">
                  {currentReservation.errors?.block_maxfloor}
                </Form.Control.Feedback>
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
      >
        Se descartarán los cambios realizados.
      </ReusableModal>

      <ReusableModal
        show={saveModal}
        handleClose={handleSaveCancelModal}
        title="¡Confirmación!"
        footerButtons={saveButtonsModal}
      >
        ¿Está seguro de actualizar el BLOQUE? Se modificaran los siguientes
        campos:
        <ul>
          {Object.keys(changedFields).map((fieldName) => {
            let displayValue = changedFields[fieldName];
            if (fieldName === "block_id") {
              displayValue = showBlock(displayValue);
            } else if (fieldName === "block_status_id") {
              displayValue = getStatusNameById(displayValue);
            }
            //  else if (fieldName === "classroom_type_id") {
            //   displayValue = showType(displayValue);
            // }

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
                El BLOQUE quedará{" "}
                <span style={{ color: "green" }}>HABILITADO</span> y los
                ambientes que forman parte quedaran{" "}
                <span style={{ color: "green" }}>HABILITADOS</span> y estaran
                disponibles para hacer reservas.
              </p>
            ) : (
              <p>
                El BLOQUE quedará{" "}
                <span style={{ color: "red" }}>DESHABILITADO</span>. Todas las
                solicitudes pendientes y aceptadas de los ambientes que son
                parte del BLOQUE seran{" "}
                <span style={{ color: "red" }}>RECHAZADAS</span>.
              </p>
            )}
          </>
        ) : (
          <p></p>
        )}
      </ReusableModal>

      <ReusableModal
        show={confirmations}
        handleClose={handleCloseConfirmationsModal}
        title="¡Éxito!"
        footerButtons={saveButtonsConfirmationsModal}
      >
        {backendError && <p style={{ color: "red" }}>{backendError.message}</p>}
      </ReusableModal>
    </div>
  );
}

export default EditBlock;
