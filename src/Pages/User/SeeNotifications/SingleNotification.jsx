import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleNotification } from "../../../services/notifications";
import { Spinner, Table } from "react-bootstrap";
import { getSingleRequest } from "../../../services/requests";
import ModalRequestInformation from "../../../Components/RequestInformation/ModalRequestInformation";

export default function SingleNotification() {
  const { notificationId } = useParams();

  const [notification, setNotification] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});
  const [showRequest, setShowRequest] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [request, setRequest] = useState(undefined);

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
        setErrorMessage({});
        if (response.data.reservation_id) {
          getRequest(response.data.reservation_id);
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

  const goBackToList = () => {
    window.location.href = "/user/notifications-list";
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

  return (
    <div className="container" style={{ height: "90vh" }}>
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
                      <span>Hora y fecha</span>
                    </div>
                    {request && (
                      <div className="text-center pt-3 pb-4">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setShowRequest(true)}
                        >
                          Ver solicitud
                        </button>
                      </div>
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
      {/* Modal */}

      <ModalRequestInformation
        show={showRequest}
        setShow={(change) => setShowRequest(change)}
        content={modalContent}
      />
    </div>
  );
}
