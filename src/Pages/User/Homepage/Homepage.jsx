import React from "react";
import { Row, Col } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import decanatoFcyt from "./icons/decanatoFcyt.jpg";
import edificioFcyt from "./icons/edificioFcyt.jpg";
import laboratorioFcyt from "./icons/laboratoriosFcyt.jpg";

import image from "./logo.png";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="color-body">
      <div className="text-center">
        <Row>
          <Col lg={6}>
            <h1 className="fw-bold">
              Sistema universitario de reserva de ambientes (SURA)
            </h1>
            <h4>
              Es una plataforma desarrollada para gestionar las reservas de los
              ambientes en la Facultad de Ciencias y Tecnología de la
              Universidad Mayor de San Simón. Diseñada pensando en las
              necesidades de la comunidad universitaria, SURA permite a
              estudiantes y docentes reservar aulas, laboratorios y otros
              espacios académicos. Nuestra misión es optimizar la gestión y el
              uso de estos espacios, proporcionando una herramienta intuitiva y
              accesible que facilita la organización y planificación de
              actividades académicas. Con SURA, buscamos mejorar la experiencia
              academica al asegurar que los recursos disponibles se utilicen de
              manera efectiva y equitativa, promoviendo así un entorno académico
              más dinámico y productivo.
            </h4>
          </Col>

          <Col lg={6} className="image-container mt-5">
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
      </div>
    </div>
  );
}

export default Homepage;
