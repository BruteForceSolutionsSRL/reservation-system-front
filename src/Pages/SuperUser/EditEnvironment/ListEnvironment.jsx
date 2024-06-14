import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./EditEnvironment.css";

const ListEnvironment = ({ list, handleShowModal }) => {
  const [typeOptions, setTypeOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [status, setStatus] = useState([]);
  const url = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    Promise.all([fetchBlockOptions(), fetchTypes(), statusTypes()]);
  }, []);

  const fetchBlockOptions = () => {
    let token = localStorage.getItem("token");
    fetch(url + "blocks", {
      headers: { Authorization: `Bearer ${token}` },
      mode: "no-cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setBlockOptions(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const fetchTypes = () => {
    let token = localStorage.getItem("token");
    fetch(url + "classrooms/types", {
      headers: { Authorization: `Bearer ${token}` },
      mode: "no-cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setTypeOptions(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  const statusTypes = () => {
    let token = localStorage.getItem("token");
    fetch(url + "classrooms/statuses", {
      headers: { Authorization: `Bearer ${token}` },
      mode: "no-cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const optionsWithDefault = [...data];
        setStatus(optionsWithDefault);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  };

  function showStatus(key) {
    const selectedElement = status.find(
      (elemento) => elemento.classroom_status_id === parseInt(key)
    );
    if (selectedElement) {
      return selectedElement.classroom_status_name;
    }
  }

  function showBlock(key) {
    const selectedElement = blockOptions.find(
      (elemento) => elemento.block_id === parseInt(key)
    );
    if (selectedElement) {
      return selectedElement.block_name;
    }
  }

  function showType(key) {
    const selectedElement = typeOptions.find(
      (elemento) => elemento.type_id === parseInt(key)
    );
    if (selectedElement) {
      return selectedElement.type_name;
    }
  }
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
                  {showStatus(reservation.classroom_status_id)}
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
                <b>{showBlock(reservation.block_id)}</b>
              </div>
              <div>
                <b className="text-primary">TIPO: </b>
                <b>{showType(reservation.classroom_type_id)}</b>
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
