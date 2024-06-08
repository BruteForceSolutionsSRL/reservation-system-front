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

                <li className="">
                  <Link
                    to="statistics-ambience"
                    className="text-decoration-none px-3 py-2 d-block"
                    onClick={() => handleItemClick("#")}
                  >
                    <i className="fa fa-chart-line"></i> Estadistica de uso de
                    ambiente
                  </Link>
                </li>
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
                      <i className="bi bi-house-gear fs-6"></i> Editar ambiente
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
