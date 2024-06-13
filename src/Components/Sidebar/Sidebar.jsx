import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import "./Sidebar.css";

export default function Sidebar({ user }) {
  const [activeItem, setActiveItem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});

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
    sessionStorage.removeItem("userloged");
    sessionStorage.removeItem("userInformation");
  };

  return (
    <>
      <div className="main-container d-flex">
        <div className={`sidebar ${menuOpen ? "active" : ""}`} id="side_nav">
          <div className="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
            <h1 className="fs-5">
              <span className="text-black">Sistema de reservas FCyT</span>
            </h1>
            <button
              className="btn d-md-none d-block close-btn px-1 py-0 text-black"
              onClick={handleMenuClose}
            >
              <i className="bi bi-list-nested"></i>
            </button>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "450px" }}>
            <ul className="list-unstyled px-2">
              <li className={activeItem === "home" ? "active" : ""}>
                <Link
                  to="home"
                  className="text-decoration-none px-3  d-block"
                  onClick={() => handleItemClick("home")}
                >
                  <i className="bi bi-house fs-6"></i> Página principal{" "}
                  <i className="bi bi-chevron-down"></i>
                </Link>
              </li>
              <Collapse in={openItems["home"]}>
                <div id="example-collapse-text">
                  <li
                    className={`list-unstyled px-2 ${
                      activeItem === "disponibility" ? "active" : ""
                    }`}
                  >
                    <Link
                      to="environments-disponibility"
                      className="text-decoration-none px-3 py-2 d-block"
                      onClick={() => handleItemClick("disponibility")}
                    >
                      <i
                        className="bi bi-clock-history fs-6"
                        aria-hidden="true"
                      ></i>{" "}
                      Disponibilidad de ambientes
                    </Link>
                  </li>
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-request")}
                      >
                        <i className="bi bi-journal-plus fs-6"></i> Nueva
                        solicitud de reserva
                      </Link>
                    </li>
                  )}

                  <li
                    className={
                      activeItem === "statistics"
                        ? "active list-unstyled px-2"
                        : "list-unstyled px-2"
                    }
                  >
                    <Link
                      to="statistics-ambience"
                      className="text-decoration-none px-3 py-2 d-block"
                      onClick={() => handleItemClick("statistics")}
                    >
                      <i className="bi bi-graph-up"></i> Estadistica de uso de
                      ambiente
                    </Link>
                  </li>
                </div>
              </Collapse>
            </ul>
            <ul className="list-unstyled px-2">
              <li className={activeItem === "reservations" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3  d-block"
                  onClick={() => handleItemClick("reservations")}
                >
                  <i className="bi bi-person-lines-fill fs-6"></i> Reservas{" "}
                  <i className="bi bi-chevron-down"></i>
                </Link>
              </li>
              <Collapse in={openItems["reservations"]}>
                <div>
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("request-attention")}
                      >
                        <i className="bi bi-person-workspace"></i> Atender
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("list-requests")}
                      >
                        <i className="bi bi-card-list"></i> Lista de solicitudes
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("request-history")}
                      >
                        <i className="bi bi-list-check"></i> Historial de
                        solicitudes
                      </Link>
                    </li>
                  )}
                </div>
              </Collapse>
            </ul>

            {user === "superuser" && (
              <ul className="list-unstyled px-2">
                <li className={activeItem === "management" ? "active" : ""}>
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("management")}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <i className="bi bi-houses fs-6"></i> Gestión de Ambiente
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("enviroment-register")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-house-add fs-6"></i> Registrar
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("edit-environment")}
                      >
                        <i className="bi bi-house-gear fs-6"></i> Editar
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("delete-environment")}
                      >
                        <i className="bi bi-house-x fs-6"></i> Eliminar ambiente
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}

            <ul className="list-unstyled px-2">
              <li className={activeItem === "notifications" ? "active" : ""}>
                <Link
                  to="#"
                  className="text-decoration-none px-3 d-block"
                  onClick={() => handleItemClick("notifications")}
                >
                  <i className="bi bi-bell fs-6"></i> Notificaciones
                  <i className="bi bi-chevron-down"></i>
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("send-notification")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-send"></i> Crear notificación
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("notifications-list")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-send"></i> Ver notificationes
                        </div>
                      </Link>
                    </li>
                  )}
                </div>
              </Collapse>
            </ul>

            {user === "superuser" && (
              <ul className="list-unstyled px-2">
                <li
                  className={activeItem === "management-block" ? "active" : ""}
                >
                  <Link
                    to="#"
                    className="text-decoration-none px-3 d-block"
                    onClick={() => handleItemClick("management-block")}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <i className="bi bi-building fs-6"></i> Gestión de Bloques
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("block-register")}
                      >
                        <div className="align-items-center">
                          <i className="bi bi-building-add fs-6"></i> Registrar
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("edit-block")}
                      >
                        <i className="bi bi-building-gear fs-6"></i> Editar
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
                        className="text-decoration-none px-3 py-2 d-block"
                        onClick={() => handleItemClick("delete-block")}
                      >
                        <i className="bi bi-building-x fs-6"></i> Eliminar
                        bloque
                      </Link>
                    </li>
                  </div>
                </Collapse>
              </ul>
            )}
          </div>

          <hr className="h-color mx-2" />
          <ul className="list-unstyled px-2">
            <li className="">
              <Link
                to="/"
                className="text-decoration-none px-3 py-2 d-block"
                onClick={() => {
                  logout();
                  handleItemClick("home");
                }}
              >
                <i className="bi bi-box-arrow-left"></i> Cerrar sesión
              </Link>
            </li>
          </ul>
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
                className="navbar-brand fs-6"
                to="#"
                onClick={() => {
                  handleItemClick("home");
                }}
              >
                <span className="px-2 py-0 text-black">FCyT</span>
              </Link>
            </div>
          </div>
          <div className="bg-white dashboard-content px-3 pt-4 scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
