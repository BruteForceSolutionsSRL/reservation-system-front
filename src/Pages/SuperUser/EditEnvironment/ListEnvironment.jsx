import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./EditEnvironment.css";

const ListEnvironment = ({ list, handleShowModal }) => {
  const [typeOptions, setTypeOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [status, setStatus] = useState([]);
  const url = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      await fetchBlockOptions();
      await fetchTypes();
      await statusTypes();
    };

    fetchData();
  }, []);

  const fetchBlockOptions = () => {
    fetch(url + "blocks")
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
    fetch(url + "classrooms/types")
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
    fetch(url + "classrooms/statuses")
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
        <div
          key={index}
          className="border border-dark rounded mt-2 mb-2 p-2"
          style={{ minWidth: "300px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="d-flex justify-content-between">
                  <div style={{ flex: "1" }}>
                    <div className="bold-text">Estado</div>
                    <div
                      className={
                        reservation.classroom_status_id === 1
                          ? "bg-green"
                          : "bg-red"
                      }
                    >
                      {showStatus(reservation.classroom_status_id)}
                    </div>
                    <div className="bold-text">Nombre</div>
                    <div>{reservation.classroom_name}</div>
                  </div>

                  <div
                    style={{
                      flex: "1",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <div className="bold-text">Bloque: </div>
                    <div>{showBlock(reservation.block_id)}</div>
                    <div className="bold-text">Tipo</div>
                    <div>{showType(reservation.classroom_type_id)}</div>
                  </div>

                  <div style={{ flex: "1" }}>
                    <div className="bold-text">Capacidad</div>
                    <div>{reservation.capacity}</div>
                    <div className="bold-text">Piso</div>
                    <div>{reservation.floor}</div>
                  </div>
                </div>
              </div>

              <div className="col-auto">
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
        </div>
      ))}
    </div>
  );
};

export default ListEnvironment;
