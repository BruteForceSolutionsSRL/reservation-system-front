import { Carousel } from "react-bootstrap";
import React from "react";
import decanatoFcyt from "./icons/decanatoFcyt.jpg";
import edificioFcyt from "./icons/edificioFcyt.jpg";
import laboratorioFcyt from "./icons/laboratoriosFcyt.jpg";

import image from "./logo.png";
import "./Homepage.css";

function Homepage() {
  return (
    <div className="color-body d-flex justify-content-center align-items-center p-3">
      <div
        className="row d-flex align-items-center justify-content-center"
        style={{ height: "80vh" }}
      >
        <div className="col-lg-6">
          <div className="text-center">
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
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex align-items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
