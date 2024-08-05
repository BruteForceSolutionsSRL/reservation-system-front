import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";

export default function RegisterUser() {
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    secondName: "",
    lastName1: "",
    lastName2: "",
    password: "",
    userName: "",
  });

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, show: false });
    // window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, firstName, lastName1, password, userName } = form;

    const userData = {
      name: firstName,
      last_name: lastName1,
      user_name: userName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(URL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        setModalInfo({
          show: true,
          title: "Error de Registro",
          message: data.message,
        });
        // throw new Error("Registration failed");
      } else {
        setModalInfo({
          show: true,
          title: "Registro Exitoso",
          message:
            data.message || "El usuario ha sido registrado exitosamente.",
        });

        //show editar
      }

      //   const data = await response.json();
      //   setModalInfo({
      //     show: true,
      //     title: "Registro Exitoso",
      //     message: data.message || "El usuario ha sido registrado exitosamente.",
      //   });
      console.log("Registration successful:", data);
      //   setNewUser(data);
      setNewUser(data.person.person_id);
      //   console.log(data.person.person_id);
      if (newUser) {
        editRol(data.person.person_id);
      }
    } catch (error) {
      setModalInfo({
        show: true,
        title: "Error de Registro",
        message: response.message,
      });
      console.error("Registration error:", error);
    }
  };

  const editRol = async (personID) => {
    const token = localStorage.getItem("token");
    // const url = ;

    const role_id = selectedRole === "DOCENTE" ? "1" : "2";
    // console.log(role_id, person_id);

    try {
      const response = await fetch(URL + `/users/${personID}/assignRoles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_ids: [role_id] }),
      });

      const responseData = await response.json();

      //   setModalInfo({
      //     show: true,
      //     title: "Error de Registro",
      //     message: responseData.message,
      //   });
      //   setResponseMessage(responseData.message);

      if (response.ok) {
        setModalInfo({
          show: true,
          title: "Éxito",
          message: responseData.message,
        });
        // setResponseTitle("Éxito");
        // console.log("Rol actualizado:", responseData);
      } else {
        setModalInfo({
          show: true,
          title: `Error ${response.status}`,
          message: responseData.message,
        });
        // setResponseTitle(`Error ${response.status}`);
        // console.error("Failed to update role");
        // console.log(props);
      }
    } catch (error) {
      setModalInfo({
        show: true,
        title: "Error",
        message: "Error al actualizar el rol.",
      });

      //   setResponseMessage("Error al actualizar el rol.");
      //   setResponseTitle("Error");
      //   console.error("Error:", error);
      //   console.log(props);
    }

    setShowModal(false);
    setShowResponseModal(true);
  };

  const handleClose = () => setShowModal(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container>
        <h1 className="text-center py-4">Registro de Usuario</h1>
        <hr className="mb-4" />

        <Form onSubmit={handleSubmit}>
          <div className="tag-container mb-3">
            <label className="tag-label">INFORMACIÓN BÁSICA</label>
            <div>
              <Form.Group controlId="formFirstName">
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Nombre(s)</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="INGRESE NOMBRE DE USUARIO"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="formLastName1">
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Apellido(s)</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="lastName1"
                      placeholder="INGRESE APELLIDO DE USUARIO"
                      value={form.lastName1}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
            </div>
          </div>
          <div className="tag-container mb-3">
            <label className="tag-label">INFORMACIÓN DE CONTACTO</label>
            <div>
              <Form.Group controlId="formEmail">
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Email</Form.Label>
                  </Col>

                  <Col>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="INGRESE CORREO DE USUARIO"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
            </div>
          </div>
          <div className="tag-container mb-3">
            <label className="tag-label">INFORMACIÓN DE INICIO DE SESIÓN</label>
            <div>
              <Form.Group controlId="formUserName">
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Nombre de Usuario</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="userName"
                      placeholder="INGRESE ALIAS DE USUARIO"
                      value={form.userName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Contraseña</Form.Label>
                  </Col>

                  <Col>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="INGRESE CONTRASEÑA DE USUARIO"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <i
                      className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "35px",
                        top: "65%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    ></i>
                  </Col>
                </Row>
              </Form.Group>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button
              className="custom-btn-green custom-btn-green-outline btn btn-success w-25"
              variant="success"
              type="submit"
            >
              Registrar
            </Button>
          </div>
        </Form>

        <ServerMessageModal
          show={modalInfo.show}
          title={modalInfo.title}
          message={modalInfo.message}
          onClose={handleCloseModal}
        />

        <ServerMessageModal
          show={modalInfo.show}
          title={modalInfo.title}
          message={modalInfo.message}
          onClose={handleCloseModal}
        />

        <Modal
          show={showModal}
          // onHide={handleClose}
          centered
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>Editar Rol</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div>
              <b>Rol:</b>
              {["DOCENTE", "ENCARGADO"].map((roleOption) => (
                <div className="form-check" key={roleOption}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="roleOptions"
                    id={`${roleOption}Option`}
                    value={roleOption}
                    checked={selectedRole === roleOption}
                    onChange={handleRoleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${roleOption}Option`}
                  >
                    {roleOption}
                  </label>
                </div>
              ))}
            </div> */}
          </Modal.Body>

          <Modal.Footer>
            {/* <Button
              className="btn btn-primary custom-btn-primary-outline"
              variant="primary"
              onClick={handleAccept}
            >
              Aceptar
            </Button>
            <Button
              className="btn btn-secondary custom-btn-gray-outline"
              variant="secondary"
              onClick={handleClose}
            >
              Cerrar
            </Button> */}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

function ServerMessageModal({ show, title, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
