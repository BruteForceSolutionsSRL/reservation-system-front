import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Table } from "react-bootstrap";
import { getCurrentDate } from "../../utils/getCurrentDate";
import "./Disponibility.css";

function Disponibility() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [block, setBlock] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    block_id: "",
    classroom_ids: [],
    time_slot_ids: [1, 21],
  });

  const [errors, setErrors] = useState({
    date: "",
    block_id: "",
    classroom_ids: [],
    time_slot_ids: [],
  });

  useEffect(() => {
    fetchData("blocks", setBlock);
    fetchData("timeslots", setPeriods);
  }, []);

  useEffect(() => {
    if (!formData.block_id) {
      clear();
    } else {
      clear();
      fetchData(`classrooms/block/${formData.block_id}`, setClassrooms);
    }
  }, [formData.block_id]);

  const fetchData = async (endpoint, setterFunction) => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(`${URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setterFunction(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendDataAndGetResponse = async (data, dataDisponibility) => {
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(`${URL}classrooms/disponibility`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("La respuesta de la red no fue exitosa");
      }
      const responseData = await response.json();
      dataDisponibility(responseData);
      setShowTable(true);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      date: validateDate(formData.date),
      block_id: validateBlock(formData.block_id),
      classroom_ids: validateClassroom(formData.classroom_ids),
    };
    setErrors(newErrors);

    if (!newErrors.date && !newErrors.block_id && !newErrors.classroom_ids) {
      sendDataAndGetResponse(formData, setEnvironments);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validators[name](value),
    }));
  };

  const handleSelectClassroom = (id) => {
    const isSelected = selectedClassrooms.includes(id);
    const newSelectedClassrooms = isSelected
      ? selectedClassrooms.filter((classroomId) => classroomId !== id)
      : [...selectedClassrooms, id];

    setSelectedClassrooms(newSelectedClassrooms);
    setFormData((prevData) => ({
      ...prevData,
      classroom_ids: newSelectedClassrooms,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      classroom_ids: validateClassroom(newSelectedClassrooms),
    }));
  };

  const handleTimeSlotChange = (index, value) => {
    setFormData((prevData) => {
      const newTimeSlots = [...prevData.time_slot_ids];
      newTimeSlots[index] = parseInt(value, 10);
      if (index === 0 && newTimeSlots[1] <= newTimeSlots[0]) {
        const newEndPeriods = periods.filter(
          (period) => period.time_slot_ids > parseInt(value, 10)
        );
        newTimeSlots[1] =
          newEndPeriods.length > 0 ? newEndPeriods[0].time_slot_ids : value;
      }
      return {
        ...prevData,
        time_slot_ids: newTimeSlots,
      };
    });
  };

  const clear = () => {
    setShowTable(false);
    setClassrooms([]);
    setSelectedClassrooms([]);
    setFormData((prevData) => ({
      ...prevData,
      classroom_id: [],
    }));
  };

  const validateDate = (value) =>
    !value.trim() ? "Seleccione una fecha." : null;
  const validateBlock = (value) =>
    !value.trim() ? "Seleccione un bloque." : null;
  const validateClassroom = (value) =>
    !value || value.length === 0 ? "Seleccione un aula." : null;

  const validators = {
    date: validateDate,
    block_id: validateBlock,
    classroom_id: validateClassroom,
  };

  const filteredEndPeriods = periods.filter(
    (period) =>
      !formData.time_slot_ids[0] ||
      period.time_slot_id > formData.time_slot_ids[0]
  );

  const getColor = (valor) => {
    const colorMap = {
      0: "#0AE98A",
      1: "#FF9E9E",
      default: "#FFDFA3",
    };
    return colorMap[valor] || colorMap.default;
  };

  return (
    <div className="m-4">
      <h1 className="text-center">Disponibilidad de ambientes</h1>

      <div className="mt-3 ms-3 me-3">
        <Form noValidate onSubmit={handleSubmit} className="row">
          <div className="col-6 p-4 environmente-container position-relative">
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
                    {option.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.block_id}
              </Form.Control.Feedback>
            </div>

            {formData.block_id !== "" ? (
              <>
                <label className="fw-bold mt-4">AULAS</label>
                <div
                  className="scrol-teacher-modal h-100 overflow-y-auto mt-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <Table
                    striped
                    bordered
                    hover
                    className="table-tag text-center"
                  >
                    <thead>
                      <tr>
                        <th
                          className="sticky-header text-center"
                          style={{
                            backgroundColor: "rgb(4, 94, 140)",
                            color: "white",
                            userSelect: "none",
                            position: "sticky",
                            top: 0,
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
                            position: "sticky",
                            top: 0,
                          }}
                        >
                          Capacidad
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classrooms.map((item) => (
                        <tr
                          key={item.classroom_id}
                          onClick={() =>
                            handleSelectClassroom(item.classroom_id)
                          }
                          className={
                            selectedClassrooms.includes(item.classroom_id)
                              ? "table-primary"
                              : ""
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ userSelect: "none" }}>{item.name}</td>
                          <td style={{ userSelect: "none" }}>
                            {item.capacity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="invalid-feedback d-block">
                  {errors.classroom_ids}
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center mt-5">
                <p className="fs-5 text-center fw-bold">
                  Lista de aulas no disponible, seleccione un bloque.
                </p>
              </div>
            )}
          </div>

          <div className="col-6 position-relative">
            <div className="environmente-container position-relative mb-3">
              <label className="tag-label">PERIODO</label>
              <div>
                <label className="fw-bold">PERIODO INICIAL</label>
                <Form.Select
                  className="mt-2"
                  value={formData.time_slot_ids[0]}
                  onChange={(e) => handleTimeSlotChange(0, e.target.value)}
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
                  value={formData.time_slot_ids[1]}
                  onChange={(e) => handleTimeSlotChange(1, e.target.value)}
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
            <div className="mt-3 d-flex justify-content-center">
              <Button
                className="button-verify btn btn-primary custom-btn-primary-outline"
                type="submit"
              >
                Verificar
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <div className="table-global mt-5">
        {showTable && (
          <table className="table">
            <thead>
              <tr>
                <th
                  className="static-header-cell"
                  style={{
                    backgroundColor: "#041231",
                    color: "WHITE",
                  }}
                >
                  Ambiente
                </th>
                {environments.map((env, index) => (
                  <th
                    className="environment-data"
                    key={index}
                    style={{
                      backgroundColor: "#045e8c",
                      color: "WHITE",
                    }}
                  >
                    {env.classroom_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods
                .filter((period) =>
                  environments.some((env) => env[period.time])
                )
                .map((period, periodIndex) => {
                  const filteredEnvironments = environments.filter(
                    (env) => env[period.time]
                  );
                  return (
                    <tr key={periodIndex}>
                      <td
                        className="time-cell"
                        style={{
                          backgroundColor: "#E1DAF9",
                          color: "black",
                        }}
                      >
                        {period.time}
                      </td>
                      {filteredEnvironments.map((env, envIndex) => (
                        <td
                          key={envIndex}
                          className="data-cell"
                          style={{
                            backgroundColor: getColor(env[period.time]?.valor),
                          }}
                        >
                          {env[period.time]?.message || "N/A"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Disponibility;
