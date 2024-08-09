import { useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { getClassroomsByBlock } from "../../../services/classrooms";
import { getStadisticsBlock } from "../../../services/blocks";
import { deleteBlock } from "../../../services/blocks";
import "./BlockDelete.css";

function BlockDelete(props) {
  const { block_id, name, maxclassrooms, maxfloor, block_status_name } = props;
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
    if (response.status >= 200 && response.status < 300) {
      setMsgModal({ status: "Exito", message: response.data.message });
    } else if (
      (response.status >= 300 && response.status < 400) ||
      (response.status >= 400 && response.status < 500)
    ) {
      setMsgModal({ status: "Error", message: response.data.message });
    } else if (response.status >= 500) {
      setMsgModal({
        status: "Error",
        message: "Ocurrio un error inesperado, intentelo nuevamente.",
      });
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
            <b>{name}</b>
          </div>
        </div>
        <div className="col-sm-4">
          <div>
            <b className="text-primary">CANTIDAD DE AULAS: </b>
            <b>{maxclassrooms}</b>
          </div>
          <div>
            <b className="text-primary">NUMERO DE PISO: </b>
            <b>{maxfloor}</b>
          </div>
        </div>

        <div className="col-sm-2 align-self-center d-flex justify-content-end">
          <Button
            variant="danger"
            className="mt-1 custom-button btn btn-danger custom-btn-red -outline"
            onClick={getEnvironmentBlock}
          >
            Eliminar
          </Button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <h3>¿Está seguro de eliminar el bloque?</h3>
        </Modal.Header>
        <Modal.Body>
          <h4>BLOQUE: {name}</h4>
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
                      {each.name}
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
                {/* Parece que el endpoint de estados se rompio o algo, no lo testee a detalle */}
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
                Eliminar el BLOQUE tendrá las siguientes consecuencias:
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
                también seran eliminados.
              </b>
            </div>
            <div className="ps-3">
              <b className="text-danger">* El BLOQUE ya no será editable.</b>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={() => {
              setShow(false);
              setShowConfirm(true);
            }}
          >
            Eliminar
          </Button>
          <Button
            variant="secondary"
            className="custom-btn-gray-outline"
            onClick={() => setShow(false)}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirm}
        onHide={handleCloseConfirm}
        size="md"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <h3>¡Advertencia!</h3>
        </Modal.Header>
        <Modal.Body>
          <div>¿Está seguro de eliminar el Bloque?</div>
        </Modal.Body>
        <Modal.Footer>
          {loadingDelete && (
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          )}
          <Button
            variant="danger"
            className="custom-btn-red-outline"
            onClick={sendDeleteBlock}
          >
            Confirmar
          </Button>
          <Button
            variant="secondary"
            className="custom-btn-gray-outline"
            onClick={() => setShowConfirm(false)}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showMsg}
        onHide={handleCloseMsgModal}
        size="md"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <h3>¡{msgModal.status}!</h3>
        </Modal.Header>
        <Modal.Body>
          <b className="mt-2">{msgModal.message}</b>
          {msgModal.status === "Error" && (
            <div
              className="d-flex flex-wrap gap-1 mt-2"
              style={{ maxHeight: "85px", overflowY: "auto" }}
            >
              {environment
                .filter((each) => each.classroom_status_name === "HABILITADO")
                .map((each) => (
                  <div
                    key={each.classroom_id}
                    className="p-1 text-light rounded bg-secondary text-center"
                    style={{ minWidth: "80px", margin: "3px" }}
                  >
                    {each.name}
                  </div>
                ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              className="custom-btn-primary-outline"
              onClick={handleCloseMsgModal}
            >
              Aceptar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BlockDelete;
