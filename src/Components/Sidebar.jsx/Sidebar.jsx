import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ user }) {
  const [activeItem, setActiveItem] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <>
      <div className="main-container d-flex">
        <div className={`sidebar ${menuOpen ? "active" : ""}`} id="side_nav">
          <div className="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
            <h1 className="fs-4">
              <span className="text-black">Sistema de reservas FCyT</span>
            </h1>
            <button
              className="btn d-md-none d-block close-btn px-1 py-0 text-black"
              onClick={handleMenuClose}
            >
              <i className="fal fa-stream"></i>
            </button>
          </div>

          <ul className="list-unstyled px-2">
            <li className={activeItem === "home" ? "active" : ""}>
              <Link
                to="home"
                className="text-decoration-none px-3 py-2 d-block"
                onClick={() => handleItemClick("home")}
              >
                <i className="fal fa-home"></i> Pagina principal
              </Link>
            </li>
            <li className="list-unstyled px-2">
              <Link
                to="environments-disponibility"
                className="text-decoration-none px-3 py-2 d-block"
                onClick={() => handleItemClick("#")}
              >
                <i className="far fa-clock" aria-hidden="true"></i>{" "}
                Disponibilidad de ambientes
              </Link>
            </li>
            <li
              className={
                activeItem === "enviroment-request"
                  ? "active list-unstyled px-2"
                  : "list-unstyled px-2"
              }
            >
              {user === "user" ? (
                <Link
                  to={"enviroment-request"}
                  className="text-decoration-none px-3 py-2 d-block"
                  onClick={() => handleItemClick("#")}
                >
                  <i className="fal fa-plus"></i> Nueva solicitud de reserva
                </Link>
              ) : (
                ""
              )}
            </li>

            {/* si es super usuario crea el elemento en la lista */}
            {user === "superuser" ? (
              <li className="list-unstyled px-2">
                <Link
                  to={user === "superuser" ? "environment-register" : " "}
                  className="text-decoration-none px-3 py-2 d-block"
                  onClick={() => handleItemClick("#")}
                >
                  <i className="fa fa-list-alt"></i> Registrar Ambiente
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
          <ul className="list-unstyled px-2">
            <li className={activeItem === "reservations" ? "active" : ""}>
              <Link
                to="#"
                className="text-decoration-none px-3 py-2 d-block"
                onClick={() => handleItemClick("reservations")}
              >
                <i className="fas fa-clipboard-list"></i> Reservas
              </Link>
            </li>
            {user === "superuser" ? (
              <>
                <li className="list-unstyled px-2">
                  <Link
                    to={user === "superuser" ? "attention-list" : ""}
                    className="text-decoration-none px-3 py-2 d-block"
                    onClick={() => handleItemClick("#")}
                  >
                    <i className="fal fa-users"></i> Atender solicitudes
                    pendientes
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
            {user === "user" ? (
              <>
                <li className="list-unstyled px-2">
                  <Link
                    to={user === "user" ? "list-cancel" : ""}
                    className="text-decoration-none px-3 py-2 d-block"
                    onClick={() => handleItemClick("#")}
                  >
                    <i className="fal fa-users"></i> Lista de solicitudes
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
          <hr className="h-color mx-2" />
          <ul className="list-unstyled px-2">
            <li className="">
              <Link
                to="/"
                className="text-decoration-none px-3 py-2 d-block"
                onClick={() => handleItemClick("home")}
              >
                <i className="fas fa-sign-out-alt"></i> Cerrar sesion
              </Link>
            </li>
          </ul>
        </div>
        <div className="content">
          <nav className="navbar navbar-expand-md navbar-light bg-light">
            <div className="container-fluid">
              <div className="d-flex justify-content-between d-md-none d-block">
                <button
                  className="btn px-1 py-0 open-btn me-2"
                  onClick={handleMenuOpen}
                >
                  <i className="fal fa-stream"></i>
                </button>
                <Link
                  className="navbar-brand fs-4"
                  to="#"
                  onClick={() => handleItemClick("home")}
                >
                  <span className="px-2 py-0 text-black">FCyT</span>
                </Link>
              </div>
              <button
                className="navbar-toggler p-0 border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              ></button>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    {/* This is a photo, but for now it does nothing until we decide what to do */}
                    <b className="text-success me-5">
                      *MAGDA LENA PEETERS ILONAA,
                    </b>
                    {/* <Link className="nav-brand active" to="#">
                      <img
                        src="../../assets/img/people-icon.png"
                        alt="user-profile"
                        width="60px"
                      />
                    </Link> */}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/* Content container */}
          <div className="bg-white dashboard-content px-3 pt-4 scroll">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
