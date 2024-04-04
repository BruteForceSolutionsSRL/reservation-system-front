import React, { useState } from "react";
import { Form, Container, Row, Col, Button, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { BsX } from "react-icons/bs";
import CalendarOwn from "./Calendar/CalendarOwn";

import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  /// form de mostrar matria
  const [opciones, setOpciones] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("");

  /*
  useEffect(() => {
    fetch("/opciones") // Haces la solicitud GET al servidor
      .then((response) => response.json())
      .then((data) => setOpciones(data))
      .catch((error) => console.error("Error al obtener las opciones:", error));
  }, []);*/

  /*/Ejemplo de como recibir datos
  [
    { id: 1, nombre: "Opción 1" },
    { id: 2, nombre: "Opción 2" },
    { id: 3, nombre: "Opción 3" },
  ];*/

  const handleSelectChange = (event) => {
    setOpcionSeleccionada(event.target.value);
  };

  // TIME PICKET
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    console.log("Hora de inicio:", newStartTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    console.log("Hora de fin:", newEndTime);
  };

  //console.log("Hora de inicio seleccionada:", startTime);
  //console.log("Hora de fin seleccionada:", endTime);

  const clearStartTime = () => {
    setStartTime("");
  };

  const clearEndTime = () => {
    setEndTime("");
  };

  return (
    <Form className="formulario-principal">
      <div>
        <Form.Label>Materia</Form.Label>
        <Form.Select
          className="input-materia"
          onChange={handleSelectChange}
          value={opcionSeleccionada}
        >
          <option value="">Select an option</option>
          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </Form.Select>
        <Form.Label className="mt-4">Number of students</Form.Label>
        <Form.Control
          type="number"
          min="0"
          max="999"
          step="1"
          className="input-cant"
          placeholder="Amoun"
        />
        <div className="input-cal">
          <Form.Label className="label-date">Date:</Form.Label>
          <CalendarOwn></CalendarOwn>
        </div>
        <Form.Label className=" mt-4">Reservation Reason</Form.Label>
        <Form.Control
          className=""
          placeholder="Write a reason for booking"
          as="textarea"
          rows={2}
          maxLength={60}
        ></Form.Control>
      </div>
      <div>
        <h3>segunpart</h3>
      </div>
      <div>
        <Form.Label>Start Time:</Form.Label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          value={startTime}
          onChange={handleStartTimeChange}
          className="hour-start"
        />
        {startTime && (
          <Button variant="clear-button" onClick={clearStartTime}>
            <BsX />
          </Button>
        )}
        <Form.Label className="label-end">End Time:</Form.Label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={endTime}
          onChange={handleEndTimeChange}
          className="hour-end"
        />
        {endTime && (
          <Button variant="clear-button" onClick={clearEndTime}>
            <BsX />
          </Button>
        )}
      </div>
    </Form>
  );
}

export default RequestReservationAmbience;
