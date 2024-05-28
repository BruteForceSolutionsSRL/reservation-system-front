import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { searchEnvironmentsForEdit } from "../../../utils/searchRequests";
import RequestInformation from "../../../Components/RequestInformation/RequestInformation";
import { getRequests, getTeacherRequests } from "../../../services/requests";
import ReusableModal from "./ReusableModal";
import ListEnvironment from "./ListEnvironment"; // Importa el nuevo componente

function EditEnvironment() {
  const [loading, setLoading] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");

  const [currentReservation, setCurrentReservation] = useState(null);

  const [typeOptions, setTypeOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [status, setStatus] = useState([]);
  const [changedFields, setChangedFields] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [confirmations, setConfirmationsModal] = useState(false);
  const url = import.meta.env.VITE_REACT_API_URL;
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [backendError, setBackendError] = useState("");

  const handleShowModal = (reservation) => {
    setCurrentReservation({ ...reservation, errors: {} });
    setShowModal(true);
    setChangedFields({});
  };

  const handleSaveConfirmationsModal = () => {
    setSaveModal(false);
    setConfirmationsModal(true);
    //Save in BackEnd
    handleSaveChanges();
  };
  const handleCloseConfirmationsModal = () => {
    setConfirmationsModal(false);
  };

  /******************************************************** */
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

  /******************************************************/
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
      const updatedReservations = allReservations.map((reservation) =>
        reservation.classroom_id === currentReservation.classroom_id
          ? { ...currentReservation, errors: {} }
          : reservation
      );
      const newDataEnvironment = {
        classroom_id: parseInt(currentReservation.classroom_id),
        capacity: parseInt(currentReservation.capacity),
        type_id: parseInt(currentReservation.classroom_type_id),
        block_id: parseInt(currentReservation.block_id),
        floor_number: parseInt(currentReservation.floor),
        status_id: parseInt(currentReservation.classroom_id),
      };

      console.log(newDataEnvironment);
      

      //Send in BackEnd
      sendData(newDataEnvironment, currentReservation.classroom_id)
        .then((responseMessage) => {
          console.log("Modificacion exitosa:", responseMessage);
          console.log("Campos modificados:", changedFields);
          //setBackendError(responseMessage);
          //Estatus and update list
          setAllReservations(updatedReservations);
          setList(updatedReservations);
        })
        .catch((error) => {
          console.error("Error al enviar los datos:", error);
          //setBackendError("Error al enviar los datos: " + error.message);
        });
    } else {
      console.log("Formulario inválido, llene todos los campos");
    }
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

  // Botones personalizados para el modal
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
  //  Botton Cancel
  const cancelButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleCancelAceptedModal,
    },
    {
      label: "Atras",
      variant: "secondary",
      onClick: handleCancelBackModal,
    },
  ];
  // Botton Save
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

  // Botton Save confirmnations
  const saveButtonsConfirmationsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleCloseConfirmationsModal,
    },
  ];

  // useEffect para búsqueda
  useEffect(() => {
    if (searchValue === "") {
      setList(allReservations);
      setMsgNoResults("");
    } else {
      const results = searchEnvironmentsForEdit(allReservations, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados");
      } else {
        setMsgNoResults("");
      }
      setList(results);
    }
  }, [searchValue, allReservations]);

  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true);
      await fetchBlockOptions();
      await fetchTypes();
      await allEnvironments();
      await statusTypes();
    };

    fetchData();
  }, []);

  const fetchBlockOptions = () => {
    fetch(url + "blocks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setBlockOptions(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const fetchTypes = () => {
    fetch(url + "classrooms/types")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setTypeOptions(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const statusTypes = () => {
    fetch(url + "classrooms/statuses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setStatus(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const allEnvironments = () => {
    fetch(url + "classrooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setAllReservations(optionsWithDefault);
        //setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  // Validador de cantidad
  const validateCantidad = (value) => {
    if (!value) {
      return "Ingrese una cantidad.";
    } else if (value < 25 || value > 500) {
      return "La cantidad de estudiantes debe ser mayor a 25 y menor a 1000.";
    }
    return null;
  };

  // Validador de piso
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
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <hr></hr>
            {msgNoResults && <div>{msgNoResults}</div>}
            <ListEnvironment list={list} handleShowModal={handleShowModal} />
          </div>
        )}
      </div>

      <ReusableModal
        show={showModal}
        handleClose={handleCancelModal}
        title="Información del Ambiente"
        footerButtons={footerButtonsModal}
        size="lg"
      >
        {currentReservation && (
          <Form>
            <Row className="mb-3">
              <Col className="mb-3" xs={2}>
                <Form.Group controlId="formEnvironmentName">
                  <Form.Label>NOMBRE DE AMBIENTE</Form.Label>
                </Form.Group>
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
            <Row className="mb-3">
              <Col xs={2}>
                <Form.Group controlId="formEnvironmentType">
                  <Form.Label>TIPO DE AMBIENTE</Form.Label>
                </Form.Group>
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
              <Col xs={2}>
                <Form.Group controlId="formEnvironmentCapacity">
                  <Form.Label>CAPACIDAD DE AMBIENTE</Form.Label>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Form.Control
                  type="number"
                  onKeyDown={handleKeyDown}
                  required
                  name="capacity"
                  value={currentReservation.capacity}
                  onChange={handleInputChange}
                  isInvalid={!!currentReservation.errors?.capacity}
                />
                <Form.Control.Feedback type="invalid">
                  {currentReservation.errors?.capacity}
                </Form.Control.Feedback>
              </Col>
              <Col xs={2}>
                <Form.Group controlId="formEnvironmentStatus">
                  <Form.Label>ESTADO</Form.Label>
                </Form.Group>
              </Col>
              <Col>
                <Form.Select
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
            <div className="tag-container position-relative mb-3">
              <label className="tag-label">Ubicación del Ambiente</label>
              <Container>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formBlock">
                      <Form.Label>BLOQUE</Form.Label>
                      <Form.Select
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
                      <Form.Label>PISO</Form.Label>
                      <Form.Control
                        onKeyDown={handleKeyDown}
                        type="number"
                        min={0}
                        name="floor"
                        value={currentReservation.floor}
                        onChange={handleInputChange}
                        isInvalid={!!currentReservation.errors?.floor}
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
        title="!Alerta¡"
        footerButtons={cancelButtonsModal}
      >
        Se descartaran los cambios realizados
      </ReusableModal>

      <ReusableModal
        show={saveModal}
        handleClose={handleSaveCancelModal}
        title="¡Confirmación!"
        footerButtons={saveButtonsModal}
      >
        ¿Está seguro de actualizar el ambiente? Se modificarán los siguientes
        campos:
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
                <span style={{ color: "green" }}>HABILITADO</span> para hacer
                reservas.
              </p>
            ) : (
              <p>
                El ambiente quedará{" "}
                <span style={{ color: "red" }}>DESHABILITADO</span>. Todas las
                solicitudes pendientes y aceptadas hasta el momento que incluyan
                al ambiente serán{" "}
                <span style={{ color: "red" }}>RECHAZADAS</span>.
              </p>
            )}
          </>
        ) : (
          <p>
            Todas las solicitudes pendientes y aceptadas asociadas al ambiente
            se actualizarán con la nueva información.
          </p>
        )}
      </ReusableModal>

      <ReusableModal
        show={confirmations}
        handleClose={handleCloseConfirmationsModal}
        title="¡Éxito!"
        footerButtons={saveButtonsConfirmationsModal}
      >
        El ambiente se actualizo con exito
      </ReusableModal>
    </div>
  );
}
export default EditEnvironment;
//{backendError && <p style={{ color: "red" }}>{backendError.message}</p>}
//El ambiente se actualizo con exito
