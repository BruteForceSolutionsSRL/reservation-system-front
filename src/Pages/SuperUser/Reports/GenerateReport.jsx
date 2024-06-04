import { useState } from "react";
import { Form } from "react-bootstrap";
import { getSubjects } from "../../../services/subjects";
import { getReservationStatuses } from "../../../services/statuses";
import { getBlocks } from "../../../services/blocks";
import { useEffect } from "react";
import { getClassroomsByBlock } from "../../../services/classrooms";

export default function GenerateReport() {
  // for blocks
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(undefined);
  const [blocksInitialOptionDisabled, setBlocksInitialOptionDisabled] = useState(false);
  // for classrooms
  const [classroomsByBlock, setClassroomsByBlock] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(undefined);
  // for request's type (reservation statuses)
  const [reservationStatuses, setReservationStatuses] = useState([]);
  // for subject
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(undefined);
  // for teacher
  const [teachersBySubject, setTeachersBySubject] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchBlocks(),
      fetchReservationStatuses(),
      fetchSubjects(),
    ]).catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetchClassroomsByBlock();
  }, [selectedBlock]);

  const fetchBlocks = async () => {
    const blocks = await getBlocks();
    setBlocks(blocks);
  }

  const fetchReservationStatuses = async () => {
    const reservationStatuses = await getReservationStatuses();
    setReservationStatuses(reservationStatuses);
  }

  const fetchSubjects = async () => {
    const subjects = await getSubjects();
    setSubjects(subjects);
  }

  const fetchClassroomsByBlock = async () => {
    if (selectedBlock !== undefined) {
      const classrooms = await getClassroomsByBlock(selectedBlock);
      setClassroomsByBlock(classrooms);
    }
  }

  const handleChangeBlocks = (value) => {
    setBlocksInitialOptionDisabled(true);
    setSelectedBlock(value);
  }

  return (
    <div className="container">
      <h1 className="text-center pb-2">Reportes</h1>
      <Form>
        <div className="row d-flex align-items-center">
          <div className="col-sm">
            <label>Fechas</label>
          <Form.Control
              type="date"
              className="form-control"
            />
          </div>
          <div className="col-sm">
            <label>&nbsp;</label>
            <Form.Control
              type="date"
              className="form-control"
            />
          </div>
          <div className="col-md">
            <label htmlFor="block">Bloque</label>
            <Form.Select
              name="block"
              value={selectedBlock}
              onChange={(e) => handleChangeBlocks(e.currentTarget.value)}
            >
              <option value="" disabled={blocksInitialOptionDisabled}>
                Seleccione una opción
              </option>
              {blocks.map((block) => {
                return (
                  <option key={block.block_id} value={block.block_id}>
                    {block.block_name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div className="col-md">
            <label htmlFor="classroom">Aula</label>
            <Form.Select
              name="classroom"
              value={selectedClassroom}
            >
              <option value="">
                Seleccione una opción
              </option>
              {classroomsByBlock?.map((classroom) => {
                return (
                  <option
                    key={classroom.classroom_id}
                    value={classroom.classroom_id}
                  >
                    {classroom.classroom_name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div className="col-sm-2 d-flex justify-content-end align-items-end">
            <button
              type="button"
              className="btn"
            >
              <span>Vaciar </span>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-md-3">
            <label htmlFor="request-type">Tipo de solicitud</label>
            <Form.Select
              name="request-type"
            >
              {reservationStatuses.map((reservationStatus) => {
                return (
                  <option
                    key={reservationStatus.reservation_status_id}
                    value={reservationStatus.reservation_status_id}
                  >
                    {reservationStatus.reservation_status_name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div className="col-md-3">
            <label htmlFor="subject">Materia</label>
            <Form.Select
              name="subject"
            >
              {subjects.map((subject) => {
                return (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    nil
                  </option>
                );
              })}
            </Form.Select>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-md-3">
            <label htmlFor="teacher">Docente</label>
            <Form.Select
              name="teacher"
            >
            </Form.Select>
          </div>
        </div>
        <div className="row pt-3 justify-content-between align-items-center">
          <div className="col-sm">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Generar Reporte
            </button>
          </div>
          <div className="col-sm d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-md"
            >
              <i className="bi bi-envelope fs-3"></i>
            </button>
            <button
              type="button"
              className="btn btn-md"
            >
              <i className="bi bi-printer fs-3"></i>
            </button>
            <button
              type="button"
              className="btn btn-md"
            >
              <i className="bi bi-download fs-3"></i>
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

