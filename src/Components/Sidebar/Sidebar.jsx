import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Collapse, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import "./Sidebar.css";
import { useAuth } from "../../contexts/AuthProvider";
import { useSessionUserService } from "../../Hooks/useSessionUserService";

export default function Sidebar({ user }) {
  const [activeItem, setActiveItem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [modalContent, setModalContent] = useState({});
  const userInformation = JSON.parse(localStorage.getItem("userInformation"));
  const [popoverPlacement, setPopoverPlacement] = useState("right");
  const sidebarRef = useRef(null);
  const { logout } = useAuth();
  const { tokenStatusUser } = useSessionUserService();
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    let idInterval = setInterval(() => {
      tokenStatus();
    }, 60000);
    return () => {
      clearInterval(idInterval);
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPopoverPlacement("top");
      } else {
        setPopoverPlacement("right");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleMenuClose();
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const tokenStatus = async () => {
    let newAbortController = new AbortController();
    setAbortController(newAbortController);
    let response = await tokenStatusUser(newAbortController);
    if (
      response.status === 401 ||
      response.status === 403 ||
      response.data.status === "Token expirado" ||
      response.data.status === "Token invalido"
    ) {
      let content = {
        show: true,
        title: "Sesion expirada",
        body: "Sesion terminada, redireccionando a la pagina principal",
      };
      setModalContent(content);
      setTimeout(() => {
        logout();
        abortController.abort();
      }, 3000);
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
            <img
              style={{ borderRadius: "50%" }}
              src={`https://picsum.photos/id/${userInformation.person_id}/100/100`}
              alt="Foto de Perfil"
            />
          </div>
          <span className="d-block text-center text-truncate user-select-none fs-5 fw-semibold">
            {userInformation.fullname}
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
      <div className="main-container bg-dark d-flex ">
        <div
          ref={sidebarRef}
          className={` rounded border rounded border-dark sidebar ${
            menuOpen ? "active" : ""
          }`}
          id="side_nav"
        >
          <div className="header-box py-2 text-center d-flex justify-content-center ">
            <button
              className="btn d-md-none d-block close-btn px-1 py-0 text-black"
              onClick={handleMenuClose}
            >
              <i className="bi bi-list-nested text-white"></i>
            </button>
            <h1 className="fs-2 title">
              <span className="text-light title">SURA</span>
            </h1>
          </div>
          <div
            className="overflow-y-auto custom-scrollbars__content"
            style={{ maxHeight: "78vh" }}
          >
            <ul className="list-unstyled">
              <li className={activeItem === "home" ? "active" : ""}>
                <Link
                  to="home"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("home")}
                >
                  <i className="bi bi-house fs-4 text-white pe-2"></i>
                  <span className="text-white">Página principal</span>
                </Link>
              </li>
            </ul>

            {user === "superuser" && (
              <ul className="list-unstyled ">
                <li
                  className={
                    activeItem === "academic-management" ? "active" : ""
                  }
                >
                  <Link
                    to="#"
                    className="text-decoration-none px-3  d-block"
                    onClick={() => handleItemClick("academic-management")}
                  >
                    <i className="bi bi-calendar2-week fs-4 text-white"></i>
                    <span className="text-white ps-2">Gestión académica</span>
                  </Link>
                </li>
                <Collapse in={openItems["academic-management"]}>
                  <div>
                    {user === "user" && (
                      <li
                        className={
                          activeItem === "enter-management"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="enter-management"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("enter-management")}
                        >
                          <i className="bi bi-indent fs-4 text-white"></i>
                          <span className="text-white ps-2">
                            Ingesar a una gestion
                          </span>
                        </Link>
                      </li>
                    )}
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "enter-management"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="enter-management"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("enter-management")}
                        >
                          <i className="bi bi-indent fs-4 text-white"></i>
                          <span className="text-white ps-3">
                            Ingesar a una gestion
                          </span>
                        </Link>
                      </li>
                    )}
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "register-management"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="register-management"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("register-management")}
                        >
                          <i className="bi bi-calendar2-plus fs-4 text-white"></i>{" "}
                          <span className="text-white ps-2">
                            Registar gestion
                          </span>
                        </Link>
                      </li>
                    )}
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "edit-management"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="edit-management"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("edit-management")}
                        >
                          <i className="bi bi-calendar2-check fs-4 text-white"></i>{" "}
                          <span className="text-white ps-2">
                            Editar gestion
                          </span>
                        </Link>
                      </li>
                    )}
                  </div>
                </Collapse>
              </ul>
            )}

            {user === "superuser" && (
              <ul className="list-unstyled ">
                <li
                  className={activeItem === "academic-period" ? "active" : ""}
                >
                  <Link
                    to="#"
                    className="text-decoration-none px-3  d-block"
                    onClick={() => handleItemClick("academic-period")}
                  >
                    <i className="bi bi-mortarboard fs-4 text-white"></i>
                    <span className="text-white ps-2">Periodo académico</span>
                  </Link>
                </li>
                <Collapse in={openItems["academic-period"]}>
                  <div>
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "register-period"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="register-period"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("register-period")}
                        >
                          <i className="bi bi-calendar2-plus fs-4 text-white"></i>{" "}
                          <span className="text-white ps-2">
                            Registar periodo
                          </span>
                        </Link>
                      </li>
                    )}
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "edit-period"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="edit-period"
                          className="text-decoration-none px-4 py-2 d-block"
                          onClick={() => handleItemClick("edit-period")}
                        >
                          <i className="bi bi-calendar2-check fs-4 text-white"></i>{" "}
                          <span className="text-white ps-2">
                            Editar periodo
                          </span>
                        </Link>
                      </li>
                    )}
                  </div>
                </Collapse>
              </ul>
            )}

            <ul className="list-unstyled">
              <li className={activeItem === "reservations" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3  d-block"
                  onClick={() => handleItemClick("reservations")}
                >
                  <i className="bi bi-journal-bookmark fs-4 text-white"></i>
                  <span className="text-white ps-2">Reservas</span>
                </Link>
              </li>
              <Collapse in={openItems["reservations"]}>
                <div className="bg-dark rounded m-1 py-1">
                  {user === "user" && (
                    <li
                      className={
                        activeItem === "enviroment-request"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="enviroment-request"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-request")}
                      >
                        <i className="bi bi-bookmark-plus fs-4 text-white"></i>
                        <span className="text-white ps-2">
                          Nueva solicitud de reserva
                        </span>
                      </Link>
                    </li>
                  )}
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "request"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="request"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() => handleItemClick("request")}
                      >
                        <i className="bi bi-bookmark-plus fs-4 text-white"></i>
                        <span className="text-white ps-2">Nueva solicitud</span>
                      </Link>
                    </li>
                  )}
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "request-attention"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="attention-list"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() => handleItemClick("request-attention")}
                      >
                        <i className="bi bi-person-workspace fs-4 text-white"></i>
                        <span className="text-white ps-2">
                          Atender solicitudes pendientes
                        </span>
                      </Link>
                    </li>
                  )}
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "special-request-attention"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="special-attention-list"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() =>
                          handleItemClick("special-request-attention")
                        }
                      >
                        <i className="bi bi-clipboard-check fs-4 text-white"></i>
                        <span className="text-white ps-2">
                          Lista de reservas
                        </span>
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
                        className="text-decoration-none px-2 py-2 d-block text-white"
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
                        className="text-decoration-none px-2 py-2 d-block text-white"
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
                  className="text-decoration-none px-3 d-block "
                  onClick={() => handleItemClick("environments")}
                >
                  <i className="bi bi-clipboard-data fs-4 text-white"></i>
                  <span className="text-white ps-2">Uso de ambientes</span>
                </Link>
              </li>
              <Collapse in={openItems["environments"]}>
                <div
                  id="example-collapse-text"
                  className="bg-dark rounded m-1 py-1"
                >
                  <li
                    className={`list-unstyled  ${
                      activeItem === "disponibility" ? "active" : ""
                    }`}
                  >
                    <Link
                      to="environments-disponibility"
                      className="text-decoration-none px-2 py-2 d-block"
                      onClick={() => handleItemClick("disponibility")}
                    >
                      <i
                        className="bi bi-clock-history fs-4 text-white"
                        aria-hidden="true"
                      ></i>
                      <span className="ps-1 text-white">
                        Disponibilidad de ambientes
                      </span>
                    </Link>
                  </li>

                  <li
                    className={
                      activeItem === "statistics"
                        ? "active list-unstyled"
                        : "list-unstyled"
                    }
                  >
                    <Link
                      to="statistics-ambience"
                      className="text-decoration-none px-2 py-2 d-block"
                      onClick={() => handleItemClick("statistics")}
                    >
                      <i className="bi bi-graph-up fs-4 text-white"></i>
                      <span className="ps-1 text-white">
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
                      <i className="bi bi-houses fs-4 text-white"></i>
                      <span className="text-white ps-2">
                        Gestión de Ambiente
                      </span>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["management"]}>
                  <div className="bg-dark rounded m-1 py-1">
                    <li
                      className={
                        activeItem === "enviroment-register"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="environment-register"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-register")}
                      >
                        <div className="align-items-center text-white">
                          <i className="bi bi-house-add fs-4"></i> Registrar
                          Ambiente
                        </div>
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "edit-environment"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="edit-environment"
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("edit-environment")}
                      >
                        <i className="bi bi-house-gear fs-4"></i> Editar
                        ambiente
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "delete-environment"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="delete-environment"
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("delete-environment")}
                      >
                        <i className="bi bi-house-x fs-4"></i> Eliminar ambiente
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}

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
                    <div className="d-flex justify-content-start align-items-center ">
                      <i className="bi bi-building fs-4 text-white"></i>
                      <span className="ps-1 text-white">
                        Gestión de Bloques
                      </span>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["management-block"]}>
                  <div className="bg-dark rounded m-1 py-1">
                    <li
                      className={
                        activeItem === "block-register"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="block-register"
                        className="text-decoration-none px-2 py-2 d-block"
                        onClick={() => handleItemClick("block-register")}
                      >
                        <div className="align-items-center text-white">
                          <i className="bi bi-building-add fs-4"></i> Registrar
                          bloque
                        </div>
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "edit-block"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="edit-block"
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("edit-block")}
                      >
                        <i className="bi bi-building-gear fs-4"></i> Editar
                        bloque
                      </Link>
                    </li>
                    <li
                      className={
                        activeItem === "delete-block"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="delete-block"
                        className="text-decoration-none px-2 py-2 d-block text-white"
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
                    <div className="d-flex justify-content-start align-items-center ">
                      <i className=" bi-file-earmark-bar-graph fs-4  text-white"></i>
                      <span className="text-white ps-2">Reportes</span>
                    </div>
                  </Link>
                </li>
                <Collapse in={openItems["report"]}>
                  <div className="bg-dark rounded m-1 py-1">
                    <li
                      className={
                        activeItem === "generate-report"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="generate-report"
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("generate-report")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-file-earmark-spreadsheet fs-4"></i>
                          Generar Reporte
                        </div>
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
                  <i className="bi bi-bell fs-4  text-white"></i>
                  <span className="text-white ps-2">Notificaciones</span>
                </Link>
              </li>
              <Collapse in={openItems["notifications"]}>
                <div className="bg-dark rounded m-1 py-1">
                  {user === "superuser" && (
                    <li
                      className={
                        activeItem === "send-notification"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to="send-notification"
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("send-notification")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-send fs-4"></i> Crear notificación
                        </div>
                      </Link>
                    </li>
                  )}
                  <li
                    className={
                      activeItem === "notifications-list"
                        ? "active list-unstyled"
                        : "list-unstyled"
                    }
                  >
                    <Link
                      to="notifications-list"
                      className="text-decoration-none px-2 py-2 d-block text-white"
                      onClick={() => handleItemClick("notifications-list")}
                    >
                      <div className="align-items-center">
                        <i className="bi bi-inbox fs-4"></i> Ver notificationes
                      </div>
                    </Link>
                  </li>
                </div>
              </Collapse>
            </ul>
            {user === "superuser" && (
              <ul className="list-unstyled">
                <li className={activeItem === "subjects" ? "active" : ""}>
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("subjects")}
                  >
                    <i className="bi bi-journals fs-4  text-white"></i>
                    <span className="text-white ps-2">Materias</span>
                  </Link>
                </li>
                <Collapse in={openItems["subjects"]}>
                  <div className="bg-dark rounded">
                    {user === "superuser" && (
                      <li
                        className={
                          activeItem === "subjects-list"
                            ? "active list-unstyled"
                            : "list-unstyled"
                        }
                      >
                        <Link
                          to="subjects"
                          className="text-decoration-none px-2 py-2 d-block text-white"
                          onClick={() => handleItemClick("subjects-list")}
                        >
                          <div className="align-items-center">
                            <i className="bi bi-list fs-4"></i> Lista de
                            materias
                          </div>
                        </Link>
                      </li>
                    )}
                  </div>
                </Collapse>
              </ul>
            )}
            <ul className="list-unstyled">
              <li className={activeItem === "groups" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("groups")}
                >
                  <i className="bi bi-collection fs-4 text-white"></i>
                  <span className="text-white ps-2">Grupos</span>
                </Link>
              </li>
              <Collapse in={openItems["groups"]}>
                <div className="bg-dark rounded">
                  {/* {user === "superuser" && ( */}
                  <>
                    <li
                      className={
                        activeItem === "groups-list"
                          ? "active list-unstyled"
                          : "list-unstyled"
                      }
                    >
                      <Link
                        to={user === "superuser" ? "groups" : "groups-teacher"}
                        className="text-decoration-none px-2 py-2 d-block text-white"
                        onClick={() => handleItemClick("groups-list")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-list fs-4"></i> Lista de grupos
                        </div>
                      </Link>
                    </li>
                    {/* <li
                        className={
                          activeItem === "groups-history"
                            ? "active list-unstyled"
                            : "list-unstyled"
                        }
                      >
                        <Link
                          to="groups/history"
                          className="text-decoration-none px-2 py-2 d-block text-white"
                          onClick={() => handleItemClick("groups-history")}
                        >
                          <div className="align-items-center">
                            <i className="bi bi-clock-history fs-4"></i>
                            Historial de grupos
                          </div>
                        </Link>
                      </li> */}
                  </>
                  {/* )} */}
                </div>
              </Collapse>
            </ul>

            <ul className="list-unstyled">
              <li className={activeItem === "usuario" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("usuario")}
                >
                  <i className="bi bi-person-gear fs-4  text-white"></i>
                  <span className="text-white ps-2">Usuario</span>
                </Link>
              </li>
              <Collapse in={openItems["usuario"]}>
                <div>
                  {user === "superuser" && (
                    <>
                      <li
                        className={
                          activeItem === "register-user"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="register-user"
                          className="text-decoration-none px-4 py-2 d-block text-white"
                          onClick={() => handleItemClick("register-user")}
                        >
                          <div className="align-items-center">
                            <i className="bi bi-person-fill-add fs-4"></i> Crear
                            Usuario
                          </div>
                        </Link>
                      </li>
                      <li
                        className={
                          activeItem === "edit-rol"
                            ? "active list-unstyled px-2"
                            : "list-unstyled px-2"
                        }
                      >
                        <Link
                          to="edit-rol"
                          className="text-decoration-none px-4 py-2 d-block text-white"
                          onClick={() => handleItemClick("edit-rol")}
                        >
                          <div className="align-items-center">
                            <i className="bi bi-person-fill-add fs-4"></i>{" "}
                            Editar Rol
                          </div>
                        </Link>
                      </li>
                    </>
                  )}
                  <li
                    className={
                      activeItem === "information-user"
                        ? "active list-unstyled px-2"
                        : "list-unstyled px-2"
                    }
                  >
                    <Link
                      to="information-user"
                      className="text-decoration-none px-4 py-2 d-block text-white"
                      onClick={() => handleItemClick("information-user")}
                    >
                      <div className="align-items-center">
                        <i className="bi bi-person fs-4"></i> Perfil usuario
                      </div>
                    </Link>
                  </li>
                </div>
              </Collapse>
            </ul>
          </div>

          <div className="sidebar-footer">
            <div className="user-hover ">
              <OverlayTrigger
                className="p-3 mb-5 rounded"
                trigger="click"
                placement={popoverPlacement}
                overlay={popover}
                style={{ maxWidth: "40vh" }}
                rootClose
              >
                <div className="d-flex justify-content-around align-items-center px-3">
                  <img
                    style={{
                      borderRadius: "50%",
                      maxHeight: "50px",
                      maxWidth: "50px",
                    }}
                    src={`https://picsum.photos/id/${userInformation.person_id}/100/100`}
                    alt="icon"
                  />
                  <span className="text-truncate user-select-none w-40 text-white">
                    {userInformation.fullname}
                  </span>
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="menu-navbar p-3 d-md-none">
            <div className="d-flex justify-content-between d-md-none d-block">
              <button
                className="btn px-1 py-0 open-btn me-2"
                onClick={handleMenuOpen}
              >
                <i className="bi bi-list-nested text-white"></i>
              </button>
              <Link
                className="navbar-brand fs-4"
                to="#"
                onClick={() => {
                  handleItemClick("home");
                }}
              >
                <span className="px-2 py-0 text-white">SURA</span>
              </Link>
            </div>
          </div>
          <div
            className="dashboard-content scroll"
            style={{ background: "#ffffff" }}
          >
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
