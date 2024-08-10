import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { editarRol } from "../../../services/teachers";
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
    onclose: () => {},
  });

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const onReaload = () => {
    setModalInfo({ ...modalInfo, show: false });
    window.location.reload();
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
          onclose: handleCloseModal,
        });
      } else {
        setModalInfo({
          show: true,
          title: "Registro Exitoso",
          message:
            data.message || "El usuario ha sido registrado exitosamente.",
          onclose: handleCloseModal,
        });
        const editarRolResponse = await editarRol(data.person.person_id);

        if (editarRolResponse.status === 200) {
          setModalInfo({
            show: true,
            title: "Éxito",
            message:
              editarRolResponse.message ||
              `El rol del usuario "${editarRolResponse.data.fullname}" se actualizo a: "${editarRolResponse.data.roles}"`,
            onclose: onReaload,
          });
        } else {
          console.error("Error de asignacion de rol:", editarRolResponse.data);
        }
      }
    } catch (error) {
      console.error("Error de registro:", error);
    }
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
                        top: "50%",
                        transform: "translateY(20%)",
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

        {/* <ServerMessageModal
          show={modalInfo.show}
          title={modalInfo.title}
          message={modalInfo.message}
          onClose={handleCloseModal}
        /> */}

        <ServerMessageModal
          show={modalInfo.show}
          title={modalInfo.title}
          message={modalInfo.message}
          onClose={modalInfo.onclose}
        />
      </Container>
    </>
  );
}

function ServerMessageModal({ show, title, message, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          className="custom-btn-gray-outline btn btn-secondary"
          variant="secondary"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
