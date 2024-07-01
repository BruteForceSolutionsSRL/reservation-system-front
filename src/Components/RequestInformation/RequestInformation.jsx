import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import ModalRequestInformation from "./ModalRequestInformation";
import { getConflicts } from "../../services/conflicts";
import "./RequestInformations.css";

export default function RequestInformation({
  content,
  customBottonsForModal,
  showConflicts = false,
  index,
  title,
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
    title: <h3>{title}</h3>,
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
                state === "ACEPTADO"
                  ? "success text-light"
                  : state === "CANCELADO"
                  ? "secondary text-light"
                  : state === "RECHAZADO"
                  ? "danger text-light"
                  : "dark text-white"
              }`}
            >
              {state}
            </label>
          </div>

          <div className="tag-container mb-3">
            <label className="tag-label">GRUPO</label>
            <div
              className="scrol-teacher-modal h-100 overflow-y-auto"
              style={{ maxHeight: "200px" }}
            >
              <Table bordered className="w-100">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Grupo</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((each, index) => {
                    return (
                      <tr key={each.group_number + "" + index}>
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
              <div
                className="scrol-teacher-modal col-sm-10 h-100 overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
                <Table bordered className="w-100">
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
        className="row border border-black rounded p-2 mb-2"
        style={{ minWidth: "400px" }}
      >
        <div className="col-sm-5">
          <div className="">
            <b className="text-primary ">ID: </b>
            <b>{id}</b>
          </div>
          <div>
            <b className="text-primary">MATERIAS(S): </b>
            <b>{subject}</b>
          </div>
        </div>
        <div className="col-sm-3">
          <div>
            <b className="text-primary">CAPACIDAD DE ESTUDIANTES: </b>
            <b>{quantity_studets}</b>
          </div>
          <div>
            <b className="text-primary">FECHA DE RESERVA: </b>
            <b>{reservation_date}</b>
          </div>
        </div>
        <div className="col-sm-2">
          <div>
            <b className="text-primary">PERIODOS: </b>
            <b>{`${periods[0]} - ${periods[1]}`}</b>
          </div>
        </div>
        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <Button
            variant="primary"
            className="mt-1 custom-button btn btn-primary custom-btn-primary-outline text-truncate"
            onClick={handleClickModal}
          >
            Detalles
          </Button>
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
