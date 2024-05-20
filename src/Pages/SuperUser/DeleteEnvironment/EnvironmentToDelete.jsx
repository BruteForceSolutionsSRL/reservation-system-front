import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { requestsListProvisional } from "./DataProvisional";

export default function EnvironmentToDelete(props) {
  const {
    id,
    name,
    capacity,
    floor,
    block_name,
    type_description,
    status_name,
    statistics,
  } = props;
  const [show, setShow] = useState(false);
  //   const [requestsList, setRequestsList] = useState([]);
  const [requestsList, setRequestsList] = useState(requestsListProvisional);

  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <div
        className="row border border-black rounded p-2 mb-2"
        style={{ minWidth: "400px" }}
      >
        <div className="col-sm-4">
          <div>
            <b className="col text-primary">ESTADO: </b>
            <b
              className={`text-light rounded p-1 ${
                status_name === "HABILITADO" ? "bg-success" : "bg-danger"
              }`}
            >
              {status_name}
            </b>
          </div>
          <div>
            <b className="text-primary">NOMBRE: </b>
            <b>{name}</b>
          </div>
        </div>
        <div className="col-sm-4">
          <div>
            <b className="text-primary">BLOQUE: </b>
            <b>{block_name}</b>
          </div>
          <div>
            <b className="text-primary">TIPO: </b>
            <b>{type_description}</b>
          </div>
        </div>
        <div className="col-sm-2">
          <div>
            <b className="text-primary">CAPACIDAD: </b>
            <b>{capacity}</b>
          </div>
          <div>
            <b className="text-primary">PISO: </b>
            <b>{floor}</b>
          </div>
        </div>
        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <button
            className="btn btn-sm btn-outline-danger"
            type="button"
            onClick={() => setShow(true)}
          >
            <b>Eliminar</b>
          </button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Body>
          <h3>¿Esta seguro de eliminar el ambiente?</h3>
          <b>El ambiente tiene las siguientes reservas asignadas:</b>
          <div className="m-3">
            <Table borderless responsive>
              <thead>
                <tr>
                  <th>MATERIA</th>
                  <th>MOTIVO</th>
                  <th>FECHA</th>
                  <th># ESTUDIANTES</th>
                </tr>
              </thead>
              <tbody>
                {requestsList?.map((each) => {
                  return (
                    <tr key={each.id}>
                      <td>{each.subject}</td>
                      <td>{each.reason}</td>
                      <td>{each.date}</td>
                      <td>{each.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <b>Cantidad de solicitudes del ambiente:</b>
          <div className="align-self-center ps-3 pe-3 pt-3">
            <div className=" d-flex justify-content-center">
              <b className="text-light bg-success rounded p-1 me-1">
                Aceptadas: {statistics.accepted_reservations}
              </b>
              <b className="text-light bg-danger rounded p-1 me-1">
                Aceptadas: {statistics.rejected_reservations}
              </b>
              <b className="text-light bg-warning rounded p-1 me-1">
                Aceptadas: {statistics.pending_reservations}
              </b>
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <b className="text-light bg-secondary rounded p-1 me-1">
                Total solicitudes: {statistics.total_reservations}
              </b>
            </div>
          </div>
          <div className="m-4">
            <div>
              <b className="text-danger">
                Eliminar el ambiente tendrá las siguientes concecuencias:
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">
                *Todas las solicitudes pendientes/aceptadas serán
                rechazadas/canceladas.
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">
                *El ambiente ya no podrá ser seleccionado al momento de realizar
                una nueva solicitud de reserva.
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">*El ambiente ya no será editable.</b>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-danger m-1"
              onClick={() => alert("Eliminado")}
            >
              Eliminar
            </button>
            <button
              className="btn btn-outline-secondary m-1"
              onClick={() => setShow(false)}
            >
              Cancelar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
