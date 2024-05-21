import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { searchRequests } from "../../../utils/searchRequests";
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
  const url = import.meta.env.VITE_REACT_API_URL;

  const handleShowModal = (reservation) => {
    setCurrentReservation({ ...reservation, errors: {} });
    setShowModal(true);
  };

  const handleCloseModal = () => {
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
        classroom_id: currentReservation.classroom_id,
        capacity: currentReservation.capacity,
        type_id: currentReservation.classroom_type_id,
        block_id: currentReservation.block_id,
        floor_number: currentReservation.floor,
        status_id: currentReservation.classroom_status_name,
      };

      //Send in BackEnd
      sendData(newDataEnvironment, currentReservation.classroom_id)
        .then((responseMessage) => {
          console.log("Modificacion exitosa:", responseMessage);
          console.log("Campos modificados:", changedFields);

          //Estatus and update list
          setAllReservations(updatedReservations);
          setList(updatedReservations);
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error al enviar los datos:", error);
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
      onClick: handleSaveChanges,
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleCloseModal,
    },
  ];

  // Botton Save
  const saveButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleSaveChanges,
    },
    {
      label: "Cancelar",
      variant: "secondary",
      onClick: handleCloseModal,
    },
  ];
  //  Botton Cancel
  const cancelButtonsModal = [
    {
      label: "Aceptar",
      variant: "primary",
      onClick: handleSaveChanges,
    },
    {
      label: "Atras",
      variant: "secondary",
      onClick: handleCloseModal,
    },
  ];

  // useEffect para búsqueda
  useEffect(() => {
    if (searchValue === "") {
      setList(allReservations);
      setMsgNoResults("");
    } else {
      const results = searchRequests(allReservations, searchValue);
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
    console.log("SE VERIFICO", key);
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
            <ListEnvironment
              list={allReservations}
              handleShowModal={handleShowModal}
            />
          </div>
        )}
      </div>
      <ReusableModal
        show={showModal}
        handleClose={handleCloseModal}
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
    </div>
  );
}

export default EditEnvironment;
