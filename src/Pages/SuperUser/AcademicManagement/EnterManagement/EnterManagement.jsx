import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
function EnterManagement() {
  const [loading, setLoading] = useState(false);
  // const [year, setYear] = useState([]);
  // const [periods, setPeriodos] = useState([]);
  const [formData, setFormData] = useState({
    gestion_id: "",
    period_id: "",
  });

  const [errors, setErrors] = useState({
    gestion_id: "",
    period_id: "",
  });

const validateGestion = (value) => {
  if (!value.trim()) {
    return "Seleccione una gestión.";
  }
  return null;
};

const validatePeriod = (value) => {
  if (!value.trim()) {
    return "Seleccione un periodo academíco.";
  }
  return null;
};


  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.gestion_id = validateGestion(formData.gestion_id);
    newErrors.period_id = validatePeriod(formData.period_id);
    setErrors(newErrors);

    if (!newErrors.gestion_id && !newErrors.period_id) {
      // enviar al back
      console.log("datos del form", formData);
    }
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
    gestion_id: validateGestion,
    period_id: validatePeriod,
  };

  /**DATOS DE PRUEBA BACKEND */
  const year = [
    { gestion_id: 1, gestion: "GESTION 2020" },
    { gestion_id: 2, gestion: "GESTION 2021" },
    { gestion_id: 3, gestion: "GESTION 2022" },
    { gestion_id: 4, gestion: "GESTION 2023" },
    { gestion_id: 5, gestion: "GESTION 2024" },
  ];
  const [gestion, setGestion] = useState(year);

  const peridosA = [
    { period_id: 1, period: "SEMESTRE I-2020" },
    { period_id: 2, period: "SEMESTRE II-2020" },
    { period_id: 3, period: "VERANO 2020" },
    { period_id: 4, period: "INVIERNO 2020" },
  ];
  const [periods, setPeriodos] = useState(peridosA);

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Gestión Academíca</h1>
      {loading === true ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Container>
            <Form onSubmit={handleSubmit} noValidate>
              <Row className="mb-3">
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      GESTION ACADEMICA
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} md={10}>
                  <Form.Select
                    type="input"
                    aria-label="Select environment type"
                    name="gestion_id"
                    value={formData.gestion_id}
                    onChange={handleChange}
                    isInvalid={!!errors.gestion_id}
                  >
                    <option value="">Seleccione una gestión</option>
                    {gestion.map((option) => (
                      <option key={option.gestion_id} value={option.gestion_id}>
                        {option.gestion}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gestion_id}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={2}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      PERIODO ACADEMICO
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} md={10}>
                  <Form.Select
                    aria-label="Select environment type"
                    type="input"
                    name="period_id"
                    value={formData.period_id}
                    onChange={handleChange}
                    isInvalid={!!errors.period_id}
                  >
                    <option value="">Seleccione un periodo academíco</option>
                    {periods.map((option) => (
                      <option key={option.period_id} value={option.period_id}>
                        {option.period}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.period_id}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3">
                <Button
                  type="submit"
                  className="me-3 custom-btn-green custom-btn-green-outline btn btn-success"
                >
                  Ingresar
                </Button>
              </div>
            </Form>
          </Container>
        </>
      )}
    </div>
  );
}

export default EnterManagement;
