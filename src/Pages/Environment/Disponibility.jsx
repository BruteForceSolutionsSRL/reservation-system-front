import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "./Disponibility.css";

function Disponibility() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [block, setBlock] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [classrom, setClassrom] = useState([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    block_id: "",
    classroom_id: [],
    time_slot_id: [],
  });

  // erros form
  const [errors, setErrors] = useState({
    date: "",
    block_id: "",
    classroom_id: [],
    time_slot_id: [],
  });

  const environments = [
    {
      classroom_name: "690A",
      "06:45:00": {
        valor: 0,
        message: "Disponible",
      },
      "07:30:00": {
        valor: 0,
        message: "Disponible",
      },
      "08:15:00": {
        valor: 0,
        message: "Disponible",
      },
      "09:00:00": {
        valor: 0,
        message: "Disponible",
      },
      "09:45:00": {
        valor: 0,
        message: "Disponible",
      },
      "10:30:00": {
        valor: 0,
        message: "Disponible",
      },
      "11:15:00": {
        valor: 0,
        message: "Disponible",
      },
      "12:00:00": {
        valor: 0,
        message: "Disponible",
      },
      "12:45:00": {
        valor: 0,
        message: "Disponible",
      },
      "13:30:00": {
        valor: 0,
        message: "Disponible",
      },
      "14:15:00": {
        valor: 0,
        message: "Disponible",
      },
      "15:00:00": {
        valor: 0,
        message: "Disponible",
      },
      "15:45:00": {
        valor: 0,
        message: "Disponible",
      },
      "16:30:00": {
        valor: 0,
        message: "Disponible",
      },
      "17:15:00": {
        valor: 0,
        message: "Disponible",
      },
      "18:00:00": {
        valor: 0,
        message: "Disponible",
      },
      "18:45:00": {
        valor: 0,
        message: "Disponible",
      },
      "19:30:00": {
        valor: 0,
        message: "Disponible",
      },
      "20:15:00": {
        valor: 0,
        message: "Disponible",
      },
      "21:00:00": {
        valor: 0,
        message: "Disponible",
      },
      "21:45:00": {
        valor: 0,
        message: "Disponible",
      },
    },
  ];

  const getColor = (valor) => {
    if (valor === 0) {
      return "#B2F2BB";
    } else if (valor === 1) {
      return "#FF9E9E";
    } else {
      return "#FFDFA3";
    }
    //return valor === 0 ? "#B2F2BB" : "#FF6B6B"; // disponible y ocupado
  };

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

  useEffect(() => {
    fetchData(`blocks`, setBlock);
    fetchData(`timeslots`, setPeriods);
  }, []);

  //validator of DATE
  const validateDate = (value) => {
    if (!value || value.trim() === "") {
      return "Seleccione una fecha.";
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
  //validator of CLASSROM
  const validateClassroom = (value) => {
    if (!value || value.length === 0) {
      return "Seleccione al menos un aula.";
    }
    return null;
  };

  //Boton enviar solicitud FORM
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.date = validateDate(formData.date);
    newErrors.block_id = validateBlock(formData.block_id);
    newErrors.classroom_id = validateClassroom(formData.classroom_id);
    setErrors(newErrors);

    if (!newErrors.date && !newErrors.block_id && !newErrors.classroom_id) {
      console.log("Datos del formulario", formData);
    } else {
      console.log("LLENE TODOS LOS CAMPOS DEL FORMULARIO");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
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

  const handleTimeSlotChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      time_slot_id: {
        ...prevData.time_slot_id,
        [name]: value,
      },
    }));
  };

  const filteredEndPeriods = periods.filter(
    (period) =>
      !formData.time_slot_id.start ||
      period.time_slot_id > formData.time_slot_id.start
  );

  const validators = {
    date: validateDate,
    block_id: validateBlock,
    classroom_id: validateClassroom,
    // Agrega más validadores para otros campos si es necesario
  };

  // update table AULA -- block_id
  useEffect(() => {
    if (!formData.block_id) {
      setClassrom([]);
      setSelectedClassrooms([]);
      setFormData((prevData) => ({
        ...prevData,
        classroom_id: [],
      }));
    } else {
      fetchData(`classrooms/block/${formData.block_id}`, setClassrom);
    }
  }, [formData.block_id]);

  //Aulas
  const handleSelectClassroom = (id) => {
    setSelectedClassrooms((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((classroomId) => classroomId !== id)
        : [...prevSelected, id]
    );
    setFormData((prevData) => {
      const newClassroomIds = selectedClassrooms.includes(id)
        ? prevData.classroom_id.filter((classroomId) => classroomId !== id)
        : [...prevData.classroom_id, id];
      return {
        ...prevData,
        classroom_id: newClassroomIds,
      };
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      classroom_id: validateClassroom(
        selectedClassrooms.includes(id)
          ? formData.classroom_id.filter((classroomId) => classroomId !== id)
          : [...formData.classroom_id, id]
      ),
    }));
  };
  //console.log("Datos del formulario desde afuera", formData);

  return (
    <div className="table-responsive">
      <h1 className="text-center">Disponibilidad de ambientes</h1>

      <div className="mt-3 ms-5">
        <Form noValidate onSubmit={handleSubmit} className="row">
          <div className="col-6 p-4 environmente-container position-relative mb-1">
            <label className="tag-label">AMBIENTE</label>
            <div>
              <label className="fw-bold">BLOQUE</label>
              <Form.Select
                className="mt-2"
                type="input"
                name="block_id"
                value={formData.block_id}
                onChange={handleChange}
                isInvalid={!!errors.block_id}
              >
                <option value="">Seleccione un bloque</option>
                {block.map((option) => (
                  <option key={option.block_id} value={option.block_id}>
                    {option.block_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.block_id}
              </Form.Control.Feedback>
            </div>

            <label className="fw-bold mt-3">AULAS</label>
            <div className="scrol-teacher-modal">
              <Table
                striped
                bordered
                hover
                className="table-tag text-center mt-2"
              >
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
                      onClick={() => handleSelectClassroom(item.classroom_id)}
                      className={
                        selectedClassrooms.includes(item.classroom_id)
                          ? "table-primary"
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ userSelect: "none" }}>
                        {item.classroom_name}
                      </td>
                      <td style={{ userSelect: "none" }}>{item.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="invalid-feedback d-block">
              {errors.classroom_id}
            </div>
          </div>

          <div className="col-6 position-relative ">
            <div className="environmente-container position-relative mb-3">
              <label className="tag-label">PERIODO</label>
              <div>
                <label className="fw-bold">PERIODO INICIAL</label>
                <Form.Select
                  className="mt-2"
                  value={formData.time_slot_id.start}
                  onChange={(e) =>
                    handleTimeSlotChange("start", e.target.value)
                  }
                >
                  {periods.map((period) => (
                    <option
                      key={period.time_slot_id}
                      value={period.time_slot_id}
                    >
                      {period.time}
                    </option>
                  ))}
                </Form.Select>
                <label className="fw-bold mt-2">PERIODO FINAL</label>
                <Form.Select
                  className="mt-2"
                  value={formData.time_slot_id.end}
                  onChange={(e) => handleTimeSlotChange("end", e.target.value)}
                >
                  {filteredEndPeriods.map((period) => (
                    <option
                      key={period.time_slot_id}
                      value={period.time_slot_id}
                    >
                      {period.time}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>

            <div>
              <label className="fw-bold">FECHA</label>
              <Form.Control
                className="mt-2"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isInvalid={!!errors.date}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </div>
            <div className="mt-3">
              <Button className="button-verify" type="submit">
                Verificar
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <div className="table-global mt-5">
        <table className="table">
          <thead>
            <tr>
              <th
                className="static-header-cell"
                style={{
                  backgroundColor: "#E7E7E7",
                  color: "black",
                }}
              >
                Ambiente
              </th>
              {environments.map((env, index) => (
                <th
                  className="environment-data"
                  key={index}
                  style={{
                    backgroundColor: "#6DC2F5",
                    color: "black",
                  }}
                >
                  {env.classroom_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, periodIndex) => (
              <tr key={periodIndex}>
                <td
                  className="time-cell"
                  style={{
                    backgroundColor: "#E7E7E7",
                    color: "black",
                  }}
                >
                  {period.time}
                </td>
                {environments.map((env, envIndex) => (
                  <td
                    key={envIndex}
                    className="data-cell"
                    style={{
                      backgroundColor: getColor(env[period.time].valor),
                    }}
                  >
                    {env[period.time].message}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Disponibility;
