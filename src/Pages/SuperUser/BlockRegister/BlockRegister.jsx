import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { storeBlock } from "../../../services/classrooms";

function BlockRegister() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [block, setBlock] = useState([]);
  const [formData, setFormData] = useState({
    name_block: "",
    capacity_class: "",
    number_floors: "",
  });

  const [errors, setErrors] = useState({
    name_block: "",
    capacity_class: "",
    number_floors: "",
  });

  useEffect(() => {
    fetchData(`blocks`, setBlock);
  }, []);

  const fetchData = async (endpoint, setterFunction) => {
    try {
      const response = await fetch(URL + endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setterFunction(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
    if (!value) {
      return "Ingrese un número de piso.";
    } else if (value > 6) {
      return "El número de pisos debe ser menor a 6";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.name_block = validateNameBlock(formData.name_block);
    newErrors.capacity_class = validateCapacity(formData.capacity_class);
    newErrors.number_floors = validateFloor(formData.number_floors);

    setErrors(newErrors);
    if (
      !newErrors.name_block &&
      !newErrors.capacity_class &&
      !newErrors.number_floors
    ) {
      const isDuplicateName = block.some(
        (block) => block.block_name === formData.name_block
      );
      if (isDuplicateName) {
        console.log("es igual");
      } else {
        // console.log(formData);
        let newBlock = {
          block_name: formData.name_block,
          block_maxfloor: formData.capacity_class,
          block_maxclassrooms: formData.number_floors,
          block_status_id: 1,
        };
        storeNewBlock(newBlock);
      }
    }
    console.log("LLENE EL FORMULARIO");
  };

  const storeNewBlock = async (newBlock) => {
    let response = await storeBlock(newBlock);
    console.log(response);
    return response;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    const error = validators[name](value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validators = {
    name_block: validateNameBlock,
    capacity_class: validateCapacity,
    number_floors: validateFloor,
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
      name_block: transformedValue,
    });
    const error = validators.name_block(transformedValue);
    setErrors({
      ...errors,
      name_block: error,
    });
  };

  return (
    <Container>
      <h1 className="text-center my-4">Registrar Bloque</h1>
      <Form noValidate onSubmit={handleSubmit}>
        <div>
          <Row className="mb-3 align-items-center">
            <Col md={3} className="d-flex align-items-center">
              <Form.Label className="fw-bold col-form-label mb-0">
                NOMBRE DEL BLOQUE
              </Form.Label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                name="name_block"
                placeholder="Ingrese el nombre del Bloque"
                onKeyDown={handleEnvironmentNameChange}
                value={formData.name_block}
                onChange={handleEnvironmentNameChange}
                isInvalid={!!errors.name_block}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name_block}
              </Form.Control.Feedback>
            </Col>
          </Row>
        </div>

        <Row className="mb-3 align-items-center">
          <Col md={3} className="d-flex align-items-center">
            <Form.Label className="fw-bold col-form-label mb-0">
              CAPACIDAD DE AULAS
            </Form.Label>
          </Col>
          <Col md={4}>
            <Form.Control
              type="number"
              name="capacity_class"
              onKeyDown={handleKeyDown}
              placeholder="Ingrese la capacidad de aulas"
              value={formData.capacity_class}
              onChange={handleChange}
              isInvalid={!!errors.capacity_class}
            />
            <Form.Control.Feedback type="invalid">
              {errors.capacity_class}
            </Form.Control.Feedback>
          </Col>

          <Col md={2} className="d-flex align-items-center">
            <Form.Label className="fw-bold col-form-label mb-0">
              NUMERO DE PISOS
            </Form.Label>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="number_floors"
              min={0}
              onKeyDown={handleKeyDown}
              placeholder="Ingrese el número de pisos"
              value={formData.number_floors}
              onChange={handleChange}
              isInvalid={!!errors.number_floors}
            />
            <Form.Control.Feedback type="invalid">
              {errors.number_floors}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button className="me-3" variant="primary" type="submit">
            Registrar
          </Button>
          <Button variant="secondary" type="button">
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default BlockRegister;
