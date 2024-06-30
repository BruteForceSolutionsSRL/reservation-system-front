import React, { useEffect } from "react";
import { Container, Row, Col, Navbar, Button, Card } from "react-bootstrap";
import { Nav, Carousel } from "react-bootstrap";
import decanatoFcyt from "./icons/decanatoFcyt.jpg";
import edificioFcyt from "./icons/edificioFcyt.jpg";
import laboratorioFcyt from "./icons/laboratoriosFcyt.jpg";
import imageLogo from "./logoPequenio.png";
import umssLogo from "./icons/umssLogo.png";
import fcytLogo from "./icons/fcytLogo.png";
import img_alex from "./members/member-alex.png";
import img_sergio from "./members/member-sergio.png";
import img_daniel from "./members/member-daniel.png";
import img_william from "./members/member-william.png";
import img_emerson from "./members/member-emerson.png";
import img_erwin from "./members/member-erwin.png";
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
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      if (savedUser.role === "user") {
        navigate("/user/home");
      } else if (savedUser.role === "superuser") {
        navigate("/superuser/home");
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const perfiles = [
    {
      nombre: "Sergio Victor Garcia Cuchallo",
      titulo: "CEO y Miembro de Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de la carrera Ingeniería Informática, apasionado por la programación y resolución de problemas, conocimientos solidos en programacion y Desarrollo Web en busca de desafios que impulsen mi carrera.",
      imagen: img_sergio,
    },
    {
      nombre: "Erwin Fernandez Calle",
      titulo: "Fundador y Miembro de  Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de Ingeniería de Sistemas, con enfoque en programación web, redes de computadoras, bases de datos. Apasionado por el aprendizaje continuo y la resolución de problemas, en busca de oportunidades para aplicar mis conocimientos y seguir creciendo en el campo de la tecnología.",
      imagen: img_erwin,
    },
    {
      nombre: "Emerson Denis Vera Viscarra",
      titulo: "Fundador y Miembro Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de Informática con una sólida base en programación y desarrollo web. Apasionado en el área de Redes, con certificaciones CCNA.",
      imagen: img_emerson,
    },
    {
      nombre: "Alexander James Alvarez Rojas",
      titulo: "Fundador y Miembro Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de Informática con una sólida base en programación y desarrollo web. Apasionado por la resolución de problemas y con experiencia en competiciones de programación (ICPC, Cocha Somos Innovación, entre otros).",
      imagen: img_alex,
    },
    {
      nombre: "Daniel Garcia Cuchallo",
      titulo: "Fundador y Miembro Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de Ingeniería Informática, apasionado por la programación y el diseño web en busca de un ambiente laboral donde pueda crecer junto con mis compañeros.",
      imagen: img_daniel,
    },
    {
      nombre: "William Calle Pinto",
      titulo: "Fundador y Miembro Brute Force Solutions",
      fundator: "Fundador Brute Force Solutions",
      descripcion:
        "Estudiante de séptimo semestre buscando oportunidades para aplicar y desarrollar mis habilidades en programación, desarrollo de software y resolución de problemas en un entorno laboral.",
      imagen: img_william,
    },
  ];

  const Perfil = ({ nombre, titulo, fundator, descripcion, imagen }) => {
    return (
      <div className="card-container h-100">
        <div className="custom-card">
          <div className="custom-card-body">
            <div className="text-container">
              <div className="info-container">
                <div className="custom-card-title">
                  <img src={imagen} className="custom-card-img" alt="Perfil" />
                  <span>{nombre}</span>
                </div>
                <div className="mb-2 custom-card-subtitle">{titulo}</div>
                <div>
                  <strong>{fundator}</strong>
                </div>
              </div>
              <div className="custom-card-text mt-3">{descripcion}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const carrers = [
    {
      nombre: "Ingeniería en Alimentos",
      imagen: alimentosLogo,
      enlace: "https://fcapyf.umss.edu.bo/",
    },
    {
      nombre: "Licenciatura en Biología",
      imagen: biologiaLogo,
      enlace: "https://fcapyf.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería en Alimentos",
      imagen: civilLogo,
      enlace: "Ingeniería Civil",
    },
    {
      nombre: "Ingeniería Mecanica",
      imagen: mecanicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/#",
    },

    {
      nombre: "Ingeniería Electromecánica",
      imagen: mecanicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/#",
    },
    {
      nombre: "Ingeniería Industrial",
      imagen: industrialLogo,
      enlace: "https://industrial.fcyt.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería Eléctrica",
      imagen: electricaLogo,
      enlace: "http://electrica.fcyt.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería Electrónica",
      imagen: electronicaLogo,
      enlace: "http://electronica.fcyt.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería Informática",
      imagen: informaticaLogo,
      enlace: "https://www.cs.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería en Sistemas",
      imagen: sistemasLogo,
      enlace: "https://www.cs.umss.edu.bo/",
    },
    {
      nombre: "Ingeniería Química",
      imagen: quimicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
    {
      nombre: "Ingeniería en Matemáticas",
      imagen: matematicasLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
    {
      nombre: "Licenciatura en Matemáticas",
      imagen: matematicasLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
    {
      nombre: "Licenciatura en Física",
      imagen: fisicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
    {
      nombre: "Licenciatura en Química",
      imagen: licenquimicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
    {
      nombre: "Ingeniería Petroquimica",
      imagen: petroquimicaLogo,
      enlace: "https://www.umss.edu.bo/facultad-de-ciencias-y-tecnologia/",
    },
  ];

  const CardCarrers = ({ nombre, imagen, enlace }) => {
    return (
      <Card className="hover-card" style={{ width: "100%" }} border="ligth">
        <Card.Body>
          <Card.Title className="text-center">
            <img src={imagen} alt="textura" className="mecanica-Logo" />
            <div className="fw-bold">{nombre}</div>
          </Card.Title>
          <Card.Text className="text-center">
            <a href={enlace} target="_blank" rel="noopener noreferrer">
              Sitio web oficial
            </a>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="color-home">
      <div>
        <Navbar expand="lg" className="navbar-custom fixed-top">
          <Container>
            <Navbar.Brand href="#"></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <img src={imageLogo} alt="Sura Logo" className="logo-image" />
            <Navbar.Collapse id="basic-navbar-nav ">
              <Nav className="me-auto">
                <Nav.Link
                  onClick={scrollToTop}
                  className="nav-link btn-quote ms-auto"
                >
                  Inicio
                </Nav.Link>
                {/* <Link to="/nosotros" className="nav-link">
                  Nosotros
                </Link> */}
                <Nav.Link href="#nosotros">Nosotros</Nav.Link>
                <Nav.Link href="#contactos">Contactos</Nav.Link>
              </Nav>
              <Button href="/login" className="btn-quote ms-auto">
                Iniciar sesión
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className="color-body mt-5">
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

      <div className="information">
        <Container>
          <Row className="text-center">
            <div>
              <h2>BRUTE FORCE SOLUTIONS</h2>
              <div>
                Brute Force Solutions es una empresa de desarrollo de software,
                reconocida por su excelencia en la creación de soluciones
                tecnológicas de vanguardia. Nuestro equipo está conformado por
                ingenieros altamente capacitados y apasionados por la innovación
                y el desarrollo, que trabajan en estrecha colaboración con
                nuestros clientes para ofrecerles productos y servicios de alta
                calidad que superen sus expectativas. Nos especializamos en el
                desarrollo de aplicaciones a medida, utilizando las últimas
                tecnologías y metodologías de desarrollo para garantizar la
                eficiencia, seguridad y escalabilidad de nuestros productos. En
                Brute Force Solutions, nos enorgullece ofrecer soluciones
                personalizadas que se adaptan a las necesidades específicas de
                cada cliente, brindando un valor tangible y contribuyendo al
                éxito de sus proyectos.
              </div>
              <h4 className="mt-3">Mision</h4>
              <div>
                Nuestra misión es impulsar la transformación digital de las
                empresas a través de soluciones innovadoras y de calidad
                superior. Con un enfoque centrado en el cliente y un compromiso
                inquebrantable con la excelencia, en Brute Force Solutions
                estamos listos para enfrentar cualquier desafío y convertir las
                ideas en realidad en el mundo digital.
              </div>
            </div>
            <div className="py-4" id="nosotros"></div>
            <h2 className="mt-5">Fundadores de Brute Force Solutions</h2>
            <Container>
              <Row>
                {perfiles.map((perfil, index) => (
                  <Col md={6} key={index} className="mt-4">
                    <Perfil {...perfil} />
                  </Col>
                ))}
              </Row>
            </Container>
          </Row>
        </Container>
      </div>

      <div>
        <Row>
          <Col md={4} className="mt-5 text-center">
            <img src={umssLogo} alt="textura" className="umss-Logo" />
          </Col>
          <Col md={4} className="mt-5 text-center">
            <img src={fcytLogo} alt="textura" className="fcyt-Logo" />
          </Col>
          <Col md={4} className="mt-5 text-center">
            <img src={imageLogo} alt="textura" className="sura-Logo" />
          </Col>
        </Row>
      </div>

      <div className=" color-card mt-5">
        <h1>Alcance de SURA en la Facultad de Ciencias y Tecnología</h1>
        <Row>
          {carrers.map((carrer, index) => (
            <Col
              md={3}
              key={index}
              className="mt-4 d-flex justify-content-center"
            >
              <CardCarrers {...carrer} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="footer" id="contactos">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <Container>
          <Row className="footer-bottom text-center">
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

export default Home;
