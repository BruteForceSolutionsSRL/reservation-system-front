import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Form, Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("DOCENTES");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <Container className="landing-container p-4">
      <div>
        <Row className="row-container">
          <Col xs="3">
            <h1 className="pb-4">SURA</h1>
          </Col>
          <Col xs="3">
            <Button
              variant={
                activeTab === "ADMINISTRADORES" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveTab("ADMINISTRADORES")}
              className="nav-button"
            >
              ADMINISTRADORES
            </Button>
          </Col>
          <Col xs="3">
            <Button
              variant={activeTab === "DOCENTES" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("DOCENTES")}
              className="nav-button"
            >
              DOCENTES
            </Button>
          </Col>
          <Col xs="3">
            <Button
              variant={
                activeTab === "INVITADOS" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveTab("INVITADOS")}
              className="nav-button"
            >
              INVITADOS
            </Button>
          </Col>
        </Row>
      </div>
      {/* Resto del formulario */}
    </Container>

    // <Navbar bg="dark" variant="dark" expand="lg">
    // <Navbar expand="lg">
    //   <Container className="p-4">
    //     <h1 className="text-center pb-4">SURA</h1>
    //     <div>
    //       <Row className="justify-content-center mb-4">
    //         <Col xs="auto">
    //           <Button
    //             variant={
    //               activeTab === "Administradores"
    //                 ? "primary"
    //                 : "outline-primary"
    //             }
    //             onClick={() => setActiveTab("Administradores")}
    //             className="nav-button"
    //           >
    //             Administradores
    //           </Button>
    //         </Col>
    //         <Col xs="auto">
    //           <Button
    //             variant={
    //               activeTab === "Docentes" ? "primary" : "outline-primary"
    //             }
    //             onClick={() => setActiveTab("Docentes")}
    //             className="nav-button"
    //           >
    //             Docentes
    //           </Button>
    //         </Col>
    //         <Col xs="auto">
    //           <Button
    //             variant={
    //               activeTab === "Invitados" ? "primary" : "outline-primary"
    //             }
    //             onClick={() => setActiveTab("Invitados")}
    //             className="nav-button"
    //           >
    //             Invitados
    //           </Button>
    //         </Col>
    //       </Row>
    //     </div>
    //     {/* Resto del formulario */}
    //   </Container>
    /* <Container>
        <Navbar.Brand as={Link} to="/">
          SURA
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/user/home">
              Docentes
            </Nav.Link>
            <Nav.Link as={Link} to="/superuser/home">
              Administradores
            </Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Navbar.Collapse>
      </Container> */
    // </Navbar>
  );
};

export default NavBar;
