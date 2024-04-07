import React, { useState } from "react";
import { Form, Container, Row, Col, Button, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { BsX } from "react-icons/bs";
import CalendarOwn from "./Calendar/CalendarOwn";
import TimePicker from "./Calendar/TimePicker";

import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  //const [opciones, setOpciones] = useState([]);

  const [formData, setFormData] = useState({
    materia: "",
    cantidadEstudiantes: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    bloque: "",
    aula: "",
    motivoReserva: "",
    docentes: "",
  });

  //validar campos del form
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    setFormSubmitted(true); // Marcar el formulario como enviado
  };

  const printFormData = () => {
    console.log("Form data:", formData);
  };

  //calendario
  const handleDateSelect = (date) => {
    setFormData({ ...formData, fecha: date }); // Actualiza el estado del formulario con la fecha seleccionada
  };

  //obtener datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = ({ startHour, endHour }) => {
    setFormData({
      ...formData,
      horaInicio: startHour,
      horaFin: endHour,
    });
  };
  //validador de materia
  const validateInput = (value) => {
    if (!value || value.trim() === "") {
      return "Este campo es obligatorio, seleccione una opccion.";
    }
    return null;
  };

  //validador de materia
  const validateCantEst = (value) => {
    if (!value) {
      return "Este campo es obligatorio.";
    } else if (!/^\d+$/.test(value) || /--/.test(value)) {
      return "Carácter inválido. Por favor, ingrese solo números.";
    } else if (value < 1 || value > 999) {
      return "Por favor, ingrese un número válido entre 1 y 999.";
    }
    return null;
  };

  // validador motivo reserva
  const validateMotReser = (value) => {
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s0-9]+$/;
    if (!value) {
      return "Campo es obligatorio";
    } else if (value.length < 5 || value.length > 60) {
      return "Debe tener entre 5 y 60 caracteres";
    } else if (!regex.test(value)) {
      return "No se acepta caracteres especiales";
    } else {
      return null; // Devuelve null cuando la validación es exitosa
    }
  };

  /*
  useEffect(() => {
    fetch("/opciones") // Haces la solicitud GET al servidor
      .then((response) => response.json())
      .then((data) => setOpciones(data))
      .catch((error) => console.error("Error al obtener las opciones:", error));
  }, []);*/

  //Ejemplo de como recibir datos
  const opcionesTemporales = [
    { id: 1, nombre: "Opción 1" },
    { id: 2, nombre: "Opción 2" },
    { id: 3, nombre: "Opción 3" },
  ];
  const [opciones, setOpciones] = useState(opcionesTemporales);

  return (
    <Form isInvalid onSubmit={handleSubmit} className="formulario-principal">
      <div>
        <Form.Label className="me-3">MATERIA</Form.Label>
        <Form.Select
          type="input"
          id="materia"
          name="materia"
          value={formData.materia}
          onChange={handleChange}
          className="input-materia"
          isInvalid={!!validateInput(formData.materia)}
        >
          <option value="">Select an option</option>
          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {validateInput(formData.materia)}
        </Form.Control.Feedback>
        <div className="mt-3 row">
          <div className="col-md-6">
            <div>
              <Form.Label>NUMBER OF STUDENTES</Form.Label>
              <Form.Control
                type="number"
                id="cantidadEstudiantes"
                name="cantidadEstudiantes"
                value={formData.cantidadEstudiantes}
                onChange={handleChange}
                isInvalid={validateCantEst(formData.cantidadEstudiantes)}
                className="input-cant"
                placeholder="Amount"
              />
              <Form.Control.Feedback type="invalid">
                {validateCantEst(formData.cantidadEstudiantes)}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="col-md-6">
            <div className="label-calendary d-flex flex-column align-items-start">
              <Form.Label>DATE</Form.Label>
              <CalendarOwn onDateSelect={handleDateSelect} />
            </div>
          </div>
        </div>
      </div>
      <Form.Label className="label-periods">PERIODS</Form.Label>
      <div className="periods-container">
        <TimePicker onTimeChange={handleTimeChange} />
      </div>
      <div>
        <Form.Label className=" mt-4">RESERVATION REASON</Form.Label>
        <Form.Control
          id="motivoReserva"
          name="motivoReserva"
          value={formData.motivoReserva}
          onChange={handleChange}
          isInvalid={validateMotReser(formData.motivoReserva)}
          className=""
          placeholder="Write a reason for booking"
          as="textarea"
          rows={2}
        ></Form.Control>
        <Form.Control.Feedback type="invalid">
          {validateMotReser(formData.motivoReserva)}
        </Form.Control.Feedback>
      </div>
      <div class="col-12">
        <Button variant="primary" onClick={printFormData}>
          Send
        </Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </Form>
  );
}

export default RequestReservationAmbience;
