import { Col, Row, Container, Carousel } from "react-bootstrap";
import linkedinIcon from "./icons/linkedin.png";
import facebookIcon from "./icons/facebook.png";
import whatsappIcon from "./icons/whatsapp.png";
import youtubeIcon from "./icons/youtube.png";
import decanatoFcyt from "./icons/decanatoFcyt.jpg";
import edificioFcyt from "./icons/edificioFcyt.jpg";
import laboratorioFcyt from "./icons/laboratoriosFcyt.jpg";
import imageLogo from "./logoPequeño.png";
import image from "./logo.png";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="homepage">
      <div className="header">
        <div className="container-fluid">
          <div className="logo-container d-flex align-items-center">
            <img src={imageLogo} alt="Sura Logo" className="logo-image" />
          </div>
          <ul className="nav">
            {[
              { label: "Home", href: "#home" },
              { label: "Information", href: "#services" },
              { label: "About", href: "#about" },
              { label: "Contact", href: "#contact" },
            ].map((item, index) => (
              <li key={index}>
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Container className="main-content text-center">
        <Row>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h1>Sistema universitario de reserva de ambientes</h1>
            <p>
              SURA(Sistema Universitario de Reserva de Ambientes) es una
              plataforma diseñada para hacer reservas de ambientes en la
              Facultad de Ciencias y Tecnología de la Universidad Mayor de San
              Simón. Nuestra misión es optimizar la gestión y el uso de los
              espacios académicos, brindando una herramienta eficiente y
              accesible para estudiantes y docentes.
            </p>

            <button
              className="check-work-button"
              href="http://fcyt.umss.edu.bo/"
            >
              Visita Fyct!
            </button>
          </Col>
          <Col md={6} className="image-container">
            <Carousel>
              <Carousel.Item>
                <img src={image} alt="Sistema de reserva" className="image" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={decanatoFcyt} alt="Decanato FCyT" className="image" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={edificioFcyt} alt="Edificio FCyT" className="image" />
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

      <div className="footer">
        <Container>
          <Row>
            <Col md={6}>
              <div className="footer-info">
                <div>Copyright ©2024. Todos los derechos reservados.</div>
                <div>Brute Force Solutions.</div>
                <div>UMSS - Universidad Mayor de San Simón</div>
                <div>Cochabamba - Bolivia</div>
              </div>
            </Col>
            <Col
              md={6}
              className="d-flex justify-content-end align-items-center"
            >
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-media"
              >
                <img
                  src={youtubeIcon}
                  alt="YouTube"
                  className="social-media-icon"
                />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-media-icon"
              >
                <img
                  src={linkedinIcon}
                  alt="LinkedIn"
                  className="social-media-icon"
                />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-media"
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="social-media-icon"
                />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="social-media"
              >
                <img
                  src={whatsappIcon}
                  alt="WhatsApp"
                  className="social-media-icon"
                />
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Homepage;
