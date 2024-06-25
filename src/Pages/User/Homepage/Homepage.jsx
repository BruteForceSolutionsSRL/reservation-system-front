import React from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import decanatoFcyt from "./icons/decanatoFcyt.jpg";
import edificioFcyt from "./icons/edificioFcyt.jpg";
import laboratorioFcyt from "./icons/laboratoriosFcyt.jpg";
import logoBFS from "./icons/bfsLogo.png";
import textura1 from "./icons/textura1.png";
import textura2 from "./icons/textura2.png";
import imageLogo from "./logoPequenio.png";
import umssLogo from "./icons/umssLogo.png";
import fcytLogo from "./icons/fcytLogo.png";
import suraLogo from "./icons/suraLogo.png";

import alimentosLogo from "./LogosCarrers/alimentosLogo.png";
import biologiaLogo from "./LogosCarrers/biologiaLogo.png";
import civilLogo from "./LogosCarrers/civilLogo.png";
import electricaLogo from "./LogosCarrers/electricaLogo.png";
import electronicaLogo from "./LogosCarrers/electronicaLogo.png";
import fisicaLogo from "./LogosCarrers/fisicaLogo.png";
import industrialLogo from "./LogosCarrers/industrialLogo.png";
import informaticaLogo from "./LogosCarrers/informaticaLogo.png";
import licenquimicaLogo from "./LogosCarrers/licenquimicaLogo.png";
import matematicasLogo from "./LogosCarrers/matematicasLogo.png";
import mecanicaLogo from "./LogosCarrers/mecanicaLogo.png";
import petroquimicaLogo from "./LogosCarrers/petroquimicaLogo.png";
import quimicaLogo from "./LogosCarrers/quimicaLogo.png";
import sistemasLogo from "./LogosCarrers/sistemasLogo.png";

import image from "./logo.png";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="color-home">
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <img src={imageLogo} alt="Sura Logo" className="logo-image" />
          <Button href="https://www.umss.edu.bo/" className="btn-quote">
            Ingresar
          </Button>
        </div>
      </Container>

      <div className="color-body mt-4">
        <Container className="text-center">
          <Row>
            <Col md={6}>
              <h1 className="fw-bold">
                Sistema universitario de reserva de ambientes (SURA)
              </h1>
              <h4>
                Es una plataforma desarrollada para gestionar las reservas de
                los ambientes en la Facultad de Ciencias y Tecnología de la
                Universidad Mayor de San Simón. Diseñada pensando en las
                necesidades de la comunidad universitaria, SURA permite a
                estudiantes y docentes reservar aulas, laboratorios y otros
                espacios académicos. Nuestra misión es optimizar la gestión y el
                uso de estos espacios, proporcionando una herramienta intuitiva
                y accesible que facilita la organización y planificación de
                actividades académicas. Con SURA, buscamos mejorar la
                experiencia academica al asegurar que los recursos disponibles
                se utilicen de manera efectiva y equitativa, promoviendo así un
                entorno académico más dinámico y productivo.
              </h4>
            </Col>

            <Col md={6} className="image-container mt-5">
              <Carousel>
                <Carousel.Item>
                  <img src={image} alt="Sistema de reserva" className="image" />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={decanatoFcyt}
                    alt="Decanato FCyT"
                    className="image"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={edificioFcyt}
                    alt="Edificio FCyT"
                    className="image"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    src={laboratorioFcyt}
                    alt="Laboratorio FCyT"
                    className="image"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </div>

      <div>
        <Row>
          <Col md={4} className="mt-5 center">
            <img src={umssLogo} alt="textura" className="umss-Logo" />
          </Col>
          <Col md={4} className="mt-5 center">
            <img src={fcytLogo} alt="textura" className="fcyt-Logo" />
          </Col>
          <Col md={4} className="mt-5 center">
            <img src={imageLogo} alt="textura" className="sura-Logo" />
          </Col>
        </Row>
      </div>

      <div className=" color-card mt-5">
        <h1>Alcance de SURA en la Facultad de Ciencias y Tecnología</h1>
        <Row>
          <div className="mt-5">
            <Row>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={alimentosLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería en Alimentos</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://fcapyf.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={biologiaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Licenciatura en Biología</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="http://biologia.fcyt.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={civilLogo}
                        alt="textura"
                        className="civil-Logo"
                      />
                      <div className="fw-bold">Ingeniería Civil</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://civil.fcyt.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={mecanicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Mecanica</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/#"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/***********************************/}

            <Row>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={mecanicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Electromecánica</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/#"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={industrialLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Industrial</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://industrial.fcyt.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={electricaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Eléctrica</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="http://electrica.fcyt.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={electronicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Electrónica</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="http://electronica.fcyt.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={informaticaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Informática</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.cs.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={sistemasLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Licenciatura en Sistemas</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.cs.umss.edu.bo/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={quimicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería Química</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={matematicasLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <div className="fw-bold">Ingeniería en Matemáticas</div>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={matematicasLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <h4 className="fw-bold">Licenciatura en Matemáticas</h4>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={fisicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <h4 className="fw-bold">Licenciatura en Física</h4>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={licenquimicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <h4 className="fw-bold">Licenciatura en Química</h4>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mt-3">
                <Card
                  className="hover-card"
                  style={{ width: "100%" }}
                  border="ligth"
                >
                  <Card.Body>
                    <Card.Title>
                      <img
                        src={petroquimicaLogo}
                        alt="textura"
                        className="mecanica-Logo"
                      />
                      <h4 className="fw-bold">Ingeniería Petroquimica</h4>
                    </Card.Title>
                    <Card.Text>
                      <a
                        href="https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web oficial
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Row>
      </div>

      <div className="footer">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <Container>
          <Row className="footer-bottom">
            <Col md={4}>
              <p>Copyright ©2024. Todos los derechos reservados.</p>
              <p>UMSS - Universidad Mayor de San Simón</p>
              <p>Brute Force Solutions.</p>
              <p>Cochabamba - Bolivia</p>
            </Col>
            <Col md={4}>
              <h4>Universidad Mayor de San Simón</h4>
              <p>Redes sociales</p>
              <div className="social-icons">
                <a href="https://x.com/i/flow/login?redirect_after_login=%2Fumssboloficial">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="https://www.facebook.com/UmssBolOficial/?locale=es_LA">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="https://www.instagram.com/umssboloficial/?hl=es">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/school/umssboloficial/?originalSubdomain=bo">
                  <i className="fa fa-linkedin"></i>
                </a>
              </div>
            </Col>
            <Col md={4}>
              <h4>Brute Force Solutions</h4>
              <p>Cochabamba - Bolvia</p>
              <p>
                <strong>Celular:</strong> +591 72279531
              </p>
              <p>
                <strong>Correo:</strong> bruteforcesolutionsbfs@gmail.com
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Homepage;
