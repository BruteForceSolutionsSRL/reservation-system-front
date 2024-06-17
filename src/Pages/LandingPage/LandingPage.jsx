import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import "./LandingPage.css";

const LandingPage = ({ setAuthToken, authToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("DOCENTES");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const url = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    // if (!!authToken) {
    //     if (activeTab === "DOCENTES") {
    //         navigate("/user/home");
    //       } else {
    //           navigate("/superuser/home");
    //         }
    //       }
    let userLogged = JSON.parse(localStorage.getItem("userInformation"));
    let token = localStorage.getItem("token");
    console.log(userLogged);
    console.log(token);
    if (!!token) {
      if (userLogged.roles[0] === "DOCENTE") {
        navigate("/user/home");
      } else {
        navigate("/superuser/home");
      }
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    let validationErrors = {};
    if (!email) validationErrors.email = "El correo electrónico es obligatorio";
    if (!password) validationErrors.password = "La contraseña es obligatoria";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(url + "login", {
        email,
        password,
      });
      console.log(response);
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem(
        "userInformation",
        JSON.stringify(response.data.user)
      );
      setAuthToken(token);

      // if (activeTab === "DOCENTE") {
      //   navigate("/user/home");
      // } else {
      //   navigate("/superuser/home");
      // }

      console.log(response.data.user);
      if (response.data.user.roles[0] === "DOCENTE") {
        navigate("/user/home");
      } else {
        navigate("/superuser/home");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        setAlertMessage("Credenciales incorrectas. Intente nuevamente.");
      } else {
        setAlertMessage(
          "Error al intentar iniciar sesión. Intente nuevamente más tarde."
        );
      }
      setShowAlert(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" }); // Limpiar el mensaje de error
    setShowAlert(false); // Ocultar la alerta al empezar a corregir el campo
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" }); // Limpiar el mensaje de error
    setShowAlert(false); // Ocultar la alerta al empezar a corregir el campo
  };

  return (
    <>
      <Container className="landing-container p-4">
        <div>
          <Row className="row-container">
            <Col xs="3">
              <h1 className="pb-4">SURA</h1>
            </Col>
            <Col xs="3">
              <Button
                variant={
                  activeTab === "ADMINISTRADORES"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setActiveTab("ADMINISTRADORES")}
                className="nav-button text-truncate"
              >
                ADMINISTRADORES
              </Button>
            </Col>
            <Col xs="3">
              <Button
                variant={
                  activeTab === "DOCENTES" ? "primary" : "outline-primary"
                }
                onClick={() => setActiveTab("DOCENTES")}
                className="nav-button text-truncate"
              >
                DOCENTES
              </Button>
            </Col>
            {/* <Col xs="3">
              <Button
                variant={
                  activeTab === "INVITADOS" ? "primary" : "outline-primary"
                }
                onClick={() => setActiveTab("INVITADOS")}
                className="nav-button"
              >
                INVITADOS
              </Button>
            </Col> */}
          </Row>
        </div>
      </Container>
      <div className="landing-page">
        <Container className="landing-container">
          <Row className="justify-content-center">
            <Col xs={12} md={6} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <Card.Text className="card-text">
                    <strong>SURA</strong>
                    <br /> (Sistema Universitario de Reserva de Ambientes) es
                    una plataforma diseñada para facilitar la reserva de
                    ambientes en la Facultad de Ciencias y Tecnología de la{" "}
                    <strong>Universidad Mayor de San Simón</strong>. Nuestra
                    misión es optimizar la gestión y el uso de los espacios
                    académicos, brindando una herramienta eficiente y accesible
                    para estudiantes y docentes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card>
                <Card.Body>
                  <h2 className="text-center text-truncate">{activeTab}</h2>
                  <hr />
                  <h3 className="text-center">Iniciar Sesión</h3>

                  {showAlert && (
                    <Alert
                      variant="danger"
                      onClose={() => setShowAlert(false)}
                      dismissible
                    >
                      {alertMessage}
                    </Alert>
                  )}
                  <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                      <InputGroup className="p-1">
                        <Form.Control
                          type="email"
                          placeholder="Correo electrónico"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <InputGroup.Text>
                          <i className="bi bi-envelope"></i>
                        </InputGroup.Text>
                      </InputGroup>
                      {errors.email && (
                        <div style={{ color: "red" }}>{errors.email}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <InputGroup className="p-1">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                        <InputGroup.Text
                          onClick={togglePasswordVisibility}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? (
                            <i className="bi bi-eye-slash"></i>
                          ) : (
                            <i className="bi bi-eye"></i>
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                      {errors.password && (
                        <div style={{ color: "red" }}>{errors.password}</div>
                      )}
                    </Form.Group>

                    <div className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        className="mt-3 px-5"
                        onClick={handleLogin}
                      >
                        Iniciar Sesión
                      </Button>
                    </div>
                  </Form>
                  <hr />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="landing-container">
        <div className="contact-info text-truncate">
          <p>
            <strong className="pe-1">Contacto:</strong>
            <a href="mailto:bruteforcesolutionsbfs@gmail.com">
              bruteforcesolutionsbfs@gmail.com
            </a>
          </p>
        </div>
      </Container>
    </>
  );
};

export default LandingPage;
