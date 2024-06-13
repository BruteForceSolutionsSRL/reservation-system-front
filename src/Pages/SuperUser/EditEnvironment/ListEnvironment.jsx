import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./EditEnvironment.css";

const ListEnvironment = ({ list, handleShowModal }) => {
  return (
    <div>
      {list.map((reservation, index) => (
        <div key={index} style={{ minWidth: "300px" }}>
          <div
            className="row border border-black rounded p-2 mb-2"
            style={{ minWidth: "400px" }}
          >
            <div className="col-sm-4">
              <div>
                <b className="col text-primary">ESTADO: </b>
                <b
                  className={`text-light rounded p-1 ${
                    parseInt(reservation.classroom_status_id) === 1
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {reservation.classroom_status_name}
                </b>
              </div>
              <div>
                <b className="text-primary">NOMBRE: </b>
                <b>{reservation.classroom_name}</b>
              </div>
            </div>
            <div className="col-sm-4">
              <div>
                <b className="text-primary">BLOQUE: </b>
                <b>{reservation.block_name}</b>
              </div>
              <div>
                <b className="text-primary">TIPO: </b>
                <b>{reservation.classroom_type_name}</b>
              </div>
            </div>
            <div className="col-sm-2">
              <div>
                <b className="text-primary">CAPACIDAD: </b>
                <b>{reservation.capacity}</b>
              </div>
              <div>
                <b className="text-primary">PISO: </b>
                <b>{reservation.floor}</b>
              </div>
            </div>
            <div className="col-sm-2 align-self-center d-flex justify-content-end">
              <Button
                variant="primary"
                className="mt-1 custom-button"
                onClick={() => handleShowModal(reservation)}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListEnvironment;
