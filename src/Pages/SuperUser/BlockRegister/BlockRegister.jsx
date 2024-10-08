import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Spinner, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { storeBlock } from "../../../services/classrooms";
import "./BlockRegister.css";

function BlockRegister() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [block, setBlock] = useState([]);
  const [registerModal, setRegisterModal] = useState(false);
  const [cancelRegisterModal, setCancelRegisterModal] = useState(false);
  const [existBlockModal, setExistBlockModal] = useState(false);
  const [confimationModal, setConfimationModal] = useState(false);
  const [backendError, setBackendError] = useState({});
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    maxclassrooms: "",
    maxfloor: "",
    block_status_id: 1,
    faculty_id: 1,
  });

  const [errors, setErrors] = useState({
    name: "",
    maxclassrooms: "",
    maxfloor: "",
    block_status_id: 1,
    faculty_id: 1,
  });

  useEffect(() => {
    fetchData(`blocks`, setBlock);
    fetchFaculties();
  }, []);

  const fetchData = async (endpoint, setterFunction) => {
    try {
      let token = localStorage.getItem("token");
      const response = await fetch(URL + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setterFunction(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFaculties = async () => {
    const response = await fetch(URL + "faculties");
    const data = await response.json();
    if (response.status >= 200 && response.status < 300) {
      setFaculties(data);
      setFormData({ ...formData, faculty_id: data[0].faculty_id });
    } else {
      setFaculties([]);
    }
  };

  /*/************ */
  function cancelRegister() {
    setCancelRegisterModal(true);
  }

  function clearFormRegister() {
    clearDataForm();
    setCancelRegisterModal(false);
  }

  function backRegisterClear() {
    setCancelRegisterModal(false);
  }

  function blockExist() {
    setExistBlockModal(false);
  }
  /*************************************** */
  // CANCELAR Y CERRAR BOTON X
  const handleSaveCancelModal = () => {
    setRegisterModal(false);
  };

  // REGISTRAR BLOQUE
  const handleSaveModal = () => {
    setRegisterModal(true);
  };

  const saveBlock = async () => {
    setConfirmationLoading(true);
    const response = await storeNewBlock(formData).finally(() => {
      setConfirmationLoading(false);
      setRegisterModal(false);
    });

    if (response) {
      if (response.status >= 200 && response.status < 300) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
        clearDataForm();
      } else if (response.status >= 300 && response.status < 400) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
      } else if (response.status >= 400 && response.status < 500) {
        setBackendError({
          status: response.status,
          data: response.data.message,
        });
      } else if (response.status >= 500) {
        if (response.data.message) {
          setBackendError({
            status: response.status,
            data: response.data.message,
          });
        } else {
          setBackendError({
            ...backendError,
            data: "Ocurrio un error inesperado, intente nuevamente.",
          });
        }
      }
    } else {
      setBackendError({
        ...backendError,
        data: "Ocurrio un error inesperado, intente nuevamente.",
      });
    }
    setConfimationModal(true);
  };

  function saveBlockClose() {
    setConfimationModal(false);
    fetchData(`blocks`, setBlock);
  }
  /*************************** */

  function clearDataForm() {
    setFormData({
      name: "",
      maxclassrooms: "",
      maxfloor: "",
      block_status_id: 1,
      faculty_id: 1,
    });
    setErrors({
      name: "",
      maxclassrooms: "",
      maxfloor: "",
      block_status_id: 1,
      faculty_id: 1,
    });
  }

  const validateNameBlock = (value) => {
    if (!value) {
      return "Ingrese el nombre del bloque.";
    }
    return null;
  };

  const validateCapacity = (value) => {
    if (!value) {
      return "Ingrese una capacidad.";
    } else if (value < 1 || value > 25) {
      return "La cantidad de aulas debe ser mayor a 0 y menor a 26.";
    }
    return null;
  };

  const validateFloor = (value) => {
    if (!value && value !== 0) {
      return "Ingrese un número de piso.";
    } else if (value < 0 || value >= 7) {
      return "El número de pisos debe ser mayor o igual a 0 y menor a 7.";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.name = validateNameBlock(formData.name);
    newErrors.maxclassrooms = validateCapacity(formData.maxclassrooms);
    newErrors.maxfloor = validateFloor(formData.maxfloor);

    setErrors(newErrors);
    if (!newErrors.name && !newErrors.maxclassrooms && !newErrors.maxfloor) {
      const isDuplicateName = block.some(
        (block) => block.name === formData.name
      );
      if (isDuplicateName) {
        setExistBlockModal(true);
      } else {
        handleSaveModal();
      }
    }
  };

  const storeNewBlock = async (newBlock) => {
    let response = await storeBlock(newBlock);
    return response;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    if (name === "maxclassrooms" || name === "maxfloor") {
      if (updatedValue.length > 1 && updatedValue.startsWith("0")) {
        updatedValue = updatedValue.substring(1);
      }
      if (name === "maxclassrooms" && updatedValue > 50) {
        updatedValue = 1;
      }
      if (name === "maxfloor" && updatedValue > 30) {
        updatedValue = 0;
      }
    }
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
    const error = validators[name](updatedValue);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validators = {
    name: validateNameBlock,
    maxclassrooms: validateCapacity,
    maxfloor: validateFloor,
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

  const handleEnvironmentNameChange = (event) => {
    const { value } = event.target;
    const transformedValue = value
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z0-9\s\-]/.test(char))
      .join("");
    setFormData({
      ...formData,
      name: transformedValue,
    });

    const error = validators.name(transformedValue);
    setErrors({
      ...errors,
      name: error,
    });
  };

  return (
    <div className="color-font">
      <Container>
        <h1 className="text-center py-4">Registrar Bloque</h1>
        <Form noValidate onSubmit={handleSubmit} className="formulario">
          <div>
            <div className="d-flex align-items-center">
              <b>FACULTAD: </b>
              <select
                value={formData.faculty_id}
                onChange={(e) => {
                  setFormData({ ...formData, faculty_id: e.target.value });
                }}
                className="form-select ms-2"
              >
                {faculties.map((f) => {
                  return (
                    <option value={f.faculty_id} key={f.faculty_id}>
                      {f.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <Row className="mb-3 align-items-center">
              <Col md={3} className="d-flex align-items-center">
                <Form.Label className="fw-bold col-form-label mb-0">
                  NOMBRE DEL BLOQUE
                </Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="input"
                  name="name"
                  placeholder="Ingrese el nombre del Bloque"
                  value={formData.name}
                  onChange={handleEnvironmentNameChange}
                  isInvalid={!!errors.name}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Col>
            </Row>
          </div>

          <Row className="mb-3 mt-4">
            <Col md={3} className=" align-items-center">
              <Form.Label className="fw-bold col-form-label mb-0">
                CAPACIDAD DE AULAS
              </Form.Label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="number"
                name="maxclassrooms"
                onKeyDown={handleKeyDown}
                placeholder="Ingrese la capacidad de aulas"
                value={formData.maxclassrooms}
                onChange={handleChange}
                isInvalid={!!errors.maxclassrooms}
                max={50}
                min={1}
                onPaste={(e) => {
                  e.preventDefault();
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.maxclassrooms}
              </Form.Control.Feedback>
            </Col>

            <Col md={2} className="d-flex ">
              <Form.Label className="fw-bold col-form-label mb-0">
                NUMERO DE PISOS
              </Form.Label>
            </Col>
            <Col md={3}>
              <Form.Control
                type="number"
                name="maxfloor"
                onKeyDown={handleKeyDown}
                placeholder="Ingrese el número de pisos"
                value={formData.maxfloor}
                onChange={handleChange}
                isInvalid={!!errors.maxfloor}
                max={30}
                min={1}
                onPaste={(e) => {
                  e.preventDefault();
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.maxfloor}
              </Form.Control.Feedback>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button
              className="me-3 custom-btn-green custom-btn-green-outline btn btn-success"
              type="submit"
            >
              Registrar
            </Button>
            <Button
              className="custom-btn-gray-outline"
              variant="secondary"
              type="button"
              onClick={cancelRegister}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>

      <Modal
        show={registerModal}
        onHide={handleSaveCancelModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Está seguro de registrar el bloque "{formData.name}"?</div>
        </Modal.Body>
        <Modal.Footer>
          {confirmationLoading && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status" />
            </div>
          )}
          <Button className="custom-btn-primary-outline" onClick={saveBlock}>
            Aceptar
          </Button>
          <Button
            className="custom-btn-gray-outline"
            variant="secondary"
            onClick={handleSaveCancelModal}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={cancelRegisterModal}
        onHide={backRegisterClear}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancelar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>¿Estás seguro que quieres cancelar?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="custom-btn-primary-outline"
            onClick={clearFormRegister}
          >
            Aceptar
          </Button>
          <Button
            className="custom-btn-gray-outline"
            variant="secondary"
            onClick={backRegisterClear}
          >
            Atrás
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={existBlockModal}
        onHide={blockExist}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>¡Advertencia!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>El ambiente "{formData.name}" ya existe.</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-btn-primary-outline" onClick={blockExist}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={confimationModal}
        onHide={saveBlockClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {backendError.status === 200 ? "¡Exito!" : "¡Error!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{backendError.data}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="custom-btn-primary-outline"
            onClick={saveBlockClose}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BlockRegister;
