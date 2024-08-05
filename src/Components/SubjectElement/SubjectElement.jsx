import { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default function SubjectElement({ subject, onClick }) {
  const {
    department_id,
    department_name,
    groups,
    name,
    study_plans,
    university_subject_id,
  } = subject;
  const [show, setShow] = useState(false);

  const handleClickDelete = () => onClick(university_subject_id, name);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="">
          <p className="p-2">
            ¿Está seguro de eliminar la materia <strong>{name}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-danger w-100 mx-1"
              onClick={handleClickDelete}
            >
              Eliminar
            </button>
            <button
              className="btn btn-secondary w-100 mx-1"
              onClick={() => setShow(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );
  return (
    <div className="border rounded border-black p-2 my-2">
      <div className="row">
        <div className="col-md-10 col-sm-12">
          <div>
            <b className="text-primary pe-2">MATERIA: </b>
            <b className="text-success">{name}</b>
          </div>
          <div className="row">
            <div className="col-md-5 col-sm-12">
              <b className="text-primary pe-2">DEPARTAMENTO: </b>
              <b className="text-success">{department_name}</b>
            </div>
            <div className="col-md-5 col-sm-12">
              <b className="text-primary pe-2">PLAN DE ESTUDIO: </b>
              <b className="text-success">{study_plans[0].name}</b>
            </div>
            <div className="col-md-2 col-sm-12">
              <div>
                <b className="text-primary pe-2">NIVEL: </b>
                <b className="text-success">{study_plans[0].grade}</b>
              </div>
              <div>
                <b className="text-primary pe-2">CODIGO: </b>
                <b className="text-success">{university_subject_id}</b>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-12 d-flex align-items-center text-md-end text-sm-start">
          <OverlayTrigger
            trigger="click"
            show={show}
            placement="auto"
            overlay={popover}
            rootClose
          >
            <button
              className="btn btn-danger w-100"
              onClick={() => setShow(!show)}
            >
              <span>Eliminar</span>
            </button>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
}
