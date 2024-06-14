import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "./EnvironmentRegistration.css";

// export default function EnvironmentRegistration() {
const EnvironmentRegistration = () => {
  const [environmentName, setEnvironmentName] = useState("");
  const [environmentType, setEnvironmentType] = useState("");
  const [environmentCapacity, setEnvironmentCapacity] = useState("");
  const [environmentBlock, setEnvironmentBlock] = useState("");
  const [environmentFloor, setEnvironmentFloor] = useState("");
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [capacityError, setCapacityError] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [floorError, setFloorError] = useState(false);
  const [blockOptions, setBlockOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [maxFloor, setMaxFloor] = useState("");
  const [loading, setLoading] = useState(false);
  const [spanLoading, setSpanLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [modalResponseData, setModalResponseData] = useState({
    show: false,
    title: "",
    message: "",
    showAccept: true,
    onAccept: () => {},
    showCancel: true,
  });

  const url = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchBlockOptions();
      await fetchTypes();
      await fetchClassrooms();
      setTimeout(() => {
        setLoading(false);
        setReload(false);
      }, 200);
    };

    fetchData();
  }, [reload]);

  const fetchBlockOptions = () => {
    fetch(url + "blocks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [
          { block_id: "", block_name: "Seleccione..." },
          ...data, // add Seleccione...
        ];
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
        const optionsWithDefault = [
          { type_id: "", type_name: "Seleccione..." },
          ...data, // add Seleccione...
        ];
        setTypeOptions(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const fetchClassrooms = () => {
    fetch(url + "classrooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error de conexion");
        }
        return response.json();
      })
      .then((data) => {
        setClassroomOptions(data);
      })
      .catch((error) => {
        console.error("Error obteniendo opciones: ", error);
      });
  };

  const validateAlphanumeric = (input) => {
    const alphanumericRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\-.'\s]+$/;
    return alphanumericRegex.test(input);
  };

  const handleEnvironmentNameChange = (event) => {
    let value = event.target.value.toUpperCase();
    value = value
      .split("")
      .filter((char) => /[a-zA-Z0-9\-.'\s]/.test(char))
      .join("");

    setEnvironmentName(value);
    setNameError(
      value.length < 3 ||
        value.length > 30 ||
        value === "" ||
        !validateAlphanumeric(value)
    );
  };

  const handleEnvironmentTypeChange = (event) => {
    const value = event.target.value;
    setEnvironmentType(value);
    setTypeError(value === ""); //error if empty
  };

  const handleEnvironmentCapacityChange = (event) => {
    const capacity = parseInt(event.target.value, 10);

    setEnvironmentCapacity(capacity);
    if (capacity >= 0 && capacity <= 1000 && !isNaN(capacity)) {
      setCapacityError(false);
    } else {
      setCapacityError(true);
      setEnvironmentCapacity("");
    }
    if (capacity < 25) {
      setCapacityError(true);
    }
  };

  const handleBlockChange = (event) => {
    const value = event.target.value;
    setEnvironmentBlock(value);
    setFloorError(false);
    setBlockError(value === "");
    setEnvironmentFloor("");

    const selectedBlock = blockOptions.find(
      (option) => option.block_id === Number(value)
    );

    if (selectedBlock) {
      setMaxFloor(selectedBlock.block_maxfloor);
    } else {
      setMaxFloor("");
    }
  };

  //effect to perform actions after updating maxFloor
  useEffect(() => {
    // console.log("Valor actual de maxFloor:", maxFloor);

    if (maxFloor !== "") {
      // console.log("Piso máximo:", maxFloor);
    }
  }, [maxFloor]);

  const handleFloorChange = (event) => {
    const enteredFloor = parseInt(event.target.value, 10);
    setEnvironmentFloor(enteredFloor);
    //const isValidRange = parseInt(value, 10) >= 0 //&& parseInt(value, 10) <= 200;

    if (!isNaN(enteredFloor) && enteredFloor <= maxFloor && enteredFloor >= 0) {
      setFloorError(false); // valid floor
    } else {
      setFloorError(true); // invalid floor
      setEnvironmentFloor("");
    }
  };

  const isFloorDisable = (maxFloor) => {
    return (
      maxFloor < 0 ||
      maxFloor === null ||
      maxFloor === undefined ||
      maxFloor === ""
    );
  };

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

  const handleCancelClick = () => {
    setModalResponseData({
      show: true,
      title: "Cancelar Registro",
      message: "¿Estás seguro que quieres cancelar?",
      showAccept: true,
      onAccept: handleCancelConfirmation,
      showCancel: true,
    });
  };

  const handleCancelConfirmation = () => {
    handleHideModal();
    resetForm();
  };
  // Sin usar
  const handleModalClose = () => {
    setShowCancelModal(false);
    setShowConfirmModal(false);
  };

  const handleHideModal = () => {
    setModalResponseData((modalData) => ({ ...modalData, show: false }));
  };
  const handleHideModalSuccess = () => {
    setModalResponseData((modalData) => ({ ...modalData, show: false }));
    resetForm();
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const isDuplicateName = classroomOptions.some(
      (classroom) => classroom.classroom_name === environmentName
    );

    if (isDuplicateName) {
      setModalResponseData({
        show: true,
        title: "¡Advertencia!",
        message: `El ambiente ${environmentName} ya existe.`,
        showAccept: true,
        onAccept: handleHideModal,
        showCancel: false,
      });
      return;
    }
    if (
      !environmentName ||
      !environmentType ||
      !environmentCapacity ||
      !environmentBlock ||
      !(environmentFloor >= 0) ||
      nameError ||
      typeError ||
      capacityError ||
      blockError ||
      floorError
    ) {
      setNameError(!environmentName);
      setTypeError(!environmentType);
      setCapacityError(!environmentCapacity);
      setBlockError(!environmentBlock);
      setFloorError(!environmentFloor);
      return;
    }
    setSpanLoading(true);
    setTimeout(() => {
      setSpanLoading(false);
      setModalResponseData({
        show: true,
        title: "¡Confirmación!",
        message: "¿Está seguro de registrar el ambiente?",
        showAccept: true,
        onAccept: handleSubmit,
        showCancel: true,
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (
      !environmentName ||
      !environmentType ||
      !environmentCapacity ||
      !environmentBlock ||
      !(environmentFloor >= 0) ||
      nameError ||
      typeError ||
      capacityError ||
      blockError ||
      floorError
    ) {
      setNameError(!environmentName);
      setTypeError(!environmentType);
      setCapacityError(!environmentCapacity);
      setBlockError(!environmentBlock);
      setFloorError(!environmentFloor);
      return;
    }

    const formData = {
      classroom_name: environmentName,
      capacity: environmentCapacity,
      type_id: environmentType,
      block_id: environmentBlock,
      floor_number: environmentFloor,
    };

    const url = import.meta.env.VITE_REACT_API_URL;

    return fetch(url + "classrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      mode: "cors",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        return response.json();
      })
      .then((data) => {
        setModalResponseData({
          show: true,
          title: "¡Exíto!",
          message: "El registro se realizo con exito.",
          showAccept: true,
          onAccept: handleHideModalSuccess,
          showCancel: false,
        });
      })
      .catch((error) => {
        setModalResponseData({
          show: true,
          title: "¡Error!",
          message: `La solicitud no pudo enviarse debido a : ${error.message}.`,
          showAccept: true,
          onAccept: handleHideModal,
          showCancel: false,
        });
      });
  };

  const resetForm = () => {
    setEnvironmentName("");
    setEnvironmentType("");
    setEnvironmentCapacity("");
    setEnvironmentBlock("");
    setEnvironmentFloor("");
    setNameError(false);
    setTypeError(false);
    setCapacityError(false);
    setBlockError(false);
    setFloorError(false);
    setMaxFloor("");
  };

  return (
    <div>
      <h1 className="mt-3  mb-3">Registrar Ambiente</h1>
      {loading === true ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Container>
            <Form onSubmit={handleRegister} noValidate>
              <Row className="mb-3">
                <Col xs={12} md={2}>
                  <Form.Group controlId="formEnvironmentName">
                    <Form.Label className="fw-bold">
                      NOMBRE DE AMBIENTE
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} md={10}>
                  <Form.Control
                    type="text"
                    value={environmentName}
                    onChange={handleEnvironmentNameChange}
                    isInvalid={nameError}
                    required
                  />
                  {nameError && (
                    <Form.Text className="text-danger mt-2">
                      El nombre no debe tener caracteres especiales.
                    </Form.Text>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={2} >
                  <Form.Group controlId="formEnvironmentType">
                    <Form.Label className="fw-bold">
                      TIPO DE AMBIENTE
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} md={10}>
                  <Form.Select
                    aria-label="Select environment type"
                    value={environmentType}
                    onChange={handleEnvironmentTypeChange}
                    isInvalid={typeError}
                    required
                  >
                    {typeOptions.map((option) => (
                      <option key={option.type_id} value={option.type_id}>
                        {option.type_name}
                      </option>
                    ))}
                  </Form.Select>
                  {typeError && (
                    <Form.Text className="text-danger mt-2">
                      Debes seleccionar un tipo de ambiente válido.
                    </Form.Text>
                  )}
                </Col>
              </Row>

              <Row className="mb-3 mt-4">
                <Col xs={12} md={2}>
                  <Form.Group controlId="formEnvironmentCapacity">
                    <Form.Label className="fw-bold">
                      CAPACIDAD DE AMBIENTE
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} md={10}>
                  <Form.Control
                    type="number"
                    max={1000}
                    min={25}
                    onKeyDown={handleKeyDown}
                    value={environmentCapacity}
                    onChange={handleEnvironmentCapacityChange}
                    isInvalid={capacityError}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                    required
                  />
                  {capacityError && (
                    <Form.Text className="text-danger mt-2">
                      La capacidad del ambiente debe ser positiva.
                    </Form.Text>
                  )}
                </Col>
              </Row>

              <div className="tag-container position-relative mb-3 mt-4">
                <label className="tag-label">Ubicacion del Ambiente</label>
                <Container>
                  <Row className="mb-3">
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formBlock">
                        <Form.Label className="fw-bold">BLOQUE</Form.Label>
                        <Form.Select
                          value={environmentBlock}
                          onChange={handleBlockChange}
                          isInvalid={blockError && environmentBlock === ""}
                          required
                        >
                          {blockOptions.map((option) => (
                            <option
                              key={option.block_id}
                              value={option.block_id}
                            >
                              {option.block_name}
                            </option>
                          ))}
                        </Form.Select>
                        {blockError && (
                          <Form.Text className="text-danger">
                            Debe seleccionar un bloque válido.
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                      <Form.Group controlId="formFloor">
                        <Form.Label className="fw-bold">PISO</Form.Label>
                        <Form.Control
                          type="number"
                          onKeyDown={handleKeyDown}
                          max={maxFloor}
                          min={0}
                          value={environmentFloor}
                          onChange={handleFloorChange}
                          isInvalid={floorError && environmentFloor === ""}
                          disabled={isFloorDisable(maxFloor)}
                          onPaste={(e) => {
                            e.preventDefault();
                          }}
                        />
                        {floorError && environmentFloor === "" && (
                          <Form.Text className="text-danger">
                            El piso no debe ser negativo.
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
              </div>

              <div className="d-flex justify-content-end mt-3">
                {spanLoading ? (
                  <Spinner
                    className="me-3"
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  ""
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="me-3"
                  disabled={spanLoading}
                >
                  Registrar
                </Button>
                <Button
                  variant="secondary"
                  className="me-3"
                  onClick={handleCancelClick}
                  disabled={spanLoading}
                >
                  Cancelar
                </Button>
              </div>
            </Form>

            <CModal
              show={modalResponseData.show}
              onHide={handleHideModal}
              title={modalResponseData.title}
              message={modalResponseData.message}
              showAccept={modalResponseData.showAccept}
              onAccept={modalResponseData.onAccept}
              showCancel={modalResponseData.showCancel}
              onCancel={handleHideModal}
            />
          </Container>
        </>
      )}
    </div>
  );
};

const CModal = ({
  show,
  onHide,
  title,
  message,
  showAccept,
  onAccept,
  showCancel,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptClick = async () => {
    setIsLoading(true);
    await onAccept();
    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        {isLoading ? <Spinner animation="border" variant="primary" /> : ""}
        {showAccept && (
          <Button
            variant="primary"
            onClick={handleAcceptClick}
            disabled={isLoading}
          >
            Aceptar
          </Button>
        )}
        {showCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EnvironmentRegistration;
