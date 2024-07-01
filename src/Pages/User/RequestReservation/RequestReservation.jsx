import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { getSubjects } from "../../../services/subjects";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { getRequestsReasons, sendRequest } from "../../../services/requests";
import { getTimeSlots } from "../../../services/timeSlots";
import { getBlocks } from "../../../services/blocks";
import { getTeachersBySubject } from "../../../services/teachers";
import {
  getDisponibleClassrooms,
  getSuggestsClassrooms,
} from "../../../services/classrooms";
import { Spinner } from "react-bootstrap";
import "./RequestReservation.css";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import Select from "react-select";

export default function RequestReservation() {
  const user = JSON.parse(localStorage.getItem("userInformation"));
  const [loadingPage, setLoadingPage] = useState(true);
  const [groupSelected, setGroupSelected] = useState([]);
  const [optionsGroups, setOptionsGroups] = useState([]);
  const [subjects, setSubjects] = useState(null);
  const [subjectSelected, setSubjectSelected] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityWarnings, setQuantityWarnings] = useState({});
  const [classroomsWarnings, setClassroomsWarnings] = useState({});
  const [dateValue, setDateValue] = useState("");
  const [reasons, setReasons] = useState([]);
  const [reasonSelected, setReasonSelected] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTimeSlots, setStartTimeSlots] = useState([]);
  const [endTimeSlots, setEndTimeSlots] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [blockSelected, setBlockSelected] = useState("");
  const [colaborators, setColaborators] = useState([]);
  const [listColabs, setListColabs] = useState([]);
  const [classByBlockList, setClassByBlockList] = useState([]);
  const [classroomsByBlock, setClassroomsByBlock] = useState([]);
  const [classroomsOptions, setClassroomsOptions] = useState([]);
  const [classroomsSelected, setClassroomsSelected] = useState([]);
  const [suggAvailable, setSuggAvailable] = useState(false);
  const [suggMessage, setSuggMessage] = useState({
    message: "",
    invalid: false,
  });
  const errorsInitialState = {
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
    groups: {
      message: null,
      isInvalid: false,
    },
  };
  const [errorsMessages, setErrorsMessages] = useState(errorsInitialState);

  const [modalSendRequest, setModalSendRequest] = useState({
    show: false,
    content: {
      title: "",
      body: "",
    },
  });
  const [loadingSendRequest, setLoadingSendRequest] = useState(false);

  useEffect(() => {
    setDateValue(getCurrentDate());
    Promise.all([
      fetchSubjects(),
      fetchReasons(),
      fetchTimeSlots(),
      fetchBlocks(),
    ])
      .finally(() => setLoadingPage(false))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!!quantity.trim() && classroomsSelected.length > 0) {
      if (isQuantityLessThan50PercentClassrooms()) {
        parseInt(quantity) > 24 &&
          setQuantityWarnings({
            message:
              "ADVERTENCIA: La capacidad de las aulas es demasiado alta para la cantidad de estudiantes solicitada.",
            show: true,
          });
      } else if (isQuantityMoreThan50PercentClassrooms()) {
        parseInt(quantity) > 24 &&
          setQuantityWarnings({
            message:
              "ADVERTENCIA: La capacidad de las aulas es demasiado baja para la cantidad de estudiantes solicitada.",
            show: true,
          });
      } else {
        setQuantityWarnings({
          message: "",
          show: false,
        });
      }
    } else {
      setQuantityWarnings({
        message: "",
        show: false,
      });
    }
  }, [quantity, classroomsSelected]);

  useEffect(() => {
    if (
      !!quantity.trim() &&
      quantity > 25 &&
      !!blockSelected.trim() &&
      startTime &&
      !!(endTime + "").trim()
    ) {
      fetchClassroomsByBlock();
    }
  }, [blockSelected, startTime, endTime, dateValue]);

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
    let startSlots = [...tmsl];
    startSlots.pop();
    setStartTimeSlots(startSlots);
  };

  const fetchBlocks = async () => {
    const { status, data } = await getBlocks();
    let blocksWithClassrooms = data.filter(
      ({ block_classrooms }) => block_classrooms.length > 0
    );
    if (status >= 200 && status < 300) {
      setBlocks(blocksWithClassrooms);
    } else if (
      (status >= 300 && status < 400) ||
      (status >= 400 && status < 500)
    ) {
      console.log(data.message);
      setBlocks([]);
    }
  };

  const fetchTeachersBySubject = async (subject_id) => {
    const tbs = await getTeachersBySubject(subject_id);
    let colabs = tbs.filter(({ person_id }) => person_id !== user.person_id);
    let userGroups = tbs.filter(
      ({ person_id }) => person_id === user.person_id
    );
    let listColaborators = colabs.map((person) => {
      return {
        value: person,
        label:
          person.teacher_name +
          " " +
          person.teacher_last_name +
          "- GRUPO: " +
          person.group_number,
      };
    });
    let groupsOptions = userGroups.map(
      ({ group_number, teacher_subject_id }) => {
        return { label: group_number, value: teacher_subject_id };
      }
    );
    setErrorsMessages({
      ...errorsMessages,
      groups: { isInvalid: false, message: "" },
    });
    setColaborators([]);
    setOptionsGroups(groupsOptions);
    setGroupSelected([groupsOptions[0]]);
    // setSubjectsGroups(userGroups);
    setListColabs(listColaborators);
    setErrorsMessages({
      ...errorsMessages,
      subject: { isInvalid: false, message: "" },
      groups: { isInvalid: false, message: "" },
    });
  };

  const fetchClassroomsByBlock = async () => {
    let requestData = {
      block_id: blockSelected,
      time_slot_id: [startTime, endTime],
      quantity: quantity,
      date: dateValue,
    };
    const { status, data } = await getDisponibleClassrooms(requestData);
    if (status >= 200 && status < 300) {
      let classrooms = data.map((classroom) => {
        return {
          value: classroom,
          label:
            classroom.classroom_name + "- CAPACIDAD: " + classroom.capacity,
        };
      });
      setClassroomsSelected([]);
      setClassByBlockList(data);
      setClassroomsOptions(classrooms);
    } else if (
      (status >= 300 && status < 400) ||
      (status >= 400 && status < 500)
    ) {
      setClassroomsSelected([]);
      setClassByBlockList([]);
      setClassroomsOptions([]);
    } else {
      console.error(data.message);
      setClassroomsSelected([]);
      setClassByBlockList([]);
      setClassroomsOptions([]);
    }
  };

  const handleChangeSubjects = (value) => {
    setSubjectSelected(value);
    fetchTeachersBySubject(value);
  };

  const handleChangeGroups = (event) => {
    setGroupSelected(event);
    let errorsMessage = { ...errorsMessages };

    if (event.length === 0) {
      errorsMessage.groups = {
        isInvalid: true,
        message: "Seleccione una opción.",
      };
    } else {
      errorsMessage.groups = {
        isInvalid: false,
        message: "",
      };
    }
    setErrorsMessages(errorsMessage);
  };

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }

    let newErrorsMessages = { ...errorsMessages };
    if (!!value.trim()) {
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
      setBlockSelected("");
    }
  };
  const isQuantityLessThan50PercentClassrooms = () => {
    let quantityParsed = parseInt(quantity);
    let totalClassroomsCapacity = 0;
    let totalCapacity = () => {
      let total = 0;
      classroomsByBlock.forEach((each) => (total += each.capacity));
      return total;
    };
    totalClassroomsCapacity = totalCapacity();
    return quantityParsed < totalClassroomsCapacity * 0.5;
  };

  const isQuantityMoreThan50PercentClassrooms = () => {
    let quantityParsed = parseInt(quantity);
    let totalClassroomsCapacity = 0;
    let totalCapacity = () => {
      let total = 0;
      classroomsByBlock.forEach((each) => (total += each.capacity));
      return total;
    };
    totalClassroomsCapacity = totalCapacity();
    return (
      quantityParsed > totalClassroomsCapacity + totalClassroomsCapacity * 0.5
    );
  };

  const handleDateChange = (e) => {
    const newValue = e.target.value;
    if (newValue) {
      setDateValue(newValue);
    }
  };

  const handleChangeReason = ({ value }) => {
    setReasonSelected(value);
    let newErrorsMessages = { ...errorsMessages };
    if (value === "") {
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
    let newErrorsMessages = { ...errorsMessages };
    setSuggMessage({
      message: "",
      invalid: false,
    });
    if (value === "") {
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

  const handleChangeColaborators = (event) => {
    setColaborators(event);
  };

  const handleChangeClassrooms = (event) => {
    setClassroomsSelected(event);
    let classroomsById = findClassroomsById(event);
    setClassroomsByBlock(classroomsById);
    let classroomsRequested = classroomsById.filter(
      (classroom) => classroom.requested === 1
    );
    if (classroomsRequested.length > 0) {
      setClassroomsWarnings({
        show: true,
        classrooms: classroomsRequested.map((classroom) => classroom),
      });
    } else {
      setClassroomsWarnings({ show: false, classrooms: [] });
    }
  };

  const findClassroomsById = (classroomsList) => {
    let result = classByBlockList.filter((classroom) => {
      return classroomsList.find(
        ({ value }) => value.classroom_id === classroom.classroom_id
      );
    });
    return result ?? [];
  };

  const getSuggest = async () => {
    let dataSugg = {
      block_id: blockSelected,
      time_slot_id: [startTime, endTime],
      quantity: quantity,
      date: dateValue,
    };
    const suggests = await getSuggestsClassrooms(dataSugg);
    if (suggests.status >= 200 && suggests.status < 300) {
      const suggList = () => {
        let array = [];
        try {
          suggests.data.map((each) => {
            classByBlockList.forEach((cls) => {
              if (cls.classroom_id === each.classroom_id) {
                array = [...array, cls];
              }
            });
          });
        } catch (error) {
          setSuggMessage({
            message: "No se pudo generar la sugerencia.",
            invalid: true,
          });
        }
        let response = array.map((classroom) => {
          return {
            value: classroom,
            label:
              classroom.classroom_name + " - CAPACIDAD: " + classroom.capacity,
          };
        });
        return response;
      };
      setErrorsMessages({
        ...errorsMessages,
        classrooms: { message: "", isInvalid: false },
      });
      handleChangeClassrooms(suggList());
      setSuggMessage({ message: "", invalid: false });
    } else if (suggests.status >= 400 && suggests.status < 500) {
      setSuggMessage({ message: suggests.data.message, invalid: true });
    } else if (suggests.status === 404) {
      setSuggMessage({ message: suggests.data.message, invalid: true });
    } else if (suggests.status >= 500) {
      setSuggMessage({
        message: "Error, vuelva a intentarlo mas tarde.",
        invalid: true,
      });
    }
  };

  const handleSendRequest = async () => {
    setLoadingSendRequest(true);
    let colabs = colaborators.map((each) => each.value);
    let groupNumbers = colabs.map(
      ({ teacher_subject_id }) => teacher_subject_id
    );
    groupSelected.map((group) => groupNumbers.push(group.value));
    let classrooms = [...classroomsSelected];
    let classroomIds = classrooms.map(({ value }) => value.classroom_id);
    let request = {
      subject_id: subjectSelected,
      group_id: groupNumbers,
      block_id: blockSelected,
      classroom_id: classroomIds,
      time_slot_id: [parseInt(startTime), parseInt(endTime)],
      quantity: quantity,
      date: dateValue,
      reason_id: reasonSelected,
    };

    let response = await sendRequest(request).finally(() =>
      setLoadingSendRequest(false)
    );
    if (response.status >= 200 && response.status < 300) {
      if (response.status === 201) {
        setModalSendRequest({
          content: {
            title: "Solicitud de reserva rechazada",
            body: response.data.message,
          },
          show: true,
        });
      } else if (response.status === 202) {
        setModalSendRequest({
          content: {
            title: "Solicitud de reserva aceptada",
            body: response.data.message,
          },
          show: true,
        });
      } else if (response.status === 200) {
        setModalSendRequest({
          content: {
            title: "Solicitud de reserva pendiente",
            body: response.data.message,
          },
          show: true,
        });
      }
      setToInitalStateForm();
    } else if (
      (response.status >= 300 && response.status < 400) ||
      (response.status >= 400 && response.status < 500)
    ) {
      setModalSendRequest({
        content: { title: "Error", body: response.data.message },
        show: true,
      });
    } else if (response.status === 500) {
      setModalSendRequest({
        content: {
          title: "Error",
          body: "Ocurrio un problema al realizar el envio de la solicitud, intentelo nuevamente.",
        },
        show: true,
      });
    } else {
      setModalSendRequest({
        content: {
          title: "Error",
          body: "Ocurrio un error inesperado, intentelo nuevamente dentro de unos minutos.",
        },
        show: true,
      });
    }
  };

  const validatedFields = () => {
    let newErrorsMessages = { ...errorsMessages };
    let isValid = true;

    if (!subjectSelected.trim()) {
      newErrorsMessages.subject = {
        message: "Seleccione una de las materias.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (groupSelected.length === 0) {
      newErrorsMessages.groups = {
        message: "Seleccione almenos un grupo de la materia a la solicitud.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (!quantity.trim()) {
      newErrorsMessages.quantity = {
        message: "Ingrese la cantidad de estudiantes.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (!dateValue.trim()) {
      newErrorsMessages.date = {
        message: "Seleccione una fecha para la reserva.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (!reasonSelected.trim()) {
      newErrorsMessages.reason = {
        message: "Seleccione el motivo de la reserva.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (!startTime.trim()) {
      newErrorsMessages.periods.startTime = {
        message: "Seleccione los periodos para la reserva.",
        isInvalid: true,
      };
      isValid = false;
    }

    if (!blockSelected.trim()) {
      newErrorsMessages.block = {
        message: "Seleccione un bloque.",
        isInvalid: true,
      };
      isValid = false;
    }

    setErrorsMessages(newErrorsMessages);
    const isAnyErrorPresent = () => {
      Object.values(errorsMessages).forEach((each) => {
        if (each.isInvalid === true) {
          isValid = false;
        }
      });
    };
    isAnyErrorPresent();
    return isValid;
  };

  const setToInitalStateForm = () => {
    setSubjectSelected("");
    setQuantity("");
    setDateValue(getCurrentDate());
    setReasonSelected("");
    setStartTime("");
    setEndTime("");
    setEndTimeSlots([]);
    setBlockSelected("");
    setClassroomsSelected([]);
    setColaborators([]);
    setClassroomsSelected([]);
    setClassroomsOptions([]);
    setSuggAvailable(false);
    setErrorsMessages(errorsInitialState);
  };

  const handleChangeStartTime = ({ value }) => {
    setStartTime(value);
    const index = timeSlots.findIndex((slot) => slot.time_slot_id == value);
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
    setErrorsMessages({
      ...errorsMessages,
      periods: {
        startTime: { message: "", isInvalid: false },
        endTime: { message: "", isInvalid: false },
      },
    });
  };

  return (
    <>
      {loadingPage ? (
        <LoadingSpinner />
      ) : (
        <div className="container p-3">
          <h1 className="text-center py-2">Reservar ambiente</h1>
          <Form>
            <div className="row">
              <div className="col-md-8 d-flex align-items-center">
                <div className="d-flex flex-fill">
                  <div className="py-2 pe-2">
                    <label htmlFor="subjects">
                      <b>MATERIA</b>
                    </label>
                  </div>
                  <div className="py-2 flex-fill">
                    <Form.Select
                      id="subjects"
                      isInvalid={errorsMessages.subject.isInvalid}
                      value={subjectSelected}
                      onChange={(e) =>
                        handleChangeSubjects(e.currentTarget.value)
                      }
                    >
                      <option value="" disabled={subjectSelected !== ""}>
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
              </div>
              {subjectSelected && (
                <>
                  <div className="col-md-4">
                    <div className="d-flex ">
                      <div className="p-3">
                        <label htmlFor="group">
                          <b>GRUPO</b>
                        </label>
                      </div>
                      <div className="flex-fill py-2">
                        <Select
                          isMulti
                          options={optionsGroups}
                          onChange={handleChangeGroups}
                          value={groupSelected}
                          placeholder="Seleccione un grupo"
                          noOptionsMessage={() =>
                            "Todas las opciones fueron seleccionadas"
                          }
                          closeMenuOnSelect={false}
                          className={`${
                            errorsMessages.groups.isInvalid &&
                            "border border-danger"
                          }`}
                        />

                        {errorsMessages.groups.isInvalid && (
                          <div className="d-block invalid-feedback">
                            {errorsMessages.groups.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {subjectSelected && listColabs.length > 0 && (
              <>
                <div className="d-flex flex-column">
                  <b className="pe-3">COLABORADORES</b>
                  <div className="flex-fill">
                    <Select
                      isMulti
                      options={listColabs}
                      onChange={handleChangeColaborators}
                      value={colaborators}
                      noOptionsMessage={() =>
                        "Todas las opciones fueron seleccionadas"
                      }
                      placeholder="Agregar colaboradores a la solicitud"
                      closeMenuOnSelect={false}
                    />
                    <div className="pt-1">
                      <i className="text-success">*Campo opcional</i>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="row pt-2">
              <div className="col-lg-5">
                <div className="d-flex py-2">
                  <div className="pe-3">
                    <label className="d-flex align-self-center">
                      <b>MOTIVO DE RESERVA</b>
                    </label>
                  </div>
                  <div className="flex-fill">
                    <Form.Select
                      value={reasonSelected}
                      onChange={(e) => handleChangeReason(e.target)}
                      isInvalid={errorsMessages.reason.isInvalid}
                    >
                      <option value="" disabled={reasonSelected !== ""}>
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
                </div>
              </div>

              <div className="col-lg-4">
                <div className="d-flex">
                  <b>CANTIDAD DE ESTUDIANTES</b>
                  <div className="flex-fill">
                    <Form.Control
                      type="text"
                      className="form-control"
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
                </div>

                {quantityWarnings.show && (
                  <Alert variant={"warning"} className="text-center">
                    {quantityWarnings.message}
                  </Alert>
                )}
              </div>
              <div className="col-lg-3">
                <div className="d-flex align-items-center">
                  <b className=" pe-2">FECHA</b>
                  <Form.Control
                    type="date"
                    className="form-control"
                    value={dateValue}
                    onChange={handleDateChange}
                    min={getCurrentDate()}
                    max="2024-07-06"
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errorsMessages.date.message}
                </Form.Control.Feedback>
              </div>
            </div>

            <div className="tag-container position-relative my-2 ps-1 pe-1">
              <label className="tag-label">PERIODOS</label>
              <div className="row p-3">
                <div className="col-sm-2">
                  <b className="p-1">HORA INICIO</b>
                </div>
                <div className="col-sm-4">
                  <Form.Select
                    className="form-select"
                    value={startTime}
                    onChange={(e) => handleChangeStartTime(e.target)}
                    isInvalid={errorsMessages.periods.startTime.isInvalid}
                  >
                    <option value="" disabled={startTime !== ""}>
                      Seleccione una opcion
                    </option>
                    {startTimeSlots.map((each) => {
                      return (
                        <option
                          key={each.time_slot_id}
                          value={each.time_slot_id}
                        >
                          {each.time}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errorsMessages.periods.startTime.message}
                  </Form.Control.Feedback>
                </div>

                <div className="col-sm-2">
                  <b className="p-1">HORA FIN</b>
                </div>
                <div className="col-sm-4">
                  <Form.Select
                    className="col-sm form-select"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={endTimeSlots.length === 0}
                  >
                    {endTimeSlots.map((each) => {
                      return (
                        <option
                          key={each.time_slot_id}
                          value={each.time_slot_id}
                        >
                          {each.time}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="pe-2">
                <b>BLOQUE: </b>
              </div>
              <div className="flex-fill">
                <Form.Select
                  className="form-select"
                  value={blockSelected}
                  onChange={(e) => handleChangeBlocks(e.target)}
                  isInvalid={errorsMessages.block.isInvalid}
                  disabled={
                    !quantity.trim() ||
                    !startTime.trim() ||
                    !subjectSelected.trim()
                  }
                >
                  <option value="" disabled={blockSelected !== ""}>
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

            {blockSelected && classroomsOptions.length > 0 && (
              <>
                <div className="row">
                  <div className="col-md-9">
                    <div className="d-flex pt-3">
                      <b className="pe-3">AULAS</b>
                      <div className="w-100">
                        <div>
                          <Select
                            isMulti
                            options={classroomsOptions}
                            onChange={handleChangeClassrooms}
                            value={classroomsSelected}
                            noOptionsMessage={() =>
                              "Todas las opciones fueron seleccionadas"
                            }
                            placeholder="Seleccionar aulas para la solicitud."
                            closeMenuOnSelect={false}
                          />
                        </div>
                        <div className="">
                          <i className="text-success">*Campo opcional</i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 align-self-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="custom-btn-gray custom-btn-gray-outline w-100"
                      disabled={!suggAvailable}
                      onClick={getSuggest}
                    >
                      Generar sugerencia de aulas
                    </Button>
                  </div>
                </div>
                {suggMessage.invalid && (
                  <Alert variant={"warning"}>{suggMessage.message}</Alert>
                )}
                {classroomsWarnings.show && classroomsSelected.length > 0 && (
                  <Alert
                    variant={"warning"}
                  >{`Las siguientes aulas seleccionadas se encuentran solicitadas ${classroomsWarnings.classrooms.map(
                    (classroom) => " " + classroom.classroom_name
                  )}, si se envia la solicitud con estos ambientes, la solicitud podria podria ser rechazada automaticamente al enviarse o luego de atenderse alguna solicitud que solicite alguno de los ambientes seleccionados.`}</Alert>
                )}
              </>
            )}
            <div className="d-flex justify-content-end pt-3">
              <Button
                variant="success"
                type="submit"
                className="custom-btn-green custom-btn-green-outline"
                onClick={(e) => {
                  e.preventDefault();
                  validatedFields() &&
                    setModalSendRequest({
                      show: true,
                      content: {
                        title: "¡Confirmación!",
                        body: "¿Esta seguro de enviar su solicitud de reserva?",
                      },
                    });
                }}
              >
                Reservar ambiente
              </Button>
            </div>
          </Form>

          <Modal
            show={modalSendRequest.show}
            onHide={() =>
              loadingSendRequest
                ? setModalSendRequest({ ...modalSendRequest, show: true })
                : setModalSendRequest({ ...modalSendRequest, show: false })
            }
            centered
            backdrop="static"
          >
            <Modal.Header className="p-3">
              <Modal.Title>{modalSendRequest.content.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>{modalSendRequest.content.body}</div>
              {modalSendRequest.content.title === "¡Confirmación!" && (
                <>
                  {(quantityWarnings.show || classroomsWarnings.show) && (
                    <>
                      <div className="p-1">
                        <span>Tiene las siguientes advertencias:</span>
                      </div>
                      {quantityWarnings.show && (
                        <Alert variant={"warning"} className="">
                          {quantityWarnings.message}
                        </Alert>
                      )}
                      {classroomsWarnings.show &&
                        classroomsSelected.length > 0 && (
                          <Alert
                            variant={"warning"}
                          >{`Las siguientes aulas seleccionadas se encuentran solicitadas ${classroomsWarnings.classrooms.map(
                            (classroom) => " " + classroom.classroom_name
                          )}, si se envia la solicitud con estos ambientes, la solicitud podria podria ser rechazada automaticamente al enviarse o luego de atenderse alguna solicitud que solicite alguno de los ambientes seleccionados.`}</Alert>
                        )}
                      <div className="pb-2 pt-1">
                        <span>¿Está seguro de enviar la solicitud?</span>
                      </div>
                      <div className="pt-4">
                        <i>
                          <b>Nota:</b> Las advertencias no impiden enviar la
                          solicitud de reserva, pero estas deberan ser revisadas
                          por un supervisor.
                        </i>
                      </div>
                    </>
                  )}
                </>
              )}
            </Modal.Body>
            {modalSendRequest.content.title === "¡Confirmación!" && (
              <Modal.Footer>
                {loadingSendRequest && (
                  <Spinner animation="border" variant="secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                <Button
                  variant="success"
                  className="custom-btn-green custom-btn-green-outline"
                  onClick={handleSendRequest}
                  disabled={loadingSendRequest}
                >
                  Enviar
                </Button>
                <Button
                  variant="secondary"
                  className="custom-btn-gray custom-btn-gray-outline"
                  onClick={() =>
                    setModalSendRequest({ ...modalSendRequest, show: false })
                  }
                  disabled={loadingSendRequest}
                >
                  Cancelar
                </Button>
              </Modal.Footer>
            )}

            {(modalSendRequest.content.title ===
              "Solicitud de reserva pendiente" ||
              modalSendRequest.content.title ===
                "Solicitud de reserva aceptada") && (
              <Modal.Footer>
                {loadingSendRequest && (
                  <Spinner animation="border" variant="secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
                <Button
                  variant="primary"
                  className="custom-btn-primary custom-btn-primary-outline"
                  onClick={() => {
                    setModalSendRequest({
                      ...modalSendRequest,
                      show: false,
                    });
                  }}
                >
                  Aceptar
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </div>
      )}
    </>
  );
}
