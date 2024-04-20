import React, { useState, useEffect } from "react";
import { Form, Button, Table, Container } from "react-bootstrap";
//import { BsX } from "react-icons/bs";
import CalendarOwn from "./Calendar/CalendarOwn";
import TimePicker from "./Calendar/TimePicker";
import "./RequestReservationAmbience.css";

function RequestReservationAmbience() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedOptionsNames, setSelectedOptionsNames] = useState({});

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

  const [errors, setErrors] = useState({
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

  //Boton enviar solicitud
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    newErrors.materia = validateMateria(formData.materia);
    newErrors.docentes = validateTeacher(formData.docentes);

    setErrors(newErrors);
    // Si no hay errores, puedes enviar el formulario
    if (!newErrors.materia && !newErrors.docentes) {
      console.log("Datos del formulario:", formData);
    }
  };

  //validador en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  //controlador de validadores
  const validators = {
    materia: validateMateria,
    docentes: validateTeacher,
    // Agrega más validadores para otros campos si es necesario
  };

  /*
  const validateCantEst = (value) => {
    if (!value) {
      return "Este campo es obligatorio.";
    } else if (!/^\d+$/.test(value) || /--/.test(value)) {
      return "Carácter inválido. Por favor, ingrese solo números.";
    } else if (value < 1 || value > 999) {
      return "Por favor, ingrese un número válido entre 1 y 999.";
    }
    return null;
  };*/

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

  //calendario
  const handleDateSelect = (date) => {
    setFormData({ ...formData, fecha: date }); // Actualiza el estado del formulario con la fecha seleccionada
  };
  const handleTimeChange = ({ startHourId, endHourId }) => {
    setFormData({
      ...formData,
      horaInicio: startHourId,
      horaFin: endHourId,
    });
  };

  //Docentes
  const handleOptionClick = (id, nombre, grupo) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelection = { ...prevSelectedOptions };
      if (updatedSelection[id]) {
        delete updatedSelection[id];
      } else {
        updatedSelection[id] = { id, nombre, grupo };
      }
      // Actualizar formData.docentes con el formato deseado
      setFormData({
        ...formData,
        docentes: updatedSelection,
      });
      return updatedSelection;
    });
    setSelectedOptionsNames((prevSelectedOptionsNames) => {
      const updatedSelectionNames = { ...prevSelectedOptionsNames };
      if (prevSelectedOptionsNames[id]) {
        delete updatedSelectionNames[id];
      } else {
        updatedSelectionNames[id] = { id, nombre, grupo };
      }
      return updatedSelectionNames;
    });
  };
  // Actualizar la tabla docentes en base a lo que se selecciono
  useEffect(() => {
    // Si no se ha seleccionado ninguna materia, mostrar la lista de docentes vacía
    if (!formData.materia) {
      setIntro([]); // Vaciar la lista de docentes
    } else {
      // Según la materia seleccionada, actualizar la lista de docentes
      setIntro(introTemporales);
    }
  }, [formData.materia]);

  //Ver lo que se selcciona de la tabla docentes e imprimirlo
  useEffect(() => {
    console.log(formData.docentes);
  }, [selectedOptions]);

  //Ejemplo de materias
  const materiaTemporal = [
    { id: 0, materia: "Elementos de programacion y estructura de datos" },
    { id: 1, materia: "Intro a la programacion" },
    { id: 2, materia: "Aquitectura de computadoras" },
    { id: 3, materia: "Algoritmos avanzados" },
    { id: 4, materia: "Taller de ingenieria de soft" },
  ];
  const [materias, setMaterias] = useState(materiaTemporal);

  //Ejemplo de docentes ELEMENTOS DE PROG
  const elementosTemporales = [
    { id: 0, docente: "Letecia Blanco Coca", grupo: "2" },
    { id: 1, docente: "Letecia Blanco Coca", grupo: "3" },
    { id: 2, docente: "Rosemary Torrico Bascope", grupo: "1" },
    { id: 3, docente: "Helder Guzman Fernandez", grupo: "5" },
  ];
  const [elementos, setElementos] = useState(elementosTemporales);

  //Ejemplo de docentesINTRO A LA PROG
  const introTemporales = [
    { id: 0, docente: "Letecia Blanco Coca", grupo: "2" },
    { id: 1, docente: "Carla Serrudo Salazar", grupo: "1" },
    { id: 2, docente: "Carla Serrudo Salazar", grupo: "6" },
    { id: 3, docente: "Vladimir Costas Jauregui", grupo: "10" },
    { id: 4, docente: "Hernan Ustariz Vargas", grupo: "3" },
    { id: 5, docente: "Victor Hugo Montaño", grupo: "5" },
    { id: 6, docente: "Vladimir Costas Jauregui", grupo: "7" },
    { id: 7, docente: "Henry Frank Villaroel", grupo: "4" },
  ];
  const [intro, setIntro] = useState(introTemporales);

  //Ejemplo de ARQUI DE COMPU
  const arquiTemporales = [
    { id: 0, docente: "Letecia Blanco Coca", grupo: "2" },
    { id: 1, docente: "Samuel Acha Perez", grupo: "1" },
    { id: 2, docente: "Luis Agreda Corrales", grupo: "3" },
  ];
  const [arqui, setArqui] = useState(arquiTemporales);

  return (
    <div>
      <Form noValidate onSubmit={handleSubmit} className="formulario-principal">
        <h1 className="text-center text-sm">Formulario de Reserva</h1>
        <div>
          <div className="row mt-4 ms-2">
            <div className="col-sm-auto">
              <Form.Label className="col-form-label ">Materia</Form.Label>
            </div>
            <div className="col-11">
              <Form.Select
                type="input"
                name="materia"
                value={formData.materia}
                onChange={handleChange}
                isInvalid={!!errors.materia}
              >
                <option value="">Seleccione una materia</option>
                {materias.map((opcion) => (
                  <option
                    key={opcion.id}
                    value={`${opcion.id},${opcion.materia}`}
                  >
                    {opcion.materia}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.materia}
              </Form.Control.Feedback>
            </div>
          </div>
          {/*hata aqui el primero input 
          
          */}
          <div className="tag-container mt-5 ms-3">
            <label className="tag-label">DOCENTE</label>
            <div className="periods-container">
              <div className="scrol-teacher">
                <Table striped bordered hover className="fixed-header ">
                  <thead>
                    <tr>
                      <th className="sticky-header text-center">Nombre</th>
                      <th className="sticky-header text-center">Grupo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intro.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          handleOptionClick(item.id, item.docente, item.grupo)
                        }
                        className={
                          selectedOptions[item.id] ? "table-primary" : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.docente}</td>
                        <td>{item.grupo}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.docentes}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-sm-auto">
              <Form.Label>Cantidad de estudiantes</Form.Label>
            </div>
            <div className="col-3">
              <Form.Control type="number" placeholder="Ej. 999" />
            </div>
            <div className="col-1">
              <Form.Label>Fecha:</Form.Label>
            </div>
            <div className="col-2">
              <CalendarOwn onTimeChange={handleDateSelect}></CalendarOwn>
            </div>
          </div>
          <div className="tag-container mb-3">
            <label className="tag-label"> Periodos</label>
            <div className="periods-container">
              <TimePicker onTimeChange={handleTimeChange}></TimePicker>
            </div>
          </div>
          <div className="tag-container position-relative mb-3">
            <label className="tag-label">Ambiente</label>
            <div className="classroom-container">
              <div className="container"></div>
            </div>
          </div>
          <div>
            <Form.Label className=" mt-4">Motivo de reserva</Form.Label>
          </div>
        </div>

        <div className="container-teacher container mb-3">
          <Form.Label className="mt-4">Docentes</Form.Label>
        </div>

        <div className="col-12 text-center">
          <Button variant="outline-success m-3" type="submit">
            Enviar solicitud
          </Button>
          <Button variant="outline-danger">Cancelar</Button>
        </div>
      </Form>
    </div>
  );
}

export default RequestReservationAmbience;
