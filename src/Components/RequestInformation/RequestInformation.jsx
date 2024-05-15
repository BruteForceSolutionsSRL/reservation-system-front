import { useState } from "react";
import { Table } from "react-bootstrap";
import ModalRequestInformation from "./ModalRequestInformation";
import { getConflicts } from "../../services/conflicts";

export default function RequestInformation({
  content,
  customBottonsForModal,
  showConflicts = false,
}) {
  const {
    id,
    subject,
    groups,
    reservation_date,
    periods,
    quantity_studets,
    block,
    classrooms,
    reason,
    state,
  } = content;

  const [show, setShow] = useState(false);
  const [conflictsModal, setConflictsModal] = useState({
    quantity: "",
    classroom: {
      message: "",
      list: [],
    },
    teacher: {
      message: "",
      list: [],
    },
  });

  const modalStateShow = {
    show: show,
    setShow: (change) => setShow(change),
  };

  const handleClickModal = async () => {
    if (showConflicts) {
      let conflicts = await getConflicts(id);
      setConflictsModal(conflicts);
    }
    setShow(true);
  };

  const modalContent = {
    id: id,
    title: <h3>ATENCION DE LA SOLICITUD</h3>,
    body: (
      <>
        <div className="container-fluid">
          <div className="pb-3">
            <b>MATERIA: </b> {subject}
          </div>

          <div className="pb-3">
            <b>ESTADO: </b>{" "}
            <label
              className={`rounded p-1  bg-${
                state === "ACCEPTED"
                  ? "success text-light"
                  : state === "CANCELLED"
                  ? "secondary text-light"
                  : state === "REJECTED"
                  ? "danger text-light"
                  : "dark text-white"
              }`}
            >
              {state}
            </label>
          </div>

          <div className="tag-container mb-3">
            <label className="tag-label">GRUPO</label>
            {conflictsModal?.teacher.message === "" ? (
              ""
            ) : (
              <div>
                <b className="text-warning">{`${
                  conflictsModal?.teacher.message
                }, ${conflictsModal?.teacher.list.map((teacher) => {
                  return teacher + ", ";
                })}`}</b>
              </div>
            )}
            <div className="table-responsive">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Grupo</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((each) => {
                    return (
                      <tr key={each.group_number}>
                        <td>{each.teacher_name}</td>
                        <td>{each.group_number}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="pb-3">
            <b>FECHA DE RESERVA: </b> {reservation_date}
          </div>
          <div className="pb-3">
            <b>PERIODOS: </b> {periods[0]}-{periods[1]}
          </div>
          {conflictsModal?.quantity === "" ? (
            ""
          ) : (
            <div>
              <b className="text-warning">{conflictsModal?.quantity}</b>
            </div>
          )}
          <div className="pb-3">
            <b>CANTIDAD DE ESTUDIANTES: </b>
            {quantity_studets}
          </div>

          <div className="tag-container mb-3">
            <label className="tag-label">AMBIENTE</label>

            <div className="pt-2 pb-2">
              <b>BLOQUE: </b> {block}
            </div>
            {conflictsModal?.classroom.message === "" ? (
              ""
            ) : (
              <div>
                <b className="text-warning">{`${
                  conflictsModal?.classroom.message
                }, ${conflictsModal?.classroom.list.map((classr) => {
                  return classr + ", ";
                })}`}</b>
              </div>
            )}
            <div className="row">
              <div className="col-sm-2">
                <b>AULA(s)</b>
              </div>
              <div className="col-sm-10">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Capacidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classrooms.map((each) => {
                      return (
                        <tr key={each.classroom_name}>
                          <td>{each.classroom_name}</td>
                          <td>{each.capacity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <b>MOTIVO: </b> {reason}
          </div>
        </div>
      </>
    ),
    footer: customBottonsForModal,
  };

  return (
    <>
      <div
        className="border border-dark rounded row mt-2 mb-2 text-center"
        style={{ minWidth: "300px" }}
      >
        <div className="col-1 mt-1 mb-1">
          <b>{id}</b>
        </div>
        <div className="col-3 mt-1 mb-1">{subject}</div>
        <div className="col-2 mt-1 mb-1">{quantity_studets}</div>
        <div className="col-2 mt-1 mb-1">{reservation_date}</div>
        <div className="col-2 mt-1 mb-1">{`${periods[0]} - ${periods[1]}`}</div>
        <div className="col-sm-2 mt-1 mb-1">
          <button
            className="btn btn-outline-primary "
            onClick={handleClickModal}
          >
            Detalles
          </button>
        </div>
      </div>
      <ModalRequestInformation
        show={modalStateShow.show}
        setShow={(change) => modalStateShow.setShow(change)}
        content={modalContent}
      />
    </>
  );
}
