import { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default function SubjectElement(props) {
  const {} = props;
  const [show, setShow] = useState(false);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="">
          <p className="p-2">¿Está seguro de eliminar la materia?</p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-danger w-100 mx-1"
              onClick={() => console.log("aceptar")}
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
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <b className="text-primary pe-2">CODIGO: </b>
              <b className="text-success">123123124</b>
            </div>
            <div className="col-md-8 col-sm-12">
              <b className="text-primary pe-2">MATERIA: </b>
              <b className="text-success">
                ELEMENTOS DE PROGRAMACION Y ESTRUCTURA DE DATOS
              </b>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <b className="text-primary pe-2">CREADO EL: </b>
              <b className="text-success">14/04/2021</b>
            </div>
            <div className="col-md-4 col-sm-12">
              <b className="text-primary pe-2">GESTION: </b>
              <b className="text-success">II-2024</b>
            </div>
            <div className="col-md-4 col-sm-12">
              <b className="text-primary pe-2">NIVEL: </b>
              <b className="text-success">A</b>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-sm-12 text-md-end text-sm-start">
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
