import { Link, useNavigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Collapse, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import "./Sidebar.css";
import { getBlocks } from "../../services/classrooms";

export default function Sidebar({ user }) {
  const [activeItem, setActiveItem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [modalContent, setModalContent] = useState({});
  const [repitRequest, setRepitRequest] = useState(true);
  const navigate = useNavigate();
  const userInformation = JSON.parse(localStorage.getItem("userInformation"));

  useEffect(() => {
    if (repitRequest) {
      isLogged();
      setRepitRequest(false);
    }
  }, [repitRequest]);

  const isLogged = () => {
    verifyTokenExpired();
  };

  const verifyTokenExpired = async () => {
    setInterval(() => {
      setRepitRequest(true);
    }, 10000);
    let response = await getBlocks();
    if (
      response.status === 402 ||
      response.data.status === "Token expirado" ||
      response.data.status === "Token invalido"
    ) {
      let content = {
        show: true,
        title: "Sesion expirada",
        body: "Sesion terminada, redireccionando a la pagina principal",
      };
      localStorage.removeItem("token");
      localStorage.removeItem("userInformation");
      setModalContent(content);
      setTimeout(() => navigate("/"), 3000);
    } else {
      let content = {
        show: false,
        title: "",
        body: "",
      };
      setModalContent(content);
    }
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [itemName]: !prevOpenItems[itemName],
    }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInformation");
    navigate("/");
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div>
          <header>
            <span className="d-block text-center text-truncate user-select-none fs-6 fst-italic">
              {userInformation.roles}
            </span>
          </header>
          <div className="text-center">
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "100px" }}
            ></i>
          </div>
          <span className="d-block text-center text-truncate user-select-none fs-5 fw-semibold">
            {userInformation.name + " " + userInformation.last_name}
          </span>
          <span className="d-block text-center text-truncate user-select-none fs-6 fst-italic">
            {userInformation.email}
          </span>
          <div className="hover">
            <ul className="list-unstyled px-2">
              <li className="text-center">
                <span
                  className="text-decoration-none px-3 py-2 d-block"
                  onClick={() => {
                    handleItemClick("logout");
                    logout();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-box-arrow-left fs-4"></i>
                  <span className="ps-1 user-select-none">Cerrar sesión</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className="main-container d-flex">
        <div className={`sidebar ${menuOpen ? "active" : ""}`} id="side_nav">
          <div className="header-box py-2 text-center d-flex justify-content-center">
            <button
              className="btn d-md-none d-block close-btn px-1 py-0 text-black"
              onClick={handleMenuClose}
            >
              <i className="bi bi-list-nested"></i>
            </button>
            <h1 className="fs-2 title">
              <span className="text-black title">SURA</span>
            </h1>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
            <ul className="list-unstyled">
              <li className={activeItem === "home" ? "active" : ""}>
                <Link
                  to="home"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("home")}
                >
                  <i className="bi bi-house fs-4"></i> Página principal
                </Link>
              </li>
            </ul>
            <ul className="list-unstyled">
              <li className={activeItem === "reservations" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3  d-block"
                  onClick={() => handleItemClick("reservations")}
                >
                  <i className="bi bi-journal-bookmark fs-4"></i> Reservas
                  <i className="bi bi-chevron-down"></i>
                </Link>
              </li>
              <Collapse in={openItems["reservations"]}>
                <div>
                  {user === "user" && (
                    <li
                      className={
                        activeItem === "enviroment-request"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="enviroment-request"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-request")}
                      >
                        <i className="bi bi-bookmark-plus fs-4"></i> Nueva
                        solicitud de reserva
                      </Link>
                    </li>
                  )}
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "request-attention"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="attention-list"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("request-attention")}
                      >
                        <i className="bi bi-person-workspace fs-4"></i> Atender
                        solicitudes pendientes
                      </Link>
                    </li>
                  )}
                  {user === "user" && (
                    <li
                      className={
                        activeItem === "list-requests"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="list-cancel"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("list-requests")}
                      >
                        <i className="bi bi-bookmark-x fs-4"></i> Cancelar
                        solicitud
                      </Link>
                    </li>
                  )}
                  {user === "user" && (
                    <li
                      className={
                        activeItem === "request-history"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="request-history"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("request-history")}
                      >
                        <i className="bi bi-book fs-4"></i> Historial de
                        solicitudes
                      </Link>
                    </li>
                  )}
                </div>
              </Collapse>
            </ul>
            <ul className="list-unstyled">
              <li className={activeItem === "environments" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("environments")}
                >
                  <i className="bi bi-house fs-4"></i> Ambientes
                  <i className="bi bi-chevron-down"></i>
                </Link>
              </li>
              <Collapse in={openItems["environments"]}>
                <div id="example-collapse-text">
                  <li
                    className={`list-unstyled px-3 ${
                      activeItem === "disponibility" ? "active" : ""
                    }`}
                  >
                    <Link
                      to="environments-disponibility"
                      className="text-decoration-none px-3 py-2 d-block"
                      onClick={() => handleItemClick("disponibility")}
                    >
                      <i
                        className="bi bi-clock-history fs-4"
                        aria-hidden="true"
                      ></i>
                      <span className="ps-1">Disponibilidad de ambientes</span>
                    </Link>
                  </li>

                  <li
                    className={
                      activeItem === "statistics"
                        ? "active list-unstyled px-2"
                        : "list-unstyled px-3"
                    }
                  >
                    <Link
                      to="statistics-ambience"
                      className="text-decoration-none px-3 py-2 d-block"
                      onClick={() => handleItemClick("statistics")}
                    >
                      <i className="bi bi-graph-up fs-4"></i>
                      <span className="ps-1">
                        Estadistica de uso de ambiente
                      </span>
                    </Link>
                  </li>
                </div>
              </Collapse>
            </ul>

            {user === "superuser" && (
              <ul className="list-unstyled">
                <li className={activeItem === "management" ? "active" : ""}>
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("management")}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <i className="bi bi-houses fs-4"></i>
                      <span className="ps-1">Gestión de Ambiente</span>
                      <i className="bi bi-chevron-down"></i>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["management"]}>
                  <div>
                    <li
                      className={
                        activeItem === "enviroment-register"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="environment-register"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-register")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-house-add fs-4"></i> Registrar
                          Ambiente
                        </div>
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "edit-environment"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="edit-environment"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("edit-environment")}
                      >
                        <i className="bi bi-house-gear fs-4"></i> Editar
                        ambiente
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "delete-environment"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="delete-environment"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("delete-environment")}
                      >
                        <i className="bi bi-house-x fs-4"></i> Eliminar ambiente
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}

            <ul className="list-unstyled">
              <li className={activeItem === "notifications" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("notifications")}
                >
                  <i className="bi bi-bell fs-4"></i> Notificaciones
                  <i className="bi bi-chevron-down "></i>
                </Link>
              </li>
              <Collapse in={openItems["notifications"]}>
                <div>
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "send-notification"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="send-notification"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("send-notification")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-send fs-4"></i> Crear notificación
                        </div>
                      </Link>
                    </li>
                  )}
                  {user === "user" && (
                    <li
                      className={
                        activeItem === "notifications-list"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="notifications-list"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("notifications-list")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-inbox fs-4"></i> Ver
                          notificationes
                        </div>
                      </Link>
                    </li>
                  )}
                </div>
              </Collapse>
            </ul>

            {user === "superuser" && (
              <ul className="list-unstyled">
                <li
                  className={activeItem === "management-block" ? "active" : ""}
                >
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("management-block")}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <i className="bi bi-building fs-4"></i>
                      <span className="ps-1">Gestión de Bloques</span>
                      <i className="bi bi-chevron-down"></i>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["management-block"]}>
                  <div>
                    <li
                      className={
                        activeItem === "block-register"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="block-register"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("block-register")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-building-add fs-4"></i> Registrar
                          bloque
                        </div>
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "edit-block"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="edit-block"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("edit-block")}
                      >
                        <i className="bi bi-building-gear fs-4"></i> Editar
                        bloque
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "delete-block"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="delete-block"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("delete-block")}
                      >
                        <i className="bi bi-building-x fs-4"></i> Eliminar
                        bloque
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}

            {user === "superuser" && (
              <ul className="list-unstyled">
                <li className={activeItem === "report" ? "active" : ""}>
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("report")}
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <i className="bi bi-clipboard-data fs-4"></i> Reportes
                      <i className="bi bi-chevron-down"></i>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["report"]}>
                  <div>
                    <li
                      className={
                        activeItem === "generate-report"
                          ? "active list-unstyled px-2"
                          : "list-unstyled px-2"
                      }
                    >
                      <Link
                        to="generate-report"
                        className="text-decoration-none px-4 py-2 d-block"
                        onClick={() => handleItemClick("generate-report")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-file-earmark-spreadsheet fs-4"></i>{" "}
                          Generar Reporte
                        </div>
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}
          </div>

          <hr className="h-color mx-2" />
          <div className="hover">
            <OverlayTrigger
              className="p-3 mb-5 rounded "
              trigger="click"
              placement="right"
              overlay={popover}
              style={{ maxWidth: "40vh" }}
            >
              <div className="d-flex justify-content-around align-items-center">
                <i className="bi bi-person-circle fs-1"></i>
                <span className="text-truncate user-select-none w-40">
                  {userInformation.name + " " + userInformation.last_name}
                </span>
              </div>
            </OverlayTrigger>
          </div>
        </div>
        <div className="content">
          <div className="bg-light p-3 d-md-none">
            <div className="d-flex justify-content-between d-md-none d-block">
              <button
                className="btn px-1 py-0 open-btn me-2"
                onClick={handleMenuOpen}
              >
                <i className="bi bi-list-nested"></i>
              </button>
              <Link
                className="navbar-brand fs-4"
                to="#"
                onClick={() => {
                  handleItemClick("home");
                }}
              >
                <span className="px-2 py-0 text-black">SURA</span>
              </Link>
            </div>
          </div>
          <div className="bg-white dashboard-content px-3 scroll">
            <Outlet />
          </div>
        </div>
      </div>
      <Modal show={modalContent.show} size="lg" centered={true} backdrop>
        <Modal.Header>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pt-3 pb-3">
            <span>{modalContent.body}</span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
