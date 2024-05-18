import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { getSubjects } from "../../../services/subjects";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { getRequestsReasons } from "../../../services/requests";
import { getTimeSlots } from "../../../services/timeSlots";
import { getBlocks } from "../../../services/blocks";
import { getTeachersBySubject } from "../../../services/teachers";
import { getClassroomsByBlock } from "../../../services/classrooms";
import ModalTable from "../../../Components/ModalTable/ModalTable";

export default function RequestReservation() {
  // For subjects
  const [subjects, setSubjects] = useState(null);
  const [subjectSelected, setSubjectSelected] = useState(0);
  const [subjectsInitialOptionDisabled, setSubjectsInitialOptionDisabled] =
    useState(false);
  // For Date
  const [dateValue, setDateValue] = useState("");
  // For reasons
  const [reasons, setReasons] = useState([]);
  // For timeSlots
  const [timeSlots, setTimeSlots] = useState([]);
  // For blocks
  const [blocks, setBlocks] = useState([]);
  const [blockSelected, setBlockSelected] = useState(0);
  const [blocksInitialOptionDisabled, setBlocksInitialOptionDisabled] =
    useState(false);
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

  useEffect(() => {
    setDateValue(getCurrentDate());
    Promise.allSettled([
      fetchSubjects(),
      fetchReasons(),
      fetchTimeSlots(),
      fetchBlocks(),
    ]).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchTeachersBySubject();
  }, [subjectSelected]);

  useEffect(() => {
    fetchClassroomsByBlock();
  }, [blockSelected]);

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
  };

  const fetchBlocks = async () => {
    const blks = await getBlocks();
    setBlocks(blks);
  };

  const fetchTeachersBySubject = async () => {
    const tbs = await getTeachersBySubject(subjectSelected);
    setTeachersSelectedInModal([]);
    // Esto no deberia ser asi, se debe arreglar en backend que devuelva solo una lista, no dos.
    setTeachersBySubject(tbs[0]);
  };

  const fetchClassroomsByBlock = async () => {
    const clsm = await getClassroomsByBlock(blockSelected);
    setClassroomsSelectedInModal([]);
    setClassroomsByBlock(clsm);
  };

  const handleChangeSubjects = (value) => {
    setSubjectsInitialOptionDisabled(true);
    setSubjectSelected(value);
  };

  const handleChangeBlocks = (value) => {
    setBlocksInitialOptionDisabled(true);
    setBlockSelected(value);
  };

  const handleClickTeacherRow = (teacher) => {
    if (teachersSelectedInModal.includes(teacher)) {
      setTeachersSelectedInModal(
        teachersSelectedInModal.filter((tchr) => tchr !== teacher)
      );
    } else {
      setTeachersSelectedInModal([...teachersSelectedInModal, teacher]);
    }
  };

  const handleClickClassroomRow = (classroom) => {
    if (classroomsSelectedInModal.includes(classroom)) {
      setClassroomsSelectedInModal(
        classroomsSelectedInModal.filter((clr) => clr !== classroom)
      );
    } else {
      setClassroomsSelectedInModal([...classroomsSelectedInModal, classroom]);
    }
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
              value={subjectSelected}
              onChange={(e) => handleChangeSubjects(e.currentTarget.value)}
            >
              <option value="" disabled={subjectsInitialOptionDisabled}>
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
          </div>
          {/* Here the message error */}
        </div>
        <div className="row pt-3">
          <div className="col-6">
            <b className="">CANTIDAD DE ESTUDIANTES</b>
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese la cantidad de estudiantes para la solicitud..."
            />
          </div>
          {/* Error message for quantity */}
          <div className="col-6">
            <b className="col-1">FECHA</b>
            <input
              type="date"
              className="col-sm form-control"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
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
            >
              {reasons?.map((each) => {
                return (
                  <option key={each.reason_id} value={each.reason_id}>
                    {each.reason_name}
                  </option>
                );
              })}
            </Form.Select>
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
              <Form.Select name="" id="" className="form-select">
                {timeSlots.map((each) => {
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
              <Form.Select name="" id="" className="col-sm form-select">
                <option value="">alguna hora</option>
                <option value="">alguna hora</option>
                <option value="">alguna hora</option>
                <option value="">alguna hora</option>
              </Form.Select>
            </div>
            {/* Error message for end hour */}
          </div>
        </div>

        <div className="mt-2 ps-1 pe-1 border rounded">
          <b>DOCENTE</b>
          <div className="row p-3">
            {subjectSelected === 0 ? (
              <div className="text-center pb-4">
                <b>Seleccione una materia</b>
              </div>
            ) : (
              <>
                <div className="col-sm-10">
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
              </>
            )}
          </div>
          {/* Here error message */}
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
                onChange={(e) => handleChangeBlocks(e.currentTarget.value)}
              >
                <option value="" disabled={blocksInitialOptionDisabled}>
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
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-sm-2">
              <b>AULA(s)</b>
            </div>
            {blockSelected === 0 ? (
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
                      disabled
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
              </>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end m-5">
          <button type="submit" className="btn btn-outline-success">
            Reservar
          </button>
        </div>
      </Form>
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
        contentTable={teachersBySubject.map((each) => {
          const isSelected = teachersSelectedInModal.includes(each);
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
