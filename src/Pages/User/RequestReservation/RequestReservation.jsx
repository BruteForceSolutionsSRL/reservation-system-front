import { useEffect, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import { getSubjects } from "../../../services/subjects";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { getRequestsReasons, sendRequest } from "../../../services/requests";
import { getTimeSlots } from "../../../services/timeSlots";
import { getBlocks } from "../../../services/blocks";
import { getTeachersBySubject } from "../../../services/teachers";
import {
  getClassroomsByBlock,
  getSuggestsClassrooms,
} from "../../../services/classrooms";
import ModalTable from "../../../Components/ModalTable/ModalTable";

export default function RequestReservation() {
  // Information user loged
  const user = JSON.parse(sessionStorage.getItem("userInformation"));

  const [formData, setFormData] = useState({});

  // For subjects
  const [subjects, setSubjects] = useState(null);
  const [subjectSelected, setSubjectSelected] = useState("default");
  // For quantity
  const [quantity, setQuantity] = useState("");
  // For Date
  const [dateValue, setDateValue] = useState("");
  // For reasons
  const [reasons, setReasons] = useState([]);
  const [reasonSelected, setReasonSelected] = useState("default");
  // For timeSlots
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTimeSlots, setStartTimeSlots] = useState([]);
  const [endTimeSlots, setEndTimeSlots] = useState([]);
  // For blocks
  const [blocks, setBlocks] = useState([]);
  const [blockSelected, setBlockSelected] = useState("default");
  // For teachers
  const [teachersBySubject, setTeachersBySubject] = useState([]);
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  const [teachersSelectedInModal, setTeachersSelectedInModal] = useState([]);
  // For classrooms
  const [classroomsByBlock, setClassroomsByBlock] = useState([]);
  const [showClassroomssModal, setShowClassroomsModal] = useState(false);
  const [classroomsSelectedInModal, setClassroomsSelectedInModal] = useState(
    []
  );
  const [suggAvailable, setSuggAvailable] = useState(false);
  // Errors messages
  const [errorsMessages, setErrorsMessages] = useState({
    subject: {
      message: null,
      isInvalid: false,
    },
    quantity: {
      message: null,
      isInvalid: false,
    },
    date: {
      message: null,
      isInvalid: false,
    },
    reason: {
      message: null,
      isInvalid: false,
    },
    periods: {
      startTime: {
        message: null,
        isInvalid: false,
      },
      endTime: {
        message: null,
        isInvalid: false,
      },
    },
    teachers: {
      message: null,
      isInvalid: false,
    },
    block: {
      message: null,
      isInvalid: false,
    },
    classrooms: {
      message: null,
      isInvalid: false,
    },
  });

  const [modalSendRequest, setModalSendRequest] = useState({
    show: false,
    content: {
      title: "",
      body: "",
    },
  });

  useEffect(() => {
    setDateValue(getCurrentDate());
    Promise.all([
      fetchSubjects(),
      fetchReasons(),
      fetchTimeSlots(),
      fetchBlocks(),
    ]).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const index = timeSlots.findIndex((slot) => slot.time_slot_id == startTime);
    if (index === -1) {
      setEndTimeSlots([]);
      setEndTime(0);
    } else {
      const newEndTimeSlots = timeSlots.slice(index + 1, index + 5);
      setEndTimeSlots(newEndTimeSlots);
      if (newEndTimeSlots.length > 0) {
        setEndTime(newEndTimeSlots[0].time_slot_id);
      } else {
        setEndTime(0);
      }
    }
  }, [startTime, timeSlots]);

  useEffect(() => {
    console.log(classroomsSelectedInModal);
  }, [classroomsSelectedInModal]);

  const setField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const fetchSubjects = async () => {
    const sbjs = await getSubjects();
    setSubjects(sbjs);
  };

  const fetchReasons = async () => {
    const rsns = await getRequestsReasons();
    setReasons(rsns);
  };

  const fetchTimeSlots = async () => {
    const tmsl = await getTimeSlots();
    setTimeSlots(tmsl);
    if (tmsl.length > 1) {
      setStartTime(tmsl[0].time_slot_id);
      setEndTime(tmsl[1].time_slot_id);
    }
    let startSlots = [...tmsl];
    startSlots.pop();
    setStartTimeSlots(startSlots);
  };

  const fetchBlocks = async () => {
    const blks = await getBlocks();
    setBlocks(blks);
  };

  const fetchTeachersBySubject = async (subject_id) => {
    const tbs = await getTeachersBySubject(subject_id);
    setTeachersSelectedInModal([]);
    setTeachersBySubject(tbs);
  };

  const fetchClassroomsByBlock = async (block_id) => {
    const clsm = await getClassroomsByBlock(block_id);
    setClassroomsSelectedInModal([]);
    setClassroomsByBlock(clsm);
  };

  const handleChangeSubjects = (value) => {
    setSubjectSelected(value);
    setField("subject", value);
    fetchTeachersBySubject(value);

    // Validations.
    let newErrorsMessages = { ...errorsMessages };
    if (value === "default") {
      newErrorsMessages.subject = {
        message: "Seleccione una materia.",
        isInvalid: true,
      };
      setErrorsMessages(newErrorsMessages);
    } else {
      newErrorsMessages.subject = {
        message: "",
        isInvalid: false,
      };
      setErrorsMessages(newErrorsMessages);
    }
  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }

    let newErrorsMessages = { ...errorsMessages };
    if (!!value.trim()) {
      // Cuando el campo no esta vacio, entra.
      if (value < 25 || value > 500) {
        newErrorsMessages.quantity = {
          message:
            "La cantidad de estudiantes debe ser mayor a 25 y menor a 500",
          isInvalid: true,
        };
        setSuggAvailable(false);
        setErrorsMessages(newErrorsMessages);
      } else {
        newErrorsMessages.quantity = {
          message: "",
          isInvalid: false,
        };
        setSuggAvailable(true);
        setErrorsMessages(newErrorsMessages);
      }
    } else {
      newErrorsMessages.quantity = {
        message: "Ingrese la cantidad de estudiantes.",
        isInvalid: true,
      };
      setSuggAvailable(false);
      setErrorsMessages(newErrorsMessages);
    }
  };

  const handleDateChange = (e) => {
    // Agregar validaciones para fecha.
    const newValue = e.target.value;
    if (newValue) {
      setDateValue(newValue);
    }
  };

  const handleChangeReason = ({ value }) => {
    setReasonSelected(value);
    // Validations.
    let newErrorsMessages = { ...errorsMessages };
    if (value === "default") {
      newErrorsMessages.reason = {
        message: "Seleccione una materia.",
        isInvalid: true,
      };
      setErrorsMessages(newErrorsMessages);
    } else {
      newErrorsMessages.reason = {
        message: "",
        isInvalid: false,
      };
      setErrorsMessages(newErrorsMessages);
    }
  };

  const handleChangeBlocks = ({ value }) => {
    setBlockSelected(value);
    fetchClassroomsByBlock(value);

    // Validation
    let newErrorsMessages = { ...errorsMessages };
    if (value === "default") {
      newErrorsMessages.block = {
        message: "Seleccione un bloque",
        isInvalid: true,
      };
    } else {
      newErrorsMessages.block = {
        message: "",
        isInvalid: false,
      };
    }
    setErrorsMessages(newErrorsMessages);
  };

  const handleClickTeacherRow = (teacher) => {
    let tchrList = [...teachersSelectedInModal];

    if (tchrList.includes(teacher)) {
      tchrList = tchrList.filter((tchr) => tchr !== teacher);
    } else {
      tchrList = [...teachersSelectedInModal, teacher];
    }

    // Validations
    let newErrorsMessages = { ...errorsMessages };
    let tchrInList = !!tchrList.find((teacher) => {
      return teacher.person_id === user.teacher_id;
    });

    if (tchrList.length !== 0) {
      if (tchrInList) {
        newErrorsMessages.teachers = {
          message: "",
          isInvalid: false,
        };
      } else {
        newErrorsMessages.teachers = {
          message: "Seleccione uno de sus grupos.",
          isInvalid: true,
        };
      }
    } else {
      newErrorsMessages.teachers = {
        message: "Seleccione almenos uno de sus grupos.",
        isInvalid: true,
      };
    }

    setTeachersSelectedInModal(tchrList);
    setErrorsMessages(newErrorsMessages);
  };

  const handleClickClassroomRow = (classroom) => {
    let clssList = [...classroomsSelectedInModal];

    if (clssList.includes(classroom)) {
      clssList = clssList.filter((clr) => clr !== classroom);
    } else {
      clssList = [...classroomsSelectedInModal, classroom];
    }
    setClassroomsSelectedInModal(clssList);

    // Validations
    let newErrorsMessages = { ...errorsMessages };
    if (clssList.length === 0) {
      newErrorsMessages.classrooms = {
        message: "Seleccione al menos un aula",
        isInvalid: true,
      };
    } else {
      newErrorsMessages.classrooms = {
        message: "",
        isInvalid: false,
      };
    }

    setErrorsMessages(newErrorsMessages);
  };

  const getSuggest = async () => {
    let dataSugg = {
      block_id: blockSelected,
      time_slot_id: [startTime, endTime],
      quantity: quantity,
      date: dateValue,
    };
    const suggests = await getSuggestsClassrooms(dataSugg);
    console.log("suggest", suggests);
    if (!suggests.message) {
      setClassroomsSelectedInModal(suggests);
    }
  };

  const handleSendRequest = async () => {
    // setModalSendRequest(true);
    let groups = [...teachersSelectedInModal];
    let groupNumbers = groups.map(({ group_number }) => group_number);
    let classrooms = [...classroomsSelectedInModal];
    let classroomIds = classrooms.map(({ classroom_id }) => classroom_id);
    let request = {
      subject_id: subjectSelected,
      group_id: groupNumbers,
      block_id: blockSelected,
      classroom_id: classroomIds,
      time_slot_id: [startTime, endTime],
      quantity: quantity,
      date: dateValue,
      reason_id: reasonSelected,
    };

    let response = await sendRequest(request);
    console.log(response.message);
    setModalSendRequest({
      content: { title: "Warning", body: response.message },
      show: true,
    });
  };

  const validateFields = () => {
    const newErrorsMessages = { ...errorsMessages };
    setErrorsMessages(newErrorsMessages);
  };

  return (
    <div className="container">
      <h1 className="text-center pb-2">Reservar ambiente</h1>
      <Form>
        <div className="row">
          <div className="col-sm-2">
            <label htmlFor="subjects">
              <b>MATERIA</b>
            </label>
          </div>
          <div className="col-sm-10">
            <Form.Select
              name="subjects"
              id="subjects-select"
              isInvalid={errorsMessages.subject.isInvalid}
              value={subjectSelected}
              onChange={(e) => handleChangeSubjects(e.currentTarget.value)}
            >
              <option value="default" disabled={subjectSelected !== "default"}>
                Seleccione una opcion
              </option>
              {subjects?.map((each) => {
                return (
                  <option key={each.subject_id} value={each.subject_id}>
                    {each.subject_name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errorsMessages.subject.isInvalid &&
                errorsMessages.subject.message}
            </Form.Control.Feedback>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-6">
            <b className="">CANTIDAD DE ESTUDIANTES</b>
            <Form.Control
              type="text"
              className="form-control"
              // value={quantity}
              value={quantity ?? ""}
              onChange={handleChangeQuantity}
              placeholder="Ingrese la cantidad de estudiantes para la solicitud..."
              isInvalid={errorsMessages.quantity.isInvalid}
              inputMode="numeric"
            />

            <Form.Control.Feedback type="invalid">
              {errorsMessages.quantity.message}
            </Form.Control.Feedback>
          </div>
          <div className="col-6">
            <b className="col-1">FECHA</b>
            <Form.Control
              type="date"
              className="col-sm form-control"
              value={dateValue}
              onChange={handleDateChange}
              min={getCurrentDate()}
              max="2024-07-06"
            />
          </div>
          {/* Error message for date */}
        </div>
        <div className="row pt-2">
          <div className="col-sm-2">
            <label htmlFor="reason" className="">
              <b>MOTIVO</b>
            </label>
          </div>
          <div className="col-sm-10">
            <Form.Select
              name="reason"
              id="reason-Form.Select"
              className="col-sm-10 form-Form.Select"
              value={reasonSelected}
              onChange={(e) => handleChangeReason(e.target)}
              isInvalid={errorsMessages.reason.isInvalid}
            >
              <option value="default" disabled={reasonSelected !== "default"}>
                Seleccione una opcion
              </option>
              {reasons?.map((each) => {
                return (
                  <option key={each.reason_id} value={each.reason_id}>
                    {each.reason_name}
                  </option>
                );
              })}
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {errorsMessages.reason.message}
            </Form.Control.Feedback>
          </div>
          {/* Error message for reason */}
        </div>

        <div className="mt-2 ps-1 pe-1 border rounded">
          <b>PERIODOS</b>
          <div className="row p-3">
            <div className="col-sm-2">
              <b>HORA INICIO</b>
            </div>
            <div className="col-sm-4">
              <Form.Select
                className="form-select"
                value={startTime}
                onChange={(e) => {
                  // Agregar validaciones en tiempo real.
                  setStartTime(e.target.value);
                }}
              >
                {startTimeSlots.map((each) => {
                  return (
                    <option key={each.time_slot_id} value={each.time_slot_id}>
                      {each.time}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            {/* Error message for init hour */}

            <div className="col-sm-2">
              <b>HORA FIN</b>
            </div>
            <div className="col-sm-4">
              <Form.Select
                name=""
                id=""
                className="col-sm form-select"
                value={endTime}
                onChange={(e) => {
                  // Agregar validaciones en tiempo real.
                  setEndTime(e.target.value);
                }}
                disabled={endTimeSlots.length === 0}
              >
                {endTimeSlots.map((each) => {
                  return (
                    <option key={each.time_slot_id} value={each.time_slot_id}>
                      {each.time}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            {/* Error message for end hour */}
          </div>
        </div>

        <div className="mt-2 ps-1 pe-1 border rounded">
          <b>DOCENTE</b>
          <div className="row p-3">
            {subjectSelected === "default" ? (
              <div className="text-center pb-4">
                <b>Seleccione una materia</b>
              </div>
            ) : (
              <>
                <div className="col-sm-10">
                  <Form.Group>
                    {teachersSelectedInModal.length === 0 ? (
                      <div className="text-center">
                        <b>
                          Presione el boton "
                          <i className="bi bi-pencil-square"></i> Editar" para
                          agregar o quitar docentes a la solicitud"
                        </b>
                      </div>
                    ) : (
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Grupo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachersSelectedInModal.map((each) => {
                            return (
                              <tr key={each.id}>
                                <td>
                                  {each.teacher_name} {each.teacher_last_name}
                                </td>
                                <td>{each.group_number}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </Form.Group>
                </div>
                <div className="col-sm-2 text-center align-self-center">
                  <div>
                    <button
                      type="button"
                      className="btn btn-lg"
                      onClick={() => setShowTeachersModal(true)}
                    >
                      <i className="bi bi-pencil-square"></i> Editar
                    </button>
                  </div>
                </div>

                {errorsMessages.teachers.isInvalid && (
                  // <Alert variant={"danger"} className="text-center">
                  //   {errorsMessages.teachers.message}
                  // </Alert>
                  <div className="d-block invalid-feedback">
                    {errorsMessages.teachers.message}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mt-2 ps-1 pe-1 border rounded">
          <b>AMBIENTE</b>
          <div className="row pt-3">
            <div className="col-sm-2">
              <b>BLOQUE: </b>
            </div>
            <div className="col-sm-10">
              <Form.Select
                className="form-select"
                value={blockSelected}
                onChange={(e) => handleChangeBlocks(e.target)}
                isInvalid={errorsMessages.block.isInvalid}
              >
                <option value="default" disabled={blockSelected !== "default"}>
                  Seleccione una opcion
                </option>
                {blocks.map((each) => {
                  return (
                    <option key={each.block_id} value={each.block_id}>
                      {each.block_name}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errorsMessages.block.message}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-sm-2">
              <b>AULA(s)</b>
            </div>
            {blockSelected === "default" ? (
              <div className="text-center pb-4">
                <b>Seleccione un bloque</b>
              </div>
            ) : (
              <>
                <div className="col-sm-8">
                  {classroomsSelectedInModal.length === 0 ? (
                    <div className="text-center">
                      <b>
                        Presione el boton "
                        <i className="bi bi-pencil-square"></i> Editar" para
                        agregar o quitar aulas de la solicitud"
                      </b>
                    </div>
                  ) : (
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Capacidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classroomsSelectedInModal.map((each) => {
                          return (
                            <tr key={each.classroom_id}>
                              <td>{each.classroom_name}</td>
                              <td>{each.capacity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </div>
                <div className="col-sm-2 align-self-center text-center">
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm mb-2"
                      disabled={!suggAvailable}
                      onClick={getSuggest}
                    >
                      Generar sugerencia
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-lg"
                      onClick={() => setShowClassroomsModal(true)}
                    >
                      <i className="bi bi-pencil-square"></i> Editar
                    </button>
                  </div>
                </div>
                {errorsMessages.classrooms.isInvalid && (
                  // <Alert variant={"danger"} className="text-center">
                  //   {errorsMessages.teachers.message}
                  // </Alert>
                  <div className="d-block invalid-feedback">
                    {errorsMessages.classrooms.message}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end m-5">
          <button
            type="submit"
            className="btn btn-outline-success"
            onClick={(e) => {
              e.preventDefault();
              handleSendRequest();
            }}
          >
            Reservar
          </button>
        </div>
      </Form>

      {/* Modal click "Reservar" */}
      <Modal
        show={modalSendRequest.show}
        onHide={() => setModalSendRequest({ ...modalSendRequest, show: false })}
        centered
      >
        <Modal.Title>{modalSendRequest.content.title}</Modal.Title>
        <Modal.Body>{modalSendRequest.content.body}</Modal.Body>
      </Modal>

      {/* Modal for teachers */}
      <ModalTable
        title={"Lista de docentes"}
        showState={{
          show: showTeachersModal,
          setShow: setShowTeachersModal,
        }}
        headers={
          <>
            <th>Nombre</th>
            <th>Grupo</th>
          </>
        }
        contentTable={teachersBySubject?.map((each) => {
          const isSelected = teachersSelectedInModal?.includes(each);
          return (
            <tr
              key={each.id}
              onClick={() => handleClickTeacherRow(each)}
              className={`${isSelected ? "table-primary" : ""}`}
            >
              <td>
                {each.teacher_name} {each.teacher_last_name}
              </td>
              <td>{each.group_number}</td>
            </tr>
          );
        })}
      />
      {/* Modal for classrooms */}

      <ModalTable
        title={"Aulas disponibles"}
        showState={{
          show: showClassroomssModal,
          setShow: setShowClassroomsModal,
        }}
        headers={
          <>
            <th>Nombre</th>
            <th>Capacidad</th>
          </>
        }
        contentTable={classroomsByBlock.map((each) => {
          console.log("modal", each);
          const isSelected = classroomsSelectedInModal.includes(each);
          return (
            <tr
              key={each.classroom_id}
              onClick={() => handleClickClassroomRow(each)}
              className={`${isSelected ? "table-primary" : ""}`}
            >
              <td>{each.classroom_name}</td>
              <td>{each.capacity}</td>
            </tr>
          );
        })}
      />
    </div>
  );
}
