import { useState, useEffect } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { getTeachersBySubject } from "../../services/teachers";
import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [selectedTeachersOptions, setselectedTeachersOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableError, setTableError] = useState("");
  const [tableInteracted, setTableInteracted] = useState(false); // Nuevo estado para controlar si se ha interactuado con la tabla

  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [showModalClass, setShowModalClass] = useState(false);
  const [tableErrorClass, setTableErrorClass] = useState("");
  const [tableInteractedClass, setTableInteractedClass] = useState(false);

  const [modalRervation, setModalReservation] = useState(false);

  const [message, setMessage] = useState(""); //ERRO DE SUGERENCIAS

  const [materias, setMaterias] = useState([]);
  const [reason, setReason] = useState([]);
  const [block, setBlock] = useState([]);
  const [classrom, setClassrom] = useState([]);
  const [hours, setHours] = useState([]);
  const [teachers, setTeachers] = useState(null);

  const [formData, setFormData] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: [], //docentes
    block_id: "", //bloque
    classroom_id: [], //aula
    time_slot_id: ["", ""], //periodo
    date: "", //fecha
    reason_id: "", //motivo
  });
  // erros form
  const [errors, setErrors] = useState({
    subject_id: "", //materia
    quantity: "", //cantidad
    group_id: [], //docentes
    block_id: "", //bloque
    classroom_id: [], //aula
    time_slot_id: ["", ""], //periodo
    date: "", //fecha
    reason_id: "", //motivo
  });

  const [suggestionData, setSuggestionData] = useState({
    block_id: "",
    time_slot_id: ["", ""],
    quantity: "",
    date: "",
  });

  //Consulta a backEnd
  const fetchData = async (endpoint, setterFunction) => {
    try {
      const response = await fetch(URL + endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setterFunction(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // GET MATERIAS
  useEffect(() => {
    fetchData(`teacher-subjects/teacher/${2}`, setMaterias);
  }, []);
  // GET MOTIVO
  useEffect(() => {
    fetchData(`reservations/reasons`, setReason);
  }, []);
  // GET BLOQUE
  useEffect(() => {
    fetchData(`blocks`, setBlock);
  }, []);
  // GET TIME SLOT
  useEffect(() => {
    fetchData(`timeslots`, setHours);
  }, []);

  useEffect(() => {
    updateTeachersList();
  }, []);

  const updateTeachersList = () => {
    let fetchData = async (id) => {
      let data = await getTeachersBySubject(id);
      return data;
    };
    setTeachers(fetchData(1));
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

  //Get date of generate suggetions
  const handleClick = () => {
    // her update state suggestions
    /*setSuggestionData((prevData) => {
      const newSuggestionData = { ...prevData };
      newSuggestionData.block_id = formData.block_id;
      newSuggestionData.time_slot_id = formData.time_slot_id;
      newSuggestionData.quantity = formData.quantity;
      newSuggestionData.date = formData.date;
      return newSuggestionData;
    });*/
    setSuggestionData({
      ...suggestionData,
      block_id: formData.block_id,
      time_slot_id: formData.time_slot_id,
      quantity: formData.quantity,
      date: formData.date,
    });
  };

  // Function validate data suggestionData
  const validateSuggestionData = () => {
    handleClick();

    if (
      suggestionData.block_id === "" &&
      suggestionData.quantity === "" &&
      suggestionData.date === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  //click on Button GENERATE SUGGESTIONS
  const suggestionClick = () => {
    const isValid = validateSuggestionData(); //validate the fields suggestionData
    if (isValid) {
      //AQUI ENVIAMOS LOS DATOS AL BACK PARA LA SUGERENCIA
      //const [classromSugg, setClassromSugg] = useState(suggeriancaBack);

      const selected = {};
      classromSugg.forEach((classroom) => {
        const existingClassroom = classrom.find(
          (c) => c.classroom_id === classroom.classroom_id
        );
        if (existingClassroom) {
          selected[classroom.classroom_id] = existingClassroom;
        }
      });

      //setSelectOptionsClass(selected);
      setSelectedClassrooms(Object.values(selected));
      setFormData({ ...formData, classroom_id: selected });

      setMessage("");
    } else {
      setSelectedClassrooms([]); //vaciamos todas aulas selccionadas
      setMessage("Seleccione cantidad, fecha, peridos y bolque");
    }
  };

  //VALIDATOR OF ENTIRE FORM
  //validator of MATERIA
  const validateMateria = (value) => {
    if (!value || value.trim() === "") {
      return "Seleccione una materia.";
    }
    return null;
  };

  // Validar la tabla DOCENTES solo si se ha interactuado con ella
  const validateTable = () => {
    if (tableInteracted && selectedTeachersOptions.length === 0) {
      setTableError("Seleccione un docente.");
      return false;
    }
    setTableError("");
    return true;
  };

  // Validar la tabla CLASSROM solo si se ha interactuado con ella
  const validateClassrom = () => {
    if (tableInteractedClass && selectedClassrooms.length === 0) {
      setTableErrorClass("Seleccione al menos un aula.");
      return false;
    }
    setTableErrorClass("");
    return true;
  };

  //validator of DATE
  const validateDate = (value) => {
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
  const handleKeyDown = (value) => {
    if (
      value.key === "-" ||
      value.key === "." ||
      value.key === "," ||
      value.key === "e" ||
      value.key === "+" ||
      value.key === "E"
    ) {
      value.preventDefault();
    }
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

  //Boton enviar solicitud FORM
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar la tabla de docentes
    if (selectedTeachersOptions.length === 0) {
      setTableError("Seleccione un docente.");
    }
    // Validar la tabla de Aulas
    if (selectedClassrooms.length === 0) {
      setTableErrorClass("Seleccione al menos un aula.");
    }
    let newErrors = {};
    newErrors.subject_id = validateMateria(formData.subject_id);
    newErrors.time_slot_id = validatePeriod(formData.time_slot_id);
    newErrors.date = validateDate(formData.date);
    newErrors.quantity = validateCantidad(formData.quantity);
    newErrors.reason_id = validateReason(formData.reason_id);
    newErrors.block_id = validateBlock(formData.block_id);

    setErrors(newErrors);
    // Si no hay errores, puedes enviar el formulario
    if (
      !newErrors.subject_id &&
      !newErrors.time_slot_id &&
      !newErrors.start &&
      !newErrors.quantity &&
      !newErrors.reason_id &&
      !newErrors.block_id &&
      selectedTeachersOptions.length > 0 &&
      selectedClassrooms.length > 0
    ) {
      //setModalReservation(true);
    } else {
      setModalReservation(true);
    }
  };

  //validador en tiempo real
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (name === "start" || name === "end") {
      setFormData((prevFormData) => {
        let newTimeSlotId = [...prevFormData.time_slot_id];
        if (name === "start") {
          newTimeSlotId[0] = value !== "" ? parseInt(value) : "";
          if (
            newTimeSlotId[1] !== "" &&
            newTimeSlotId[0] !== newTimeSlotId[1]
          ) {
            newTimeSlotId[1] = "";
          }
          setErrors((prevErrors) => ({ ...prevErrors, start: "" }));
        } else if (name === "end") {
          newTimeSlotId[1] = value !== "" ? parseInt(value) : "";
          setErrors((prevErrors) => ({ ...prevErrors, end: "" }));
        }
        return { ...prevFormData, time_slot_id: newTimeSlotId };
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

  //Filtrar horas FIN
  const getFilteredOptions = () => {
    const selectedTimeSlotId = formData.time_slot_id[0];
    if (selectedTimeSlotId) {
      const selectedHour = hours.find(
        (option) => option.time_slot_id === selectedTimeSlotId
      );
      if (selectedHour) {
        const filteredOptions = hours.filter(
          (hour) =>
            hour.time_slot_id > selectedTimeSlotId &&
            hour.time_slot_id <= selectedTimeSlotId + 4
        );
        return filteredOptions;
      }
    }
    return [];
  };

  //controlador de validadores
  const validators = {
    subject_id: validateMateria,
    time_slot_id: validatePeriod,
    date: validateDate,
    quantity: validateCantidad,
    reason_id: validateReason,
    block_id: validateBlock,
    // Agrega más validadores para otros campos si es necesario
  };

  //Docentes
  const handleSelectTeacher = (id) => {
    const selectedTeacher = teachers.find((teacher) => teacher.id === id);
    if (selectedTeacher) {
      setselectedTeachersOptions((prevSelected) =>
        prevSelected.some((teacher) => teacher.id === id)
          ? prevSelected.filter((teacher) => teacher.id !== id)
          : [...prevSelected, selectedTeacher]
      );
      setTableInteracted(true); // Marcar la tabla como interactuada
    }
  };
  //actualizar el docentesn en FormData
  useEffect(() => {
    setFormData({
      ...formData,
      group_id: selectedTeachersOptions,
    });
    validateTable(); // Validar la tabla después de cada selecció
  }, [selectedTeachersOptions]);

  // update table DOCENTE -- block_id es id seleccionado y actualizar en base a eso
  useEffect(() => {
    //console.log("verifico q id block tiene:", formData.subject_id);
    if (!formData.subject_id) {
      setTeachers([]); // clear list teacher
      setselectedTeachersOptions([]);
    } else {
      //aqui resibir datos de BACKEND para actualizar la tabla doncente
      fetchData(`teacher-subjects/subject/${formData.subject_id}`, setTeachers);
      //console.log("profesorres",teachers);
      // setTeachers(teachersTemporales); // envio teachers
    }
    setselectedTeachersOptions([]);
  }, [formData.subject_id]);

  //Aulas
  const handleSelectClassroom = (id) => {
    const selectedClassroom = classrom.find(
      (classroom) => classroom.classroom_id === id
    );
    if (selectedClassroom) {
      setSelectedClassrooms((prevSelected) =>
        prevSelected.some((classroom) => classroom.classroom_id === id)
          ? prevSelected.filter((classroom) => classroom.classroom_id !== id)
          : [...prevSelected, selectedClassroom]
      );
      setTableInteractedClass(true);
    }
  };
  //actualizar el aulas en FormData
  useEffect(() => {
    setFormData({
      ...formData,
      classroom_id: selectedClassrooms,
    });
    validateClassrom();
  }, [selectedClassrooms]);

  // update table AULA -- block_id es id seleccionado y actualizar en base a eso aulas diponibles
  useEffect(() => {
    if (!formData.block_id) {
      setClassrom([]); // clear list aulas
      setSelectedClassrooms([]); // clear list teacher y los seleccionados hasta el momento
    } else {
      //aqui resibir datos de back para actualizar la tabla aulas
      fetchData(`classrooms/block/${formData.block_id}`, setClassrom);
      //setClassrom(classromTemporales); // envio classroms manual
    }
    setSelectedClassrooms([]);
  }, [formData.block_id]);

  //Show in console seleccted CLASSROMS and SUGGESTIONS
  useEffect(
    () => {
      //console.log("Aulas seleccionadas y sugerencias", formData.classroom_id);
      //console.log("Formulario datos", formData);
      //console.log("Sugenreacias", suggestionData);
    },
    [formData.classroom_id],
    [formData.block_id],
    [formData.quantity]
  );

  //Ejemplo de docentesINTRO A LA PROG
  // const teachersTemporales = [
  //   { id: 0, teacher_name: "Letecia Blanco Coca", group_number: "2" },
  //   { id: 1, teacher_name: "Carla Serrudo Salazar", group_number: "1" },
  //   { id: 2, teacher_name: "Carla Serrudo Salazar", group_number: "6" },
  //   { id: 3, teacher_name: "Vladimir Costas Jauregui", group_number: "10" },
  //   { id: 4, teacher_name: "Hernan Ustariz Vargas", group_number: "3" },
  //   { id: 5, teacher_name: "Victor Hugo Montaño", group_number: "5" },
  //   { id: 6, teacher_name: "Vladimir Costas Jauregui", group_number: "7" },
  //   { id: 7, teacher_name: "Henry Frank Villaroel", group_number: "4" },
  // ];
  // const [teachers, setTeachers] = useState(teachersTemporales);

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
              {/* <Form.Label>MATERIA</Form.Label> */}
              <b>MATERIA</b>
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
                {materias.map((opcion) => (
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
                onKeyDown={handleKeyDown}
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
                    value={formData.time_slot_id[0]}
                    onChange={handleChange}
                    onClick={handleClick}
                  >
                    <option value="">Periodo</option>
                    {hours.map((hour) => (
                      <option key={hour.time_slot_id} value={hour.time_slot_id}>
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
                    value={formData.time_slot_id[1]}
                    onChange={handleChange}
                    onClick={handleClick}
                  >
                    <option value="">Periodo</option>
                    {getFilteredOptions(0).map((hour) => (
                      <option key={hour.time_slot_id} value={hour.time_slot_id}>
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
              {errors.time_slot_id}
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
                    {selectedTeachersOptions.map((option) => (
                      <tr key={option.id}>
                        <td
                          style={{
                            backgroundColor: "rgb(75, 177, 229 )",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {option.teacher_name}
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
              {tableError}
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
                      {teachers?.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectTeacher(item.id)}
                          className={
                            selectedTeachersOptions.some(
                              (teacher) => teacher.id === item.id
                            )
                              ? "table-primary"
                              : ""
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ userSelect: "none" }}>
                            {item.teacher_name}
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
                    {selectedClassrooms.map((option) => (
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
              {tableErrorClass}
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
                            handleSelectClassroom(item.classroom_id)
                          }
                          className={
                            selectedClassrooms.some(
                              (classroom) =>
                                classroom.classroom_id === item.classroom_id
                            )
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

        <div>
          <Modal
            show={modalRervation}
            onHide={() => setModalReservation(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>!CONFIRMACION¡</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>HOLA MENSAJE DE CONFIMACION</div>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </div>

        <div className="col-12 mt-2" style={{ textAlign: "right" }}>
          <Button 
            variant="outline-success m-3" 
            type="submit"
            >
            Reservar
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RequestReservationAmbience;
