import { useState } from "react";
import { Modal, Spinner, Table } from "react-bootstrap";
import { getClassroomsByBlock } from "../../../services/classrooms";
import { getStadisticsBlock } from "../../../services/blocks";
import { deleteBlock } from "../../../services/blocks";

function BlockDelete(props) {
  const {
    block_id,
    block_name,
    block_maxclassrooms,
    block_maxfloor,
    block_status_name,
  } = props;
  const [environment, setEnvironment] = useState([]);
  const [stadisticsBlock, setStadisticsBlock] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [show, setShow] = useState(false);
  const [msgModal, setMsgModal] = useState({ status: "", message: "" });

  const handleClose = () => {
    setShow(false);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const getEnvironmentBlock = async () => {
    let environment = await getClassroomsByBlock(block_id);
    setEnvironment(environment);
    let stadistics = await getStadisticsBlock(block_id);
    setStadisticsBlock(stadistics);
    setShow(true);
  };

  const sendDeleteBlock = async () => {
    setLoadingDelete(true);
    let response = await deleteBlock(block_id).finally(() => {
      setLoadingDelete(false);
      setShowConfirm(false);
    });
    if (response.message === "Bloque eliminado exitosamente.") {
      setMsgModal({ status: "Exito", message: response.message });
    } else {
      setMsgModal({ status: "Error", message: response.message });
    }
    setShowMsg(true);
  };

  const handleCloseMsgModal = () => {
    setShowMsg(false);
    setShow(false);
    setShowConfirm(false);
    props.reloadList(true);
  };

  return (
    <>
      <div
        className="row border border-black rounded p-2 mb-2"
        style={{ minWidth: "400px" }}
      >
        <div className="col-sm-6">
          <div>
            <b className="col text-primary">ESTADO: </b>
            <b
              className={`text-light rounded p-1 ${
                block_status_name === "HABILITADO" ? "bg-success" : "bg-danger"
              }`}
            >
              {block_status_name}
            </b>
          </div>
          <div>
            <b className="text-primary">NOMBRE: </b>
            <b>{block_name}</b>
          </div>
        </div>
        <div className="col-sm-4">
          <div>
            <b className="text-primary">CANTIDAD DE AULAS: </b>
            <b>{block_maxclassrooms}</b>
          </div>
          <div>
            <b className="text-primary">NUMERO DE PISO: </b>
            <b>{block_maxfloor}</b>
          </div>
        </div>

        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <button
            className="btn btn-sm btn-outline-danger"
            type="button"
            onClick={getEnvironmentBlock}
          >
            <b>Eliminar</b>
          </button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Body>
          <h3>¿Esta seguro de eliminar el bloque?</h3>
          <h4>BLOQUE: {block_name}</h4>
          <b>El bloque tiene los siguientes ambientes que seran eliminados:</b>
          <div className="m-3">
            {environment.length === 0 ? (
              <div className="text-center">
                <h4 className="text-danger">
                  El BLOQUE no tiene ambientes registrados.
                </h4>
              </div>
            ) : (
              <div
                className="d-flex flex-wrap gap-1"
                style={{ maxHeight: "85px", overflowY: "auto" }}
              >
                {environment.map((each) => {
                  return (
                    <div
                      key={each.classroom_id}
                      className="p-1 text-light rounded bg-secondary text-center"
                      style={{ minWidth: "80px", margin: "3px" }}
                    >
                      {each.classroom_name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <b>
            El bloque tiene en sus ambientes asignado las siguientes
            solicitudes:
          </b>
          <div className="align-self-center ps-3 pe-3 pt-3">
            <div className=" d-flex justify-content-center">
              <b className="text-light bg-success rounded p-1 me-1">
                Aceptadas: {stadisticsBlock.accepted}
              </b>
              <b className="text-light bg-danger rounded p-1 me-1">
                Rechazadas: {stadisticsBlock.rejected}
              </b>
              <b className="text-light bg-warning rounded p-1 me-1">
                Pendientes: {stadisticsBlock.pending}
              </b>
            </div>
            <hr />
            <div className="d-flex justify-content-center">
              <b className="text-light bg-secondary rounded p-1 me-1">
                Total solicitudes: {stadisticsBlock.total}
              </b>
            </div>
          </div>
          <div className="m-4">
            <div>
              <b className="">
                Eliminar el BLOQUE tendrá las siguientes concecuencias:
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">
                * Todas las solicitudes pendientes/aceptadas serán
                rechazadas/canceladas.
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">
                * Al eliminar el BLOQUE todos los ambientes pertenecientes
                tambien seran eliminados.
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">* El BLOQUE ya no será editable.</b>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-danger m-1"
              onClick={() => {
                setShow(false);
                setShowConfirm(true);
              }}
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

      <Modal show={showConfirm} onHide={handleCloseConfirm} size="md" centered>
        <Modal.Body>
          <h3>¡Advertencia!</h3>
          <div className="d-flex justify-content-center">
            <p>¿Está seguro de elimnar el Bloque?</p>
          </div>
          <div className="d-flex justify-content-end">
            {loadingDelete && (
              <Spinner animation="border" variant="secondary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            )}
            <button
              className="btn btn-outline-danger m-1"
              onClick={sendDeleteBlock}
            >
              Confirmar
            </button>
            <button
              className="btn btn-outline-secondary m-1"
              onClick={() => setShowConfirm(false)}
            >
              Cancelar
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showMsg} onHide={handleCloseMsgModal} size="md" centered>
        <Modal.Body>
          <h3>{msgModal.status}</h3>
          <b>{msgModal.message}</b>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-secondary"
              onClick={handleCloseMsgModal}
            >
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BlockDelete;
