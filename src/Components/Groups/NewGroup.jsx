import { useState, useEffect } from "react";
import { Alert, Modal } from "react-bootstrap";
import { useTimeSlotsService } from "../Hooks/useTimeSlotsService";
import { useFetchService } from "../Hooks/useFetchService";
import ClassSelection from "./ClassSelection";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Select from "react-select";

export default function NewGroup({ show, setShow }) {
  const { getTimeSlots } = useTimeSlotsService();
  const { getFetch, postFetch } = useFetchService();
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [studyPlanOptions, setStudyPlanOptions] = useState([]);

  const [subjectSelected, setSubjectSelected] = useState("");
  const [teacherSelected, setTeacherSelected] = useState("");
  const [academicPeriodSelected, setAcademicPeriodSelected] = useState("");
  const [studyPlanSelected, setStudyPlanSelected] = useState([]);
  const [groupNumber, setGroupNumber] = useState("");

  const [message, setMessage] = useState({});

  const initialScheduleState = {
    lunes: {
      id: 0,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
    martes: {
      id: 1,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
    miercoles: {
      id: 2,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
    jueves: {
      id: 3,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
    viernes: {
      id: 4,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
    sabado: {
      id: 5,
      body: {
        checked: false,
        block: -1,
        period1: -1,
        period2: -1,
        classroom: -1,
      },
    },
  };
  const [schedule, setSchedule] = useState(initialScheduleState);

  useEffect(() => {
    Promise.all([
      fetchTimeSlots(),
      fetchBlocks(),
      fetchSubjects(),
      fetchTeachers(),
      fetchAcademicPeriods(),
      fetchStudyPlans(),
    ]).finally(() => setLoading(false));
  }, []);

  const changeSchedule = (id, change) => {
    const updatedSchedule = {
      ...schedule,
      [id]: {
        ...schedule[id],
        body: change,
      },
    };
    setSchedule(updatedSchedule);
  };

  const handleClose = () => {
    setMessage({});
    setShow(false);
  };

  const formatOptionsStudyPlans = (list) => {
    let formated = list.map((sp) => {
      return { value: sp.study_plan_id, label: sp.name };
    });
    return formated;
  };

  const fetchTimeSlots = async () => {
    const newAbortController = new AbortController();
    const { status, data } = await getTimeSlots(newAbortController);
    if (status >= 200 && status < 300) {
      setPeriods(data);
    } else {
      setPeriods([]);
    }
  };

  const fetchBlocks = async () => {
    const { status, data } = await getFetch("blocks");
    if (status >= 200 && status < 300) {
      setBlocks(data);
    } else {
      setBlocks([]);
    }
  };

  const fetchSubjects = async () => {
    const { status, data } = await getFetch("teacher-subjects");
    if (status >= 200 && status < 300) {
      const subjList = [];
      const seenSubjects = new Set();
      data.forEach((item) => {
        if (!seenSubjects.has(item.subject_id)) {
          seenSubjects.add(item.subject_id);
          subjList.push(item);
        }
      });
      setSubjects(subjList);
    } else {
      setSubjects([]);
    }
  };

  const fetchTeachers = async () => {
    const { status, data } = await getFetch("users/teachers");
    if (status >= 200 && status < 300) {
      setTeachers(data);
    } else {
      setTeachers([]);
    }
  };
  const fetchAcademicPeriods = async () => {
    const { status, data } = await getFetch("academic-periods");
    if (status >= 200 && status < 300) {
      setAcademicPeriods(data);
      setAcademicPeriodSelected(data[0].academic_period_id);
    } else {
      setAcademicPeriods([]);
    }
  };
  const fetchStudyPlans = async () => {
    const { status, data } = await getFetch("study-plans");
    if (status >= 200 && status < 300) {
      const options = formatOptionsStudyPlans(data);
      setStudyPlanOptions(options);
      // setStudyPlans(data);
    } else {
      setStudyPlans([]);
    }
  };

  const createGroup = async () => {
    const classSchedule = [];
    Object.keys(schedule).forEach((day) => {
      const dayData = schedule[day];
      if (dayData.body.checked === true) {
        const classData = {
          day: dayData.id,
          time_slot_ids: [dayData.body.period1, dayData.body.period2],
          classroom_id: dayData.body.classroom,
        };
        classSchedule.push(classData);
      }
    });
    const studyPlansIds = studyPlanSelected.map((st) => st.value);
    const newGroup = {
      university_subject_id: subjectSelected,
      person_id: teacherSelected,
      academic_period_id: academicPeriodSelected,
      study_plan_ids: studyPlansIds,
      group_number: groupNumber,
      class_schedules: classSchedule,
    };
    const { status, data } = await postFetch(
      "teacher-subjects/store/group",
      newGroup
    );
    if (status >= 200 && status < 300) {
      setMessage({ type: "success", message: data.message });
    } else {
      setMessage({
        type: "danger",
        message: data.message ?? "Intentelo nuevamente mas tarde.",
      });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear nuevo grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="p-2">
              <div className="d-flex my-2">
                <b>MATERIA: </b>
                <select
                  className="form-select ms-2"
                  value={subjectSelected}
                  onChange={(e) => setSubjectSelected(e.target.value)}
                >
                  {subjects.map((s) => {
                    return (
                      <option value={s.subject_id} key={s.subject_id}>
                        {s.subject_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex my-2">
                <b>DOCENTE: </b>
                <select
                  className="form-select ms-2"
                  value={teacherSelected}
                  onChange={(e) => setTeacherSelected(e.target.value)}
                >
                  {teachers.map((t) => {
                    return (
                      <option value={t.person_id} key={t.person_id}>
                        {t.fullname}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex my-2">
                <b># DE GRUPO: </b>
                <input
                  type="text"
                  className="form-control ms-2"
                  value={groupNumber}
                  onChange={(e) => {
                    const { value } = e.target;
                    const filteredValue = value.replace(/[^0-9]/g, "");
                    setGroupNumber(filteredValue);
                  }}
                />
              </div>
              <div className="d-flex my-2">
                <b>GESTIÓN: </b>
                <select
                  className="form-select ms-2"
                  value={academicPeriodSelected}
                  onChange={(e) => setAcademicPeriodSelected(e.target.value)}
                >
                  {academicPeriods.map((ap) => {
                    return (
                      <option
                        value={ap.academic_period_id}
                        key={ap.academic_period_id}
                      >
                        {ap.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex my-2">
                <b>CARRERA ASIGNADA: </b>
                <Select
                  className="ms-2"
                  options={studyPlanOptions}
                  isMulti
                  onChange={(e) => setStudyPlanSelected(e)}
                  value={studyPlanSelected}
                  noOptionsMessage={() =>
                    "Todas las opciones fueron seleccionadas"
                  }
                  placeholder="Seleccione la carrera."
                  closeMenuOnSelect={false}
                />
              </div>
              <div className="my-2">
                <b>HORARIO DE CLASES: </b>
                <div className="border rounded p-2">
                  <div className="row">
                    <div className="col-md-2 text-center">
                      <b>Dia</b>
                    </div>
                  </div>
                  <div className="">
                    {Object.keys(schedule).map((key) => {
                      return (
                        <div key={key}>
                          <ClassSelection
                            blocks={blocks}
                            id={key}
                            classroomsFirstBlock={blocks[0]?.classrooms}
                            periods={periods}
                            onChange={changeSchedule}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {message.type && (
                <Alert variant={message.type}>{message.message}</Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!loading && (
            <>
              <button className="btn btn-primary" onClick={createGroup}>
                Crear
              </button>
              <button className="btn btn-secondary" onClick={handleClose}>
                Cerrar
              </button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
