import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { BsX } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "./CalendarOwn.css";

const CalendarOwn = ({ onDateSelect }) => {
  //Esta ordenado de domingo a sabado
  const diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const [mesActual, setMesActual] = useState(new Date());
  const [mes, setMes] = useState(mesActual.getMonth());
  const [anio, setAnio] = useState(mesActual.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [calendarioVisible, setCalendarioVisible] = useState(false);

  const obtenerDiasEnMes = (mes, anio) => {
    return new Date(anio, mes + 1, 0).getDate();
  };

  const obtenerPrimerDiaSemana = (mes, anio) => {
    return new Date(anio, mes, 1).getDay();
  };

  const cambiarMes = (direccion) => {
    let nuevoMes = mes;
    let nuevoAnio = anio;

    if (direccion === "atras") {
      if (mes === 0) {
        nuevoMes = 11;
        nuevoAnio--;
      } else {
        nuevoMes--;
      }
    } else {
      if (mes === 11) {
        nuevoMes = 0;
        nuevoAnio++;
      } else {
        nuevoMes++;
      }
    }

    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  const diasEnMes = obtenerDiasEnMes(mes, anio);
  const primerDiaSemana = obtenerPrimerDiaSemana(mes, anio);

  const diasAnteriores = Array.from({ length: primerDiaSemana }, (_, i) => 0);
  const diasDelMes = Array.from({ length: diasEnMes }, (_, i) => i + 1);

  const mesesTexto = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // obtencion de la decha que se selecciono
const handleClick = (dia) => {
  const nuevaFechaSeleccionada = new Date(anio, mes, dia);
  setFechaSeleccionada(nuevaFechaSeleccionada);
  const formattedDate = `${anio}-${(mes + 1).toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
  onDateSelect(formattedDate);
  toggleCalendario(); // Cierra el modal al seleccionar una fecha
  console.log("Fecha seleccionada:", formattedDate); // Imprime la fecha seleccionada en la consola
};
  const toggleCalendario = () => {
    setCalendarioVisible(!calendarioVisible);
  };

  const formatDate = (date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}/${month}/${day}`;
  };
  const handleClearDate = () => {
    setFechaSeleccionada(null);
  };

  return (
    <>
      <div className="input-container">
        <input
          type="text"
          placeholder="Selecciona una fecha"
          name="copy-button"
          value={fechaSeleccionada ? formatDate(fechaSeleccionada) : ""}
          onClick={toggleCalendario}
          readOnly
          required
        />
        {fechaSeleccionada && (
          <button className="clear-button" onClick={handleClearDate}>
            <BsX />
          </button>
        )}
      </div>
      <Modal
        show={calendarioVisible}
        onHide={toggleCalendario}
        dialogClassName="modal-dialog-"
        className="modal-custom"
      >
        <Modal.Header>
          <Button variant="link" onClick={() => cambiarMes("atras")}>
            <BsChevronLeft />
          </Button>
          <Modal.Title>{`${mesesTexto[mes]} ${anio}`}</Modal.Title>
          <Button variant="link" onClick={() => cambiarMes("adelante")}>
            <BsChevronRight />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="calendar-grid">
            {diasSemana.map((dia) => (
              <div key={dia} className="calendar-cell day-name">
                {dia}
              </div>
            ))}
            {diasAnteriores.map((dia, index) => (
              <div key={`empty-${index}`} className="calendar-cell"></div>
            ))}
            {diasDelMes.map((dia) => (
              <div
                key={dia}
                className={`calendar-cell day ${
                  fechaSeleccionada &&
                  fechaSeleccionada.getFullYear() === anio &&
                  fechaSeleccionada.getMonth() === mes &&
                  fechaSeleccionada.getDate() === dia
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleClick(dia)}
              >
                {dia}
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarOwn;
