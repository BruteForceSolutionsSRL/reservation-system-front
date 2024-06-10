// import { Link } from "react-router-dom";
// import "./LandingPage.css";

// export default function LandingPage() {
//   const userSession = () => {
//     const user = {
//       name: "MAGDA LENA PEETERS ILONAA",
//       teacher_id: 2,
//     };
//     sessionStorage.setItem("userloged", "user");
//     sessionStorage.setItem("userInformation", JSON.stringify(user));
//   };
//   const superUserSession = () => {
//     const user = {
//       name: "Juanito Perez ",
//       teacher_id: 2,
//     };
//     sessionStorage.setItem("userloged", "superuser");
//     sessionStorage.setItem("userInformation", JSON.stringify(user));
//   };
//   return (
//     <div className="bg text-center">
//       <h1>This is a landing page</h1>
//       <div>
//         <div>
//           <Link to="/user/home" onClick={userSession}>
//             Ingresar como usuario
//           </Link>
//         </div>
//         <div>
//           <Link to="/superuser/home" onClick={superUserSession}>
//             Ingresar como administrador
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import "./LandingPage.css";
// import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
// import { Envelope, Eye, EyeSlash } from "react-bootstrap-icons";
import "../../../src/main";

const LandingPage = ({ setAuthToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      // Redirigir a la página de inicio del usuario
      window.location.href = "/user/home";
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const userSession = () => {
    const user = {
      name: "MAGDA LENA PEETERS ILONAA",
      teacher_id: 2,
    };
    sessionStorage.setItem("userloged", "user");
    sessionStorage.setItem("userInformation", JSON.stringify(user));
  };

  const superUserSession = () => {
    const user = {
      name: "Juanito Perez ",
      teacher_id: 2,
    };
    sessionStorage.setItem("userloged", "superuser");
    sessionStorage.setItem("userInformation", JSON.stringify(user));
  };

  return (
    <div className="landing-page">
      <Container>
        <Row className="justify-content-center">
          <Col>
            <div className="card-container">
              <Card className="text-center">
                <Card.Body>
                  <Card.Text className="card-text">
                    <strong>SURA</strong> (Sistema Universitario de Reserva de
                    Ambientes) es una plataforma diseñada para facilitar la
                    reserva de ambientes en la Facultad de Ciencias y Tecnología
                    de la <strong>Universidad Mayor de San Simón</strong>.
                    Nuestra misión es optimizar la gestión y el uso de los
                    espacios académicos, brindando una herramienta eficiente y
                    accesible para estudiantes y docentes.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h1 className="text-center">SURA</h1>
                  <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Correo electrónico</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="email"
                          placeholder="Correo electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputGroup.Text>
                          {/* <FaEnvelope /> */}
                          <Envelope />
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Contraseña</Form.Label>

                      <InputGroup>
                        <Form.Control
                          // type="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroup.Text onClick={togglePasswordVisibility}>
                          {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <Button variant="primary" className="mt-3">
                      <Link
                        className="text-white"
                        to="/user/home"
                        onClick={userSession}
                      >
                        Usuario
                      </Link>
                    </Button>

                    <div className="mt-3">
                      <Button variant="secondary">
                        <Link
                          className="text-white"
                          to="/superuser/home"
                          onClick={superUserSession}
                        >
                          Administrador
                        </Link>
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
