import React, { useState, useEffect } from "react";
import { Form, Button, Col, Table, Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedOptionsNames, setSelectedOptionsNames] = useState({});
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [error, setError] = useState("");
  const [startHourId, setStartHourId] = useState("");
  const [endHourId, setEndHourId] = useState("");

  const [showModal, setShowModal] = useState(false);

  const URL = "http://localhost:8000/api/";
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    //Fetch for Subjects
    await fetch(URL + `subjects/teacher/${0}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("fetch for subjects");
        setMaterias(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
    //Fetch for teachers
    await fetch(URL + `subjects/teacher/${1}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetch for teachers");
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  //Gets the date the current date
  const today = new Date();
  const year = today.getFullYear();
  let minDate, maxDate;
  // first part: 15 de febrero al 20 de julio
  if (
    today.getMonth() < 6 ||
    (today.getMonth() === 6 && today.getDate() <= 20)
  ) {
    minDate = new Date(year, 1, 15); // 15 de febrero
    maxDate = new Date(year, 6, 20); // 20 de julio
  } else {
    // second part: 25 de julio al 31 de diciembre
    minDate = new Date(year, 6, 25); // 25 de julio
    maxDate = new Date(year, 11, 31); // 31 de diciembre
  }
  // const [formData, setFormData] = useState({
  //   materia: "",
  //   cantidad: "",
  //   fecha: "",
  //   periodo: "",
  //   bloque: "",
  //   aula: "",
  //   motivo: "",
  //   docentes: "",
  // });
  const [formData, setFormData] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: "", //docentes
    block_id: "", //bloque
    classroom_id: {}, //aula
    time_slot_id: {}, //periodo
    date: "", //fecha
    reason_id: "", //motivo
  });
  // erros form
  const [errors, setErrors] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: "", //docentes
    block_id: "", //bloque
    classroom_id: {}, //aula
    time_slot_id: {}, //periodo
    date: "", //fecha
    reason_id: "", //motivo
  });

  const postForm = () => {
    fetch(URL + "reservation", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        Content_Type: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from back");
        console.log(data);
      })
      .catch((err) => {
        if (err) throw console.error(err);
      });
  };

  //VALIDADORES DE TODO EL FORMULARIO
  //validador de materia
  const validateMateria = (value) => {
    if (!value || value.trim() === "") {
      return "Seleccione una materia.";
    }
    return null;
  };

  // validator teacher
  const validateTeacher = (selectedOptions) => {
    if (Object.keys(selectedOptions).length === 0) {
      return "Seleccione al menos un docente.";
    }
    return null;
  };

  //validator of DATE
  const validateDate = (value) => {
    console.log(value);
    if (!value || value.trim() === "") {
      return "Seleccione una fecha.";
    }
    return null;
  };
  // Function to reverse date format DD/MM/YY
  const formatDate = (dateString) => {
    const dateParts = dateString.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    console.log("traducidoen metodo", `${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
  };

  // validator of PERIODO
  const validatePeriod = (value) => {
    if (!value.start || !value.end) {
      return "Seleccione un periodo completo.";
    }
    return null;
  };

  //validador de CANTIDAD
  const validateCantidad = (value) => {
    console.log(value);
    if (!value) {
      return "Ingrese una cantidad.";
    } else if (value < 25 || value > 500) {
      return "La cantidad de estudiantes debe ser mayor a 25 y menor 500.";
    }
    return null;
  };

  //validador de Reason
  const validateReason = (value) => {
    if (!value || value.trim() === "") {
      return "Debe seleccionar el motivo de reserva.";
    }
    return null;
  };

  //Boton enviar solicitud
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    newErrors.subject_id = validateMateria(formData.subject_id);
    newErrors.group_id = validateTeacher(formData.group_id);
    //newErrors.time_slot_id = validatePeriod(formData.time_slot_id);
    newErrors.date = validateDate(formData.date);
    newErrors.quantity = validateCantidad(formData.quantity);
    newErrors.reason_id = validateReason(formData.reason_id);

    setErrors(newErrors);
    // Si no hay errores, puedes enviar el formulario
    if (
      !newErrors.subject_id &&
      !newErrors.group_id &&
      !newErrors.time_slot_id &&
      !newErrors.date &&
      !newErrors.quantity &&
      !newErrors.reason_id
    ) {
      console.log("Datos del formulario:", formData);
    }
    postForm();
  };

  //validador en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    console.log(name, value);
    //if (name === "date") {
    // console.log("traduciendo", formatDate(value));
    // const dateObj = new Date(value);
    // formattedValue = dateObj.toISOString().split("T")[0];
    //}
    formattedValue = value;
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    const error = validators[name](value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  //controlador de validadores
  const validators = {
    subject_id: validateMateria,
    group_id: validateTeacher,
    time_slot_id: validatePeriod,
    date: validateDate,
    quantity: validateCantidad,
    reason_id: validateReason,

    // Agrega más validadores para otros campos si es necesario
  };

  //Docentes
  const handleOptionClick = (id, teacher_fullname, group_number) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelection = { ...prevSelectedOptions };
      if (updatedSelection[id]) {
        delete updatedSelection[id];
      } else {
        updatedSelection[id] = { id, teacher_fullname, group_number };
      }
      // Actualizar formData.docentes con el formato deseado
      setFormData({
        ...formData,
        group_id: updatedSelection,
      });
      return updatedSelection;
    });
    setSelectedOptionsNames((prevSelectedOptionsNames) => {
      const updatedSelectionNames = { ...prevSelectedOptionsNames };
      if (prevSelectedOptionsNames[id]) {
        delete updatedSelectionNames[id];
      } else {
        updatedSelectionNames[id] = { id, teacher_fullname, group_number };
      }
      return updatedSelectionNames;
    });
  };

  // update table teacher selected
  useEffect(() => {
    if (!formData.subject_id) {
      setSelectedOptions({});
      setIntro([]); // clear list teacher
    } else {
      setIntro(introTemporales);
    }
  }, [formData.subject_id]);

  //Ver lo que se selcciona de la tabla docentes e imprimirlo
  useEffect(() => {
    console.log(formData.group_id);
  }, [selectedOptions]);

  //Ejemplo de materias
  const materiaTemporal = [
    {
      subject_id: 0,
      subject_name: "Elementos de programacion y estructura de datos",
    },
    { subject_id: 1, subject_name: "Intro a la programacion" },
    { subject_id: 2, subject_name: "Aquitectura de computadoras" },
    { subject_id: 3, subject_name: "Algoritmos avanzados" },
    { subject_id: 4, subject_name: "Taller de ingenieria de soft" },
  ];
  const [materiass, setMateriass] = useState(materiaTemporal);

  //Ejemplo de docentes ELEMENTOS DE PROG
  const elementosTemporales = [
    { id: 0, teacher_fullname: "Letecia Blanco Coca", group_number: "2" },
    { id: 1, teacher_fullname: "Letecia Blanco Coca", group_number: "3" },
    { id: 2, teacher_fullname: "Rosemary Torrico Bascope", group_number: "1" },
    { id: 3, teacher_fullname: "Helder Guzman Fernandez", group_number: "5" },
  ];
  const [elementos, setElementos] = useState(elementosTemporales);

  //Ejemplo de docentesINTRO A LA PROG
  const introTemporales = [
    { id: 0, teacher_fullname: "Letecia Blanco Coca", group_number: "2" },
    { id: 1, teacher_fullname: "Carla Serrudo Salazar", group_number: "1" },
    { id: 2, teacher_fullname: "Carla Serrudo Salazar", group_number: "6" },
    { id: 3, teacher_fullname: "Vladimir Costas Jauregui", group_number: "10" },
    { id: 4, teacher_fullname: "Hernan Ustariz Vargas", group_number: "3" },
    { id: 5, teacher_fullname: "Victor Hugo Montaño", group_number: "5" },
    { id: 6, teacher_fullname: "Vladimir Costas Jauregui", group_number: "7" },
    { id: 7, teacher_fullname: "Henry Frank Villaroel", group_number: "4" },
  ];
  const [intro, setIntro] = useState(introTemporales);

  //Ejemplo de ARQUI DE COMPU
  const arquiTemporales = [
    { id: 0, docente: "Letecia Blanco Coca", grupo: "2" },
    { id: 1, docente: "Samuel Acha Perez", grupo: "1" },
    { id: 2, docente: "Luis Agreda Corrales", grupo: "3" },
  ];
  const [arqui, setArqui] = useState(arquiTemporales);

  //Ejemplo de MOTIVO
  const motivoTemporales = [
    { reason_id: 0, reason_name: "Examen" },
    { reason_id: 1, reason_name: "Charla" },
    { reason_id: 2, reason_name: "Defensa da tesis" },
  ];
  const [reason, setReason] = useState(motivoTemporales);

  //Ejemplo de HORA INI Y FIN
  const hoursOptions = [
    { id: 1, time: "Periodo" },
    { id: 2, time: "06:45" },
    { id: 3, time: "07:30" },
    { id: 4, time: "08:15" },
    { id: 5, time: "09:00" },
    { id: 6, time: "09:45" },
    { id: 7, time: "10:30" },
    { id: 8, time: "11:15" },
    { id: 9, time: "12:00" },
    { id: 10, time: "12:45" },
    { id: 11, time: "13:30" },
    { id: 12, time: "14:15" },
    { id: 13, time: "15:00" },
    { id: 14, time: "15:45" },
    { id: 15, time: "16:30" },
    { id: 16, time: "17:15" },
    { id: 17, time: "18:00" },
    { id: 18, time: "18:45" },
    { id: 19, time: "19:30" },
    { id: 20, time: "20:15" },
    { id: 21, time: "21:30" },
    { id: 22, time: "21:45" },
  ];

  const handleStartHourChange = (e) => {
    const newStartHour = e.target.value;
    const selectedStart = hoursOptions.find(
      (option) => option.time === newStartHour
    );
    const maxEndHourIndex = hoursOptions.findIndex(
      (option) => option.id === selectedStart.id + 4
    );
    if (endHour !== "" && newStartHour >= endHour) {
      setEndHour("");
      setEndHourId("");
    }
    setStartHour(newStartHour);
    setStartHourId(selectedStart.id);
    if (endHour !== "" && endHour > hoursOptions[maxEndHourIndex].time) {
      setEndHour(hoursOptions[maxEndHourIndex].time);
      setEndHourId(hoursOptions[maxEndHourIndex].id);
      onTimeChange({
        startHourId: selectedStart.id,
        endHourId: hoursOptions[maxEndHourIndex].id,
      });
    }
    if (endHour !== "" && newStartHour > endHour) {
      setEndHour("");
      setEndHourId("");
      onTimeChange({ startHourId: selectedStart.id, endHourId: "" });
    }
    setError(
      newStartHour && endHour
        ? ""
        : "Se deben seleccionar la hora de finalización."
    );
  };

  const handleEndHourChange = (e) => {
    const selectedStart = hoursOptions.find(
      (option) => option.time === startHour
    );
    const selectedEndHour = hoursOptions.find(
      (option) => option.time === e.target.value
    );
    if (selectedEndHour && selectedEndHour.id <= selectedStart.id + 4) {
      setEndHour(e.target.value);
      setEndHourId(selectedEndHour.id);
      setError("");
      onTimeChange({
        startHourId: selectedStart.id,
        endHourId: selectedEndHour.id,
      });
    }
  };

  return (
    <div>
      <Form noValidate onSubmit={handleSubmit} className="formulario-principal">
        <h1 className="text-center text-sm">Formulario de Reserva</h1>
        <div>
          <div className="materia-reason-container mt-2 ms-4">
            <div className="materia-label col-form-label">
              <Form.Label>MATERIA</Form.Label>
            </div>
            <div className="materia-tag">
              <Form.Select
                type="input"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                isInvalid={!!errors.subject_id}
              >
                <option value="">Seleccione una materia</option>
                {materiass.map((opcion) => (
                  <option
                    key={opcion.subject_id}
                    value={`${opcion.subject_id},${opcion.subject_name}`}
                  >
                    {opcion.subject_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.subject_id}
              </Form.Control.Feedback>
            </div>
          </div>
          {/*hata aqui el primero input */}

          <div className="student-date-container mt-3 ms-4 justify-content-center">
            <div className="student-label">
              <Form.Label className="col-form-label">
                CANTIDAD DE ESTUDIANTES
              </Form.Label>
            </div>
            <div className="student-tag">
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                isInvalid={!!errors.quantity}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.quantity}
              </Form.Control.Feedback>
            </div>
            <div className="date-label">
              <Form.Label className="col-form-label">FECHA</Form.Label>
            </div>
            <div className="date-tag">
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
                min={today.toISOString().split("T")[0]}
                max={maxDate.toISOString().split("T")[0]}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className=" materia-reason-container mt-3 ms-4">
            <div className="materia-label col-form-label">
              <Form.Label>MOTIVO</Form.Label>
            </div>
            <div className="materia-tag">
              <Form.Select
                type="input"
                name="reason_id"
                value={formData.reason_id}
                onChange={handleChange}
                isInvalid={!!errors.reason_id}
              >
                <option value="">Seleccione</option>
                {reason.map((opcion) => (
                  <option
                    key={opcion.reason_id}
                    value={`${opcion.reason_id},${opcion.reason_name}`}
                  >
                    {opcion.reason_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.reason_id}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="tag-time-container mb-3 mt-5 ms-3">
            <label className="tag-label">Periodos</label>
            <div className="time-container d-flex justify-content-center text-center">
              <div className="d-flex align-items-center">
                <Col xs="auto">
                  <Form.Label className="me-3">HORA INICIO:</Form.Label>
                </Col>
                <Form.Select
                  className="time-pickerStart"
                  type="input"
                  name="time_slot_id"
                  value={startHour}
                  onChange={handleStartHourChange}
                >
                  {hoursOptions.map((option) => (
                    <option key={option.id} value={option.time}>
                      {`${option.time}`}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="d-flex align-items-center">
                <Col xs="auto">
                  <Form.Label className="me-3">HORA FIN:</Form.Label>
                </Col>
                <Form.Select
                  className="time-pickerEnd"
                  type="input"
                  name="time_slot_id"
                  value={endHour}
                  onChange={handleEndHourChange}
                >
                  {!startHour && <option value="">Periodo</option>}
                  {startHour &&
                    [
                      { id: -1, time: "Periodo" },
                      ...hoursOptions.filter(
                        (option) =>
                          option.id > startHourId &&
                          option.id <= startHourId + 4
                      ),
                    ].map((option) => (
                      <option key={option.id} value={option.time}>
                        {`${option.time}`}
                      </option>
                    ))}
                </Form.Select>
              </div>
            </div>

            {errors && <div className="text-danger mt-2">{error}</div>}
          </div>

          <div className="teacher-container mt-5 ms-3">
            <label className="tag-label">DOCENTE</label>
            <div className="periods-container align-items-start row">
              <div className="scrol-teacher text-center col">
                <Table striped bordered hover className="fixed-header">
                  <thead>
                    <tr>
                      <th
                        className="sticky-header text-center"
                        style={{
                          backgroundColor: "rgb(4, 94, 140)",
                          color: "white",
                          userSelect: "none",
                        }}
                      >
                        Nombre
                      </th>
                      <th
                        className="sticky-header text-center"
                        style={{
                          backgroundColor: "rgb(4, 94, 140)",
                          color: "white",
                          userSelect: "none",
                        }}
                      >
                        Grupo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(selectedOptions).map((option) => (
                      <tr key={option.id}>
                        <td
                          style={{
                            backgroundColor: "rgb(75, 177, 229 )",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {option.teacher_fullname}
                        </td>
                        <td
                          style={{
                            backgroundColor: "rgb(75, 177, 229 )",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {option.group_number}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="mt-1 col-2">
                <FaRegEdit
                  className="button-edit"
                  onClick={() => setShowModal(true)}
                  style={{
                    fontSize: "26px",
                  }}
                ></FaRegEdit>
                <Form.Label className="label-edit ms-2">Editar</Form.Label>
              </div>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.group_id}
              </Form.Control.Feedback>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Lista de docentes</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="scrol-teacher-modal">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th
                          className="sticky-header text-center"
                          style={{
                            backgroundColor: "rgb(4, 94, 140)",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          Nombre
                        </th>
                        <th
                          className="sticky-header text-center"
                          style={{
                            backgroundColor: "rgb(4, 94, 140)",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          Grupo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {intro.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            handleOptionClick(
                              item.id,
                              item.teacher_fullname,
                              item.group_number
                            )
                          }
                          className={
                            selectedOptions[item.id] ? "table-primary" : ""
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ userSelect: "none" }}>
                            {item.teacher_fullname}
                          </td>
                          <td style={{ userSelect: "none" }}>
                            {item.group_number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>

          <div className="tag-container position-relative mb-3 mt-5 ms-3">
            <label className="tag-label">Ambiente</label>
            <div className="classroom-container">
              <div className="container"></div>
            </div>
          </div>
        </div>

        <div className="col-12 mt-2" style={{ textAlign: "right" }}>
          <Button variant="outline-success m-3" type="submit">
            Enviar solicitud
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RequestReservationAmbience;
