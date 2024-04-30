import React, { useState, useEffect } from "react";
import { Form, Button, Col, Table, Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedOptionsNames, setSelectedOptionsNames] = useState({});

  const [selectOptionsClass, setSelectOptionsClass] = useState({});
  const [selectOptionsNamesClass, setSelectdOptionsNamesClass] = useState({});
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalClass, setShowModalClass] = useState(false);

  const URL = "http://localhost:8000/api/";
  const [materias, setMaterias] = useState([]);
  const [firstTime, setFirstTime] = useState(true); //Refactorizar luego, esta hardcodeado.
  /*
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
  };*/

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

  const [formData, setFormData] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: "", //docentes
    block_id: "", //bloque
    classroom_id: "", //aula
    time_slot_id: ["", ""], //periodo
    date: "", //fecha
    reason_id: "", //motivo
  });
  // erros form
  const [errors, setErrors] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: "", //docentes
    block_id: "", //bloque
    classroom_id: "", //aula
    time_slot_id: ["", ""], //periodo
    start: "",
    end: "",
    date: "", //fecha
    reason_id: "", //motivo
  });

  const [suggestionData, setSuggestionData] = useState({
    block_id: "",
    time_slot_id: [0, 0],
    quantity: "",
    date: "",
  });

  //Get date of generate suggetions
  const handleClick = () => {
    // her update state suggestions
    setSuggestionData((prevData) => {
      const newSuggestionData = { ...prevData };
      newSuggestionData.block_id = formData.block_id;
      newSuggestionData.time_slot_id = formData.time_slot_id;
      newSuggestionData.quantity = formData.quantity;
      newSuggestionData.date = formData.date;
      return newSuggestionData;
    });
  };

  // Function validate suggestionData
  const validateSuggestionData = () => {
    for (const key in suggestionData) {
      if (suggestionData[key] === "") {
        return false;
      }
    }
    return true;
  };

  //click on Button GENERATE SUGGESTIONS
  const suggestionClick = () => {
    const isValid = validateSuggestionData(); //validate the fields suggestionData
    if (isValid) {
      const selected = {};
      classromSugg.forEach((classroom) => {
        const existingClassroom = classrom.find(
          (c) => c.classroom_id === classroom.classroom_id
        );
        if (existingClassroom) {
          selected[classroom.classroom_id] = existingClassroom;
        }
      });
      setSelectOptionsClass(selected);
      setFormData({ ...formData, classroom_id: selected });
      console.log("Datos actualizados en el form", formData);

      setMessage("");
    } else {
      console.log("Sugerencia invalida");
      setMessage("Seleccione cantidad, fecha, peridos y bolque");
    }
  };

  /*
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
  };*/

  //VALIDATOR OF ENTIRE FORM
  //validator of MATERIA
  const validateMateria = (value) => {
    if (!value || value.trim() === "") {
      return "Seleccione una materia.";
    }
    return null;
  };

  // validator of TEACHER
  const validateTeacher = (selectedOptions) => {
    if (Object.keys(selectedOptions).length === 0) {
      return "Seleccione al menos un docente.";
    }
    return null;
  };

  //validator of DATE
  const validateDate = (value) => {
    //console.log(value);
    if (!value || value.trim() === "") {
      return "Seleccione una fecha.";
    }
    return null;
  };

  //Validator of Time START and END
  const validatePeriod = (value) => {
    if (value[0] === "") {
      return "Seleccione una hora de inicio y una hora de fin.";
    } else if (value[0] != "" && value[1] === "") {
      return "Seleccione una hora fin.";
    }
    return null;
  };

  //validador de CANTIDAD
  const validateCantidad = (value) => {
    if (!value) {
      return "Ingrese una cantidad.";
    } else if (value < 25 || value > 500) {
      return "La cantidad de estudiantes debe ser mayor a 25 y menor 500.";
    }
    return null;
  };

  //validator of REASON
  const validateReason = (value) => {
    if (!value || value.trim() === "") {
      return "Debe seleccionar el motivo de reserva.";
    }
    return null;
  };
  //validator of BOCK
  const validateBlock = (value) => {
    if (!value || value.trim() === "") {
      return "Seleccione un bloque.";
    }
    return null;
  };

  // validator of CLASSROM
  const validateClassrom = (selectOptionsClass) => {
    console.log("Validador classrom", selectOptionsClass);
    if (Object.keys(selectOptionsClass).length === 0) {
      return "Seleccione al menos una aula.";
    } else if (!formData.classroom_id) {
      return "Seleccione al menos una aula.";
    }
    return null;
  };

  //errores teacher
  useEffect(() => {
    if (!firstTime) {
      let newErrors = { ...errors };
      newErrors.group_id = validateTeacher(formData.group_id);
      setErrors(newErrors);
    }
  }, [selectedOptions, selectedOptionsNames]);

  //errores classrom
  useEffect(() => {
    if (!firstTime) {
      let newErrors = { ...errors };
      newErrors.classroom_id = validateClassrom(formData.classroom_id);
      setErrors(newErrors);
    }
  }, [selectOptionsClass, selectOptionsNamesClass]);

  //Boton enviar solicitud FORM
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    newErrors.subject_id = validateMateria(formData.subject_id);
    newErrors.group_id = validateTeacher(formData.group_id);
    newErrors.time_slot_id = validatePeriod(formData.time_slot_id);
    newErrors.start = validatePeriod(formData.time_slot_id[0]);
    newErrors.end = validatePeriod(formData.time_slot_id[1]);
    newErrors.date = validateDate(formData.date);
    newErrors.quantity = validateCantidad(formData.quantity);
    newErrors.reason_id = validateReason(formData.reason_id);
    newErrors.block_id = validateBlock(formData.block_id);
    //newErrors.classroom_id = validateClassrom(formData.classroom_id);

    setErrors(newErrors);
    // Si no hay errores, puedes enviar el formulario
    if (
      !newErrors.subject_id &&
      !newErrors.group_id &&
      !newErrors.time_slot_id &&
      !newErrors.start &&
      !newErrors.end &&
      !newErrors.date &&
      !newErrors.quantity &&
      !newErrors.reason_id &&
      !newErrors.block_id &&
      !newErrors.classroom_id
    ) {
      console.log("Datos del formulario:", {
        ...formData,
      });
      //postForm();
    }
  };

  //validador en tiempo real
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (name === "start" || name === "end") {
      const index = name === "start" ? 0 : 1;
      const selectedOption = hoursOptions.find(
        (option) => option.time === value
      );
      setFormData((prevFormData) => {
        let updatedOptions = [...prevFormData.time_slot_id];
        if (name === "start") {
          updatedOptions = [selectedOption ? selectedOption.id : "", ""];
        } else {
          updatedOptions[index] = selectedOption ? selectedOption.id : "";
        }

        const error = validators[name](updatedOptions);
        setErrors({
          ...errors,
          [name]: error,
        });

        return {
          ...prevFormData,
          time_slot_id: updatedOptions,
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      const error = validators[name](value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  //validador en tiempo real
  /*const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData({
      ...formData,
      [name]: value,
    });
    const error = validators[name](value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };
*/
  const getFilteredOptions = () => {
    const selectedId = hoursOptions.find(
      (option) => option.id === formData.time_slot_id[0]
    )?.id;
    if (selectedId) {
      return hoursOptions.filter(
        (hour) => hour.id > selectedId && hour.id <= selectedId + 4
      );
    }
    return [];
  };

  //controlador de validadores
  const validators = {
    subject_id: validateMateria,
    group_id: validateTeacher,
    time_slot_id: validatePeriod,
    start: validatePeriod,
    end: validatePeriod,
    date: validateDate,
    quantity: validateCantidad,
    reason_id: validateReason,
    block_id: validateBlock,
    classroom_id: validateClassrom,
    // Agrega más validadores para otros campos si es necesario
  };

  //Docentes
  const handleOptionClick = (id, teacher_fullname, group_number) => {
    setFirstTime(false);
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelection = { ...prevSelectedOptions };
      if (updatedSelection[id]) {
        delete updatedSelection[id];
      } else {
        updatedSelection[id] = { id, teacher_fullname, group_number };
      }
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
    console.log("Opciones seleccionadas");
  };

  //Aulas
  const handleOptionClassrom = (classroom_id, classroom_name, capacity) => {
    setFirstTime(false);
    setSelectOptionsClass((prevSelectedOptions) => {
      const updatedSelection = { ...prevSelectedOptions };
      if (updatedSelection[classroom_id]) {
        delete updatedSelection[classroom_id];
      } else {
        updatedSelection[classroom_id] = {
          classroom_id,
          classroom_name,
          capacity,
        };
      }
      setFormData({
        ...formData,
        classroom_id: updatedSelection,
      });
      return updatedSelection;
    });
    setSelectdOptionsNamesClass((prevSelectedOptionsNames) => {
      const updatedSelectionNames = { ...prevSelectedOptionsNames };
      if (prevSelectedOptionsNames[classroom_id]) {
        delete updatedSelectionNames[classroom_id];
      } else {
        updatedSelectionNames[classroom_id] = {
          classroom_id,
          classroom_name,
          capacity,
        };
      }
      return updatedSelectionNames;
    });
    console.log("Opciones seleccionadas");
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

  // update table AULAS -- block_id es id seleccionado y actualizar en base a eso
  useEffect(() => {
    if (!formData.block_id) {
      setSelectOptionsClass({});
      setClassrom([]); // clear list teacher
    } else {
      setClassrom(classromTemporales); // envio classroms
    }
  }, [formData.block_id]);

  //Ver lo que se selcciona aulas
  useEffect(() => {
    console.log(formData.classroom_id);
  }, [selectOptionsClass]);

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

  //Ejemplo de MOTIVO
  const motivoTemporales = [
    { reason_id: 0, reason_name: "Examen" },
    { reason_id: 1, reason_name: "Charla" },
    { reason_id: 2, reason_name: "Defensa da tesis" },
  ];
  const [reason, setReason] = useState(motivoTemporales);

  //Ejemplo de HORA INI Y FIN
  const hoursOptions = [
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
  const [hours, setIHours] = useState(hoursOptions);

  //Ejemplo de BLOQUE
  const blockTemporales = [
    { block_id: 1, block_name: "Edificio nuevo", block_maxfloor: "20" },
    { block_id: 2, block_name: "Edifico multiacademico", block_maxfloor: "10" },
    { block_id: 3, block_name: "CAE", block_maxfloor: "30" },
    { block_id: 4, block_name: "Departamento de Fisica", block_maxfloor: "3" },
    { block_id: 5, block_name: "Departamento de Quimica", block_maxfloor: "3" },
  ];
  const [block, setBlock] = useState(blockTemporales);

  //Ejemplo de AULAS
  const classromTemporales = [
    {
      classroom_id: 0,
      classroom_name: "691A",
      capacity: "100",
      floor_number: 2,
    },
    {
      classroom_id: 1,
      classroom_name: "692A",
      capacity: "80",
      floor_number: 2,
    },
    {
      classroom_id: 2,
      classroom_name: "691B",
      capacity: "80",
      floor_number: 3,
    },
    {
      classroom_id: 3,
      classroom_name: "692B",
      capacity: "90",
      floor_number: 3,
    },
  ];
  const [classrom, setClassrom] = useState(classromTemporales);

  //Ejemplo de AULAS SUGERENCIA GENERADA
  const classromSuggTemporales = [
    {
      classroom_id: 0,
      classroom_name: "691A",
      capacity: "100",
      floor_number: 2,
    },
    {
      classroom_id: 2,
      classroom_name: "691B",
      capacity: "80",
      floor_number: 3,
    },
  ];
  const [classromSugg, setClassromSugg] = useState(classromSuggTemporales);

  return (
    <div>
      <Form noValidate onSubmit={handleSubmit} className="formulario-principal">
        <h1 className="text-center text-sm">Formulario de Reserva</h1>
        <div>
          <div className="materia-reason-container mt-2 ms-4 mt-3">
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
                    value={`${opcion.subject_id}`}
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
                onClick={handleClick}
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
                onClick={handleClick}
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
                  <option key={opcion.reason_id} value={`${opcion.reason_id}`}>
                    {opcion.reason_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.reason_id}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="tag-time-container mb-3 mt-5 ms-4">
            <label className="tag-label">Periodos</label>
            <div className="time-container justify-content-center">
              <div className="start-tag">
                <div className="start-label">
                  <Form.Label className="col-form-label ">
                    HORA INICIO
                  </Form.Label>
                </div>
                <div className="pickerStart-tag">
                  <Form.Select
                    type="input"
                    name="start"
                    value={
                      formData.time_slot_id[0]
                        ? hoursOptions.find(
                            (option) => option.id === formData.time_slot_id[0]
                          ).time
                        : ""
                    }
                    onChange={handleChange}
                    onClick={handleClick}
                  >
                    <option value="">Periodo</option>
                    {hoursOptions.map((hour) => (
                      <option key={hour.id} value={hour.time}>
                        {hour.time}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div className="end-tag">
                <div className="end-label">
                  <Form.Label className="col-form-label">HORA FIN</Form.Label>
                </div>
                <div className="pickerStart-tag">
                  <Form.Select
                    type="input"
                    name="end"
                    value={
                      formData.time_slot_id[1]
                        ? hoursOptions.find(
                            (option) => option.id === formData.time_slot_id[1]
                          ).time
                        : ""
                    }
                    onChange={handleChange}
                    onClick={handleClick}
                  >
                    <option value="">Periodo</option>
                    {getFilteredOptions(0).map((hour) => (
                      <option key={hour.id} value={hour.time}>
                        {hour.time}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </div>
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "block", marginTop: "-10px" }}
            >
              {errors.start} {errors.end}
            </Form.Control.Feedback>
          </div>

          <div className="teacher-container mt-4 ms-4">
            <label className="tag-label">DOCENTE</label>

            <div className="teacher-tag">
              <div className="teacher-table-tag scrol-teacher">
                <Table striped bordered hover className="teacher-table">
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
                  className="teacher-edit"
                  onClick={() => setShowModal(true)}
                  style={{
                    fontSize: "26px",
                  }}
                ></FaRegEdit>
                <Form.Label className="label-edit ms-1">Editar</Form.Label>
              </div>
            </div>
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {errors.group_id}
            </Form.Control.Feedback>

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
            <div className="mt-3"></div>
          </div>
          <div className="enviroment-container mt-4 ms-4">
            <label className="tag-label">Ambiente</label>
            <div className="block-container">
              <div className="block-tag">
                <div className="block-label col-form-label">
                  <Form.Label>BLOQUE</Form.Label>
                </div>
                <div className="block-input-tag">
                  <Form.Select
                    type="input"
                    name="block_id"
                    value={formData.block_id}
                    onChange={handleChange}
                    isInvalid={!!errors.block_id}
                    onClick={handleClick}
                  >
                    <option value="">Seleccione un bloque</option>
                    {block.map((opcion) => (
                      <option
                        key={opcion.block_id}
                        value={`${opcion.block_id}`}
                      >
                        {opcion.block_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.block_id}
                  </Form.Control.Feedback>
                </div>
              </div>
            </div>

            <div className="table-class-tag">
              <label className="class-label">AULAS</label>
              <div className="class-tag scrol-classroom">
                <Table striped bordered hover className="table-tag text-center">
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
                        Capacidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(selectOptionsClass).map((option) => (
                      <tr key={option.classroom_id}>
                        <td
                          style={{
                            backgroundColor: "rgb(75, 177, 229 )",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {option.classroom_name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "rgb(75, 177, 229 )",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {option.capacity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="suggestion-edit-tag mt-1 col-2">
                <Button className="suggestion-tag" onClick={suggestionClick}>
                  Generar sugerencia
                </Button>
                {message && (
                  <Form.Text
                    className=" class-danger text-danger"
                    style={{ display: "block" }}
                  >
                    {message}
                  </Form.Text>
                )}
                <div>
                  <FaRegEdit
                    className="class-edit-tag"
                    onClick={() => setShowModalClass(true)}
                    style={{
                      fontSize: "26px",
                    }}
                  ></FaRegEdit>
                  <Form.Label className="label-edit ms-1 mt-3">
                    Editar
                  </Form.Label>
                </div>
              </div>
            </div>
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {errors.classroom_id}
            </Form.Control.Feedback>

            <Modal
              show={showModalClass}
              onHide={() => setShowModalClass(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Aulas disponibles</Modal.Title>
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
                          Capacidad
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classrom.map((item) => (
                        <tr
                          key={item.classroom_id}
                          onClick={() =>
                            handleOptionClassrom(
                              item.classroom_id,
                              item.classroom_name,
                              item.capacity
                            )
                          }
                          className={
                            selectOptionsClass[item.classroom_id]
                              ? "table-primary"
                              : ""
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ userSelect: "none" }}>
                            {item.classroom_name}
                          </td>
                          <td style={{ userSelect: "none" }}>
                            {item.capacity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
            <div className="mt-3"></div>
          </div>
        </div>

        <div className="col-12 mt-2" style={{ textAlign: "right" }}>
          <Button variant="outline-success m-3" type="submit">
            Reservar
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RequestReservationAmbience;
