import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { getAllSubjects } from "../../../services/subjects";
import { getBlocks } from "../../../services/blocks";
import { getClassroomsByBlock } from "../../../services/classrooms";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import ReportPage from "../../../Components/PDF/ReportPage";
import { getTeachersBySubject } from "../../../services/teachers";
import { generateReport } from "../../../services/reports";
import { getReservationStatuses } from "../../../services/statuses";

export default function GenerateReport() {
  // for Date
  const [startDateValue, setStartDateValue] = useState("2024-02-02");
  const [endDateValue, setEndDateValue] = useState("2024-07-06");
  // for blocks
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  // for classrooms
  const [classroomsByBlock, setClassroomsByBlock] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  // for request's type (reservation statuses)
  const [reservationStatuses, setReservationStatuses] = useState([]);
  /*const reservationStatuses = [ 
    { reservation_status_id: 1, reservation_status_name: "ACEPTADO" },
    { reservation_status_id: 2, reservation_status_name: "RECHAZADO" },
    { reservation_status_id: 4, reservation_status_name: "CANCELADO" },
  ];*/
  const [selectedReservationStatus, setSelectedReservationStatus] =
    useState("");
  // for subject
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  // for teacher
  const [teachersBySubject, setTeachersBySubject] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  // for report
  const [reportData, setReportData] = useState(undefined);
  // for show report
  const [showReport, setShowReport] = useState(false);
  // modal
  const [showModalClearReport, setShowModalClearReport] = useState(false);
  // error
  const [errorDate, setErrorDate] = useState({
    message: null,
    isInvalid: false,
  });

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

  useEffect(() => {
    fetchTeachersBySubject();
  }, [selectedSubject]);

  const fetchBlocks = async () => {
    const response = await getBlocks().catch((err) => {
      setBlocks([]);
    });
    setBlocks(response.data);
  };

  const fetchReservationStatuses = async () => {
    const reservationStatuses = await getReservationStatuses();
    const tmpReservationStatuses = reservationStatuses.filter((rs) => {
      const status = rs.reservation_status_name.toUpperCase();
      return (
        status === "ACEPTADO" ||
        status === "ACCEPTED" ||
        status === "RECHAZADO" ||
        status === "REJECTED" ||
        status === "CANCELADO" ||
        status === "CANCELLED"
      );
    });

    setReservationStatuses(tmpReservationStatuses);
  };

  const fetchSubjects = async () => {
    const subjects = await getAllSubjects();
    setSubjects(subjects);
  };

  const fetchClassroomsByBlock = async () => {
    if (selectedBlock !== "") {
      const classrooms = await getClassroomsByBlock(selectedBlock);
      setClassroomsByBlock(classrooms);
    }
  };

  const fetchTeachersBySubject = async () => {
    if (selectedSubject !== "") {
      const tmpTeachers = await getTeachersBySubject(selectedSubject);
      const teachers = [];
      const ids = [];

      tmpTeachers.forEach((teacher) => {
        if (!ids[teacher.person_id]) {
          teachers.push(teacher);
          ids[teacher.person_id] = true;
        }
      });

      setTeachersBySubject(teachers);
    }
  };

  const fetchReports = async () => {
    const request = {
      date_start: startDateValue,
      date_end: endDateValue,
      block_id: selectedBlock,
      classroom_id: selectedClassroom,
      reservation_status_id: selectedReservationStatus,
      university_subject_id: selectedSubject,
      person_id: selectedTeacher,
    };

    try {
      const reportDataResponse = await generateReport(request);
      const reports = reportDataResponse.report;
      const acceptedRequests = reports.filter(
        (r) =>
          r.reservation_status.toUpperCase() === "ACEPTADO" ||
          r.reservation_status.toUpperCase() === "ACCEPTED"
      );
      const rejectedRequests = reports.filter(
        (r) =>
          r.reservation_status.toUpperCase() === "RECHAZADO" ||
          r.reservation_status.toUpperCase() === "REJECTED"
      );
      const cancelledRequests = reports.filter(
        (r) =>
          r.reservation_status.toUpperCase() === "CANCELADO" ||
          r.reservation_status.toUpperCase() === "CANCELLED"
      );

      const tmpReportData = {
        accepted_reservations: reportDataResponse.accepted_reservations,
        rejected_reservations: reportDataResponse.rejected_reservations,
        cancelled_reservations: reportDataResponse.canceled_reservations,
        total_reservations: reportDataResponse.total_reservations,
        acceptedRequests: acceptedRequests,
        rejectedRequests: rejectedRequests,
        cancelledRequests: cancelledRequests,
      };

      setReportData(tmpReportData);
      setShowReport(true);
    } catch (error) {
      setReportData(undefined);
      setShowReport(false);
    }
  };

  const handleChangeBlocks = (e) => {
    e.preventDefault();
    setSelectedClassroom("");
    setSelectedBlock(e.currentTarget.value);
  };

  const handleStartDateChange = (e) => {
    e.preventDefault();

    const value = e.target.value;

    setErrorDate({
      message: "La fecha de fin debe ser mayor o igual a la fecha inicio",
      isInvalid: value > endDateValue,
    });

    if (value) {
      setStartDateValue(value);
    }
  };

  const handleEndDateChange = (e) => {
    e.preventDefault();

    const value = e.target.value;

    setErrorDate({
      message: "La fecha de fin debe ser mayor o igual a la fecha inicio",
      isInvalid: value < startDateValue,
    });

    if (value) {
      setEndDateValue(value);
    }
  };

  const handleChangeSubjects = (e) => {
    e.preventDefault();
    setSelectedTeacher("");
    setSelectedSubject(e.currentTarget.value);
  };

  const handleChangeClassroom = (e) => {
    e.preventDefault();
    setSelectedClassroom(e.currentTarget.value);
  };

  const handleChangeTeacher = (e) => {
    e.preventDefault();
    setSelectedTeacher(e.currentTarget.value);
  };

  const handleChangeReservationStatus = (e) => {
    e.preventDefault();
    setSelectedReservationStatus(e.currentTarget.value);
  };

  const handleGenerateReport = () => {
    fetchReports();
  };

  const handleCleanButton = () => {
    setStartDateValue("2024-02-02");
    setEndDateValue("2024-07-06");
    setSelectedBlock("");
    setSelectedClassroom("");
    setSelectedReservationStatus("");
    setSelectedSubject("");
    setSelectedTeacher("");
    setReportData(undefined);
    setShowReport(false);
    setShowModalClearReport(false);
  };

  const handlePrint = async () => {
    if (showReport) {
      const blob = await pdf(
        <ReportPage
          startDate={startDateValue}
          endDate={endDateValue}
          reportData={reportData}
        />
      ).toBlob();
      const pdfUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");

      iframe.style.display = "none";
      iframe.src = pdfUrl;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    }
  };

  return (
    <div className="container">
      <h1 className="text-center pb-2">Reportes</h1>
      <Form>
        <div className="row d-flex align-items-center">
          <div className="col-sm">
            <label htmlFor="startDate">Fecha inicio</label>
            <Form.Control
              type="date"
              name="startDate"
              className="form-control"
              value={startDateValue}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="col-sm">
            <label htmlFor="endDate">Fecha fin</label>
            <Form.Control
              type="date"
              name="endDate"
              className="form-control"
              value={endDateValue}
              onChange={handleEndDateChange}
              isInvalid={errorDate.isInvalid}
            />
            <Form.Control.Feedback type="invalid">
              {errorDate.message}
            </Form.Control.Feedback>
          </div>
          <div className="col-md">
            <label htmlFor="block">Bloque</label>
            <Form.Select
              name="block"
              value={selectedBlock}
              onChange={handleChangeBlocks}
            >
              <option value=""></option>
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
              disabled={selectedBlock === ""}
              onChange={handleChangeClassroom}
            >
              <option value=""></option>
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
              onClick={(e) => {
                e.preventDefault();

                if (showReport) {
                  setShowModalClearReport(true);
                }
              }}
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
              value={selectedReservationStatus}
              onChange={handleChangeReservationStatus}
            >
              <option value=""></option>
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
          <div className="col-md-4">
            <label htmlFor="subject">Materia</label>
            <Form.Select
              name="subject"
              value={selectedSubject}
              onChange={handleChangeSubjects}
            >
              <option value=""></option>
              {subjects.map((subject) => {
                return (
                  <option
                    key={subject.university_subject_id}
                    value={subject.university_subject_id}
                  >
                    {subject.university_subject_name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <label htmlFor="teacher">Docente</label>
            <Form.Select
              name="teacher"
              value={selectedTeacher}
              disabled={selectedSubject === ""}
              onChange={handleChangeTeacher}
            >
              <option value=""></option>
              {teachersBySubject?.map((teacher) => {
                return (
                  <option key={teacher.person_id} value={teacher.person_id}>
                    {teacher.teacher_name + " " + teacher.teacher_last_name}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        </div>
        <div className="row pt-3 justify-content-between align-items-center">
          <div className="col-sm">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();

                if (!errorDate.isInvalid) {
                  handleGenerateReport();
                }
              }}
            >
              Generar Reporte
            </button>
          </div>
          <div className="col-sm d-flex justify-content-end">
            <button type="button" className="btn btn-md" onClick={handlePrint}>
              <i className="bi bi-printer fs-3"></i>
            </button>
            {showReport ? (
              <PDFDownloadLink
                document={
                  <ReportPage
                    startDate={startDateValue}
                    endDate={endDateValue}
                    reportData={reportData}
                  />
                }
                fileName="reporte.pdf"
              >
                <button type="button" className="btn btn-md">
                  <i className="bi bi-download fs-3"></i>
                </button>
              </PDFDownloadLink>
            ) : (
              <button type="button" className="btn btn-md">
                <i className="bi bi-download fs-3"></i>
              </button>
            )}
          </div>
        </div>
      </Form>

      <div style={{ borderTop: "1px solid black" }}></div>

      {showReport && (
        <div className="pt-2 row">
          <div className="col-12">
            <PDFViewer
              style={{ width: "100%", height: "90vh" }}
              showToolbar={false}
            >
              <ReportPage
                startDate={startDateValue}
                endDate={endDateValue}
                reportData={reportData}
              />
            </PDFViewer>
          </div>
        </div>
      )}

      <Modal
        show={showModalClearReport}
        onHide={() => setShowModalClearReport(false)}
        centered
      >
        <Modal.Title className="p-3">¡Alerta!</Modal.Title>
        <Modal.Body>
          <div className="p-1">
            <span>Se eliminará el reporte generado</span>
          </div>

          <div className="d-flex justify-content-end p-3">
            <button
              className="m-1 btn btn-outline-danger"
              onClick={handleCleanButton}
            >
              Aceptar
            </button>
            <button
              className="m-1 btn btn-outline-secondary"
              onClick={() => setShowModalClearReport(false)}
            >
              Cancelar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
