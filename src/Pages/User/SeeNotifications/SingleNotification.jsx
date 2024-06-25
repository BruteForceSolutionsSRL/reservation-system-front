import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleNotification } from "../../../services/notifications";
import { Modal, Spinner, Table } from "react-bootstrap";
import { getSingleRequest } from "../../../services/requests";
import ModalRequestInformation from "../../../Components/RequestInformation/ModalRequestInformation";
import { getBlocks, getClassrooms } from "../../../services/classrooms";

export default function SingleNotification() {
  const { notificationId } = useParams();

  const [notification, setNotification] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});
  const [showRequest, setShowRequest] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [request, setRequest] = useState(undefined);
  const [block, setBlock] = useState(undefined);
  const [environment, setEnvironment] = useState(undefined);
  const [blockModalContent, setBlockModalContent] = useState(undefined);
  const [classroomModalContent, setClassroomModalContent] = useState(undefined);
  const [modalClassAndBlock, setModalClassAndBlock] = useState(false);
  const [time, setTime] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getNotificationInfo();
  }, []);

  const getNotificationInfo = async () => {
    let response = await getSingleNotification(notificationId).finally(() =>
      setLoading(false)
    );
    if (response.status >= 200 && response.status < 300) {
      if (typeof response.data === "object" && response.data.length === 0) {
        setNotification({});
        setErrorMessage({
          error: true,
          message: "Notificacion no encontrada.",
        });
      } else {
        setNotification(response.data);
        setTime({
          hour: response.data.hour,
          minutes: response.data.minutes,
          date: response.data.date,
        });
        setErrorMessage({});

        let { reservation_id, block_id, classroom_id } = response.data;
        if (reservation_id) {
          getRequest(reservation_id);
        } else if (block_id) {
          getBlock(block_id);
        } else if (classroom_id) {
          getClassroom(classroom_id);
        }
      }
    } else if (response.status >= 300 && response.status < 400) {
      setNotification({});
      setErrorMessage({ error: true, message: response.data });
    } else if (response.status >= 400 && response.status < 500) {
      setNotification({});
      setErrorMessage({ error: true, message: response.data });
    } else if (response.status >= 500) {
      setNotification({});
      setErrorMessage({
        error: true,
        message: "Ocurrio un error inesperado, intentelo nuevamente.",
      });
    }
  };

  const getRequest = async (reservation_id) => {
    let response = await getSingleRequest(reservation_id);
    setRequest(response);
    setContentModal(response.data);
  };

  const getBlock = async (block_id) => {
    let response = await getBlocks();
    if (response.status >= 200 && response.status < 300) {
      let block = response.data.find((block) => block.block_id === block_id);
      if (block) {
        setBlock(block);
        setBlockContent(block);
      }
    }
  };

  const getClassroom = async (classroom_id) => {
    let response = await getClassrooms();
    if (response.status >= 200 && response.status < 300) {
      let classroom = response.data.find(
        (classroom) => classroom.classroom_id === classroom_id
      );
      if (classroom) {
        setEnvironment(classroom);
        setContentClassroom(classroom);
      }
    }
  };

  const goBackToList = () => {
    navigate("../notifications-list");
  };

  const setContentModal = (request) => {
    let content = {
      id: request.reservation_id,
      subject: request.subject_name,
      groups: request.groups,
      reservation_date: request.reservation_date,
      periods: request.time_slot,
      quantity_studets: request.quantity,
      block: request.block_name,
      classrooms: request.classrooms,
      reason: request.reason_name,
      state: request.reservation_status,
    };

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

    setModalContent({
      id: id,
      title: <h3>VER ESTADO</h3>,
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
                    : state === "PENDIENTE"
                    ? "warning text-white"
                    : "dark text-white"
                }`}
              >
                {state}
              </label>
            </div>

            <div className="tag-container mb-3">
              <label className="tag-label">GRUPO</label>
              <div>
                <Table bordered className="w-100">
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
            <div className="pb-3">
              <b>CANTIDAD DE ESTUDIANTES: </b>
              {quantity_studets}
            </div>

            <div className="tag-container mb-3">
              <label className="tag-label">AMBIENTE</label>

              <div className="pt-2 pb-2">
                <b>BLOQUE: </b> {block}
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <b>AULA(s)</b>
                </div>
                <div className="col-sm-10">
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
    });
  };

  const setContentClassroom = (classroom) => {
    let content = (
      <>
        <div className="p-2">
          <b>Nombre de ambiente: </b>
          <span>{classroom.classroom_name}</span>
        </div>
        <div className="p-2">
          <b>Capacidad: </b>
          <span>{classroom.capacity}</span>
        </div>
        <div className="p-2">
          <b>Estado: </b>
          <b
            className={`p-1 rounded bg-${
              classroom.classroom_status_id === 1 ? "success" : "danger"
            } text-light`}
          >
            {classroom.classroom_status_name}
          </b>
        </div>
        <div className="p-2">
          <b>Tipo de ambiente: </b>
          <span>{classroom.classroom_type_name}</span>
        </div>
        <div className="tag-container position-relative mb-3 mt-4">
          <label className="tag-label">Ubicación del Ambiente</label>
          <div>
            <label className="fw-bold pe-2">BLOQUE: </label>
            <span>{classroom.block_name}</span>
          </div>
          <div>
            <label className="fw-bold pe-2">PISO</label>
            <span>{classroom.floor}</span>
          </div>
        </div>
      </>
    );
    setClassroomModalContent(content);
  };

  const setBlockContent = (block) => {
    let content = (
      <>
        <div className="p-2">
          <b>Nombre de bloque: </b>
          <span>{block.block_name}</span>
        </div>
        <div className="p-2">
          <b>Estado: </b>
          <b
            className={`p-1 rounded bg-${
              block.block_status_id === 1 ? "success" : "danger"
            } text-light`}
          >
            {block.block_status_name}
          </b>
        </div>
        <div className="p-2">
          <label className="fw-bold pe-2">PISO</label>
          <span>{block.block_maxfloor}</span>
        </div>
      </>
    );
    setBlockModalContent(content);
  };

  return (
    <div className="container pt-3" style={{ height: "90vh" }}>
      {loading ? (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div>
            <span className="fs-3 pe-2">Cargando</span>
          </div>
          <div>
            <Spinner animation="border" variant="secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      ) : (
        <>
          {errorMessage.error ? (
            <div className="h-100 d-flex justify-content-center align-items-center">
              <h3>{errorMessage.message}</h3>
            </div>
          ) : (
            <div className="">
              <div className="fs-3">
                <i
                  className="bi bi-arrow-return-left pe-2"
                  style={{ cursor: "pointer" }}
                  onClick={goBackToList}
                ></i>
                <span style={{ cursor: "pointer" }} onClick={goBackToList}>
                  Volver
                </span>
              </div>
              <div className="">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3>{notification.title}</h3>
                  </div>
                  <div>
                    {notification.type === "ACEPTADA" ? (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    ) : notification.type === "INFORMATIVO" ? (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-exclamation-circle-fill fs-1 text-primary"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    ) : notification.type === "RECHAZADA" ? (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-x-circle-fill fs-1 text-danger"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    ) : notification.type === "CANCELADA" ? (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-x-octagon-fill fs-1 text-secondary"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    ) : notification.type === "ADVERTENCIA" ? (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div>
                          <i className="bi bi-circle-fill fs-1 text-primary"></i>
                        </div>
                        <div>
                          <span>{notification.type}</span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <i className="pe-2">{`${time.hour}:${time.minutes}`}</i>
                      <i>{time.date}</i>
                    </div>
                    {request ? (
                      <div className="text-center pt-3 pb-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setShowRequest(true)}
                        >
                          Ver solicitud
                        </button>
                      </div>
                    ) : block ? (
                      <div className="text-center pt-3 pb-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setModalClassAndBlock(true)}
                        >
                          Ver informacion de bloque
                        </button>
                      </div>
                    ) : (
                      environment && (
                        <div className="text-center pt-3 pb-4">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setModalClassAndBlock(true)}
                          >
                            Ver informacion de ambiente
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <p
                  className="h-100 overflow-y-auto"
                  style={{ minHeight: "250px", maxHeight: "300px" }}
                >
                  {notification.body}
                </p>
              </div>

              <div className="">
                <hr />
                <div className="d-flex justify-content-end">
                  <span>Enviado por: {notification.sendBy}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ModalRequestInformation
        show={showRequest}
        setShow={(change) => setShowRequest(change)}
        content={modalContent}
      />

      <Modal
        show={modalClassAndBlock}
        onHide={() => setModalClassAndBlock(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {blockModalContent
              ? "Informacion de bloque."
              : classroomModalContent
              ? "Informacion de ambiente"
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{blockModalContent || classroomModalContent}</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary w-100 text-truncate"
            onClick={() => setModalClassAndBlock(false)}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
