import React, { useState, useEffect } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { BsX } from "react-icons/bs";
import CalendarOwn from "./Calendar/CalendarOwn";
import TimePicker from "./Calendar/TimePicker";

import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
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

  const [opcionSeleccionadaBloque, setOpcionSeleccionadaBloque] = useState("");
  const [blockOption, setBlockOption] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsTeacher, setSelectedItemsTeacher] = useState([]);

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
  // test data
  const bloque = [
    {
      block_id: 1,
      name: "Edificio Nuevo",
    },
    {
      block_id: 2,
      name: "Biblioteca FCYT",
    },
  ];

  // test data
  const classroom = [
    {
      classroom_id: 1,
      name: "691a",
      capacity: 75,
      floor: 0,
    },
    {
      classroom_id: 2,
      name: "691b",
      capacity: 75,
      floor: 0,
    },
    {
      classroom_id: 10,
      name: "691j",
      capacity: 75,
      floor: 0,
    },
    {
      classroom_id: 11,
      name: "691k",
      capacity: 75,
      floor: 0,
    },
  ];
  // test data
  const docente = [
    {
      teacher_subject_id: 2,
      group_number: 1,
      teacher_id: 1,
      teacher_name: "maria",
      teacher_last_name: "cespedes",
    },
    {
      teacher_subject_id: 3,
      group_number: 2,
      teacher_id: 2,
      teacher_name: "marcelo",
      teacher_last_name: "antezana",
    },
    {
      teacher_subject_id: 4,
      group_number: 3,
      teacher_id: 4,
      teacher_name: "agustin",
      teacher_last_name: "guzman",
    },
    // {
    //   teacher_subject_id: 4,
    //   group_number: 3,
    //   teacher_id: 4,
    //   teacher_name: "agustin",
    //   teacher_last_name: "guzman",
    // },
    // {
    //   teacher_subject_id: 4,
    //   group_number: 3,
    //   teacher_id: 4,
    //   teacher_name: "agustin",
    //   teacher_last_name: "guzman",
    // },
    {
      teacher_subject_id: 7,
      group_number: 7,
      teacher_id: 7,
      teacher_name: "zapato",
      teacher_last_name: "rp",
    },
  ];

  useEffect(() => {
    setBlockOption(bloque);
  }, []);

  const handleSelectChangeBloque = (event) => {
    setOpcionSeleccionadaBloque(event.target.value);
    setFormData({
      ...formData,
      bloque: event.target.value,
    });
  };

  const handleCheckboxChange = (event, classroomId) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedItems([...selectedItems, classroomId]);
      setFormData({
        ...formData,
        aula: [...formData.aula, classroomId],
      });
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== classroomId));
      setFormData({
        ...formData,
        aula: formData.aula.filter((id) => id !== classroomId),
      });
    }
  };

  const handleCheckboxChangeTeacher = (event, teacherId) => {
    const isCheckedTeacher = event.target.checked;

    if (isCheckedTeacher) {
      setSelectedItemsTeacher([...selectedItemsTeacher, teacherId]);
      setFormData({
        ...formData,
        docentes: [...formData.docentes, teacherId],
      });
    } else {
      setSelectedItemsTeacher(
        selectedItemsTeacher.filter((id) => id !== teacherId)
      );
      setFormData({
        ...formData,
        docentes: formData.docentes.filter((id) => id !== teacherId),
      });
    }
  };

  const isItemSelectedTeacher = (teacherId) => {
    return selectedItemsTeacher.includes(teacherId);
  };

  const isItemSelected = (classroomId) => {
    return selectedItems.includes(classroomId);
  };

  /*
  const handleGetBloqueData = () => {
    const url = "http://localhost:8000/api/bloque"; // URL de la API 
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        setBlockOption(data); 
      })
      .catch((error) => {
        console.error("Error al obtener datos de bloque:", error);
      });
  };

  useEffect(() => {
    handleGetBloqueData();
  }, []); */

  /*
  useEffect(() => {
    fetch("/opciones") // GET 
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
    <>
      <h1 className="text-center">Nueva solicitud de reserva</h1>
      <Form onSubmit={handleSubmit} className="formulario-principal">
        <div>
          <div className="row">
            <div className="col-1">
              <Form.Label className="">Materia</Form.Label>
            </div>
            <div className="col">
              <Form.Select
                type="input"
                id="materia"
                name="materia"
                value={formData.materia}
                onChange={handleChange}
                // className="input-materia"
                isInvalid={!!validateInput(formData.materia)}
              >
                <option value="">Seleccione una materia...</option>
                {opciones.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <Form.Control.Feedback type="invalid">
            {validateInput(formData.materia)}
          </Form.Control.Feedback>
          <div className="row mt-4">
            <div className="col-sm-auto">
              <Form.Label>Cantidad de estudiantes</Form.Label>
            </div>
            <div className="col-3">
              <Form.Control
                type="number"
                id="cantidadEstudiantes"
                name="cantidadEstudiantes"
                value={formData.cantidadEstudiantes}
                onChange={handleChange}
                isInvalid={validateCantEst(formData.cantidadEstudiantes)}
                placeholder="Ej. 999"
              />
              <Form.Control.Feedback type="invalid">
                {validateCantEst(formData.cantidadEstudiantes)}
              </Form.Control.Feedback>
            </div>
            <div className="col-1">
              <Form.Label>Fecha:</Form.Label>
            </div>
            <div className="col-2">
              <CalendarOwn onDateSelect={handleDateSelect} />
            </div>
          </div>
          <div className="tag-container mb-3">
            <label className="tag-label">Periodos</label>
            <div className="periods-container">
              <TimePicker onTimeChange={handleTimeChange} />
            </div>
          </div>
          <div className="tag-container position-relative mb-3">
            <label className="tag-label">Ambiente</label>
            <div className="classroom-container">
              <div className="container">
                <Row xs={2}>
                  <Col xs={3}>
                    <Form.Label className="mb-3">Bloque</Form.Label>
                  </Col>
                  <Col>
                    <Form.Select
                      className="input-block mb-3"
                      onChange={handleSelectChangeBloque}
                      value={opcionSeleccionadaBloque}
                      isInvalid={!!validateInput(formData.bloque)}
                    >
                      <option value="">Selecciona un Bloque</option>
                      {blockOption.map((optionBlock) => (
                        <option
                          key={optionBlock.block_id}
                          value={optionBlock.block_id}
                        >
                          {optionBlock.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {validateInput(formData.bloque)}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
                <Row xs={2}>
                  <Col xs={3}>
                    <Form.Label>Aulas</Form.Label>
                  </Col>
                  <Col xs={6}>
                    <div className="container-classroom container mb-3">
                      <Table bordered hover>
                        <tbody>
                          {classroom.map((item) => (
                            <tr key={item.classroom_id}>
                              <td className="table-classroom table">
                                <Row>
                                  <Col xs={5}>
                                    <Form.Check
                                      className="check-classroom"
                                      type="checkbox"
                                      id={`checkbox-${item.classroom_id}`}
                                      checked={isItemSelected(
                                        item.classroom_id
                                      )}
                                      onChange={(event) =>
                                        handleCheckboxChange(
                                          event,
                                          item.classroom_id
                                        )
                                      }
                                      disabled={
                                        selectedItems.length === 3 &&
                                        !isItemSelected(item.classroom_id)
                                      }
                                    />
                                  </Col>
                                  <Col xs={7}>{item.name}</Col>
                                </Row>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div>
            <Form.Label className=" mt-4">Motivo de reserva</Form.Label>
            {/* <Form.Control
              id="motivoReserva"
              name="motivoReserva"
              value={formData.motivoReserva}
              onChange={handleChange}
              isInvalid={validateMotReser(formData.motivoReserva)}
              className=""
              placeholder="Escribe tu motivo de reserva aqui."
              as="textarea"
              rows={2}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              {validateMotReser(formData.motivoReserva)}
            </Form.Control.Feedback> */}
            <Form.Select
              id="motivoReserva"
              name="motivoReserva"
              value={formData.motivoReserva}
              onChange={handleChange}
              isInvalid={validateMotReser(formData.motivoReserva)}
              className=""
              rows={2}
            >
              <option value="">Seleccione un motivo...</option>
              {opciones.map((opcion) => (
                <option key={opcion.id} value={opcion.id}>
                  {opcion.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validateMotReser(formData.motivoReserva)}
            </Form.Control.Feedback>
          </div>
        </div>
        {/* docente */}

        <div className="container-teacher container mb-3">
          <Form.Label className="mt-4">Docentes</Form.Label>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Nombre</th>
                <th>Grupo</th>
              </tr>
            </thead>
            <tbody>
              {docente.map((item) => (
                <tr key={item.teacher_id}>
                  <td className="table-teacher">
                    <Form.Check
                      className="check-teacher"
                      type="checkbox"
                      id={`checkbox-teacher-${item.teacher_id}`}
                      checked={isItemSelectedTeacher(item.teacher_id)}
                      onChange={(event) =>
                        handleCheckboxChangeTeacher(event, item.teacher_id)
                      }
                      disabled={
                        selectedItemsTeacher.length === 10 &&
                        !isItemSelectedTeacher(item.teacher_id)
                      }
                    />
                  </td>
                  <td>
                    {item.teacher_name} {item.teacher_last_name}
                  </td>
                  <td>{item.group_number}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="col-12 text-center">
          <Button variant="outline-success m-3" onClick={printFormData}>
            Enviar solicitud
          </Button>
          <Button variant="outline-danger">Cancelar</Button>
        </div>
      </Form>
    </>
  );
}

export default RequestReservationAmbience;
