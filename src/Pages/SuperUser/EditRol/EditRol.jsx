import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "./EditRol.css";

export default function EditRol(props) {
  const { person_id, user_name, name, lastname, email, fullname, roles } =
    props;

  const [selectedRole, setSelectedRole] = useState(roles[0] || "");
  const [responseTitle, setResponseTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);

  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});

  const [showEditarRol, setShowEditarRol] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [samePerson, setSamePerson] = useState(false);

  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    setInitialFormData({
      person_id,
      user_name,
      name,
      lastname,
      email,
    });
    setFormData({
      person_id,
      user_name,
      name,
      lastname,
      email,
    });
  }, [person_id, user_name, name, lastname, email]);

  const handleClickEdit = () => {
    setSelectedRole(roles[0] || "");
    setShowModalInformacion(true);
    sameperson();
  };

  const handleClose = () => {
    setShowModalInformacion(false);
    handleCancelEdit();
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleAccept = async () => {
    setLoadingModal(true);

    const token = localStorage.getItem("token");
    const role_id = selectedRole === "DOCENTE" ? "2" : "1";

    try {
      const response = await fetch(`${URL}users/${person_id}/assignRoles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_ids: [role_id] }),
      });

      const responseData = await response.json();
      setResponseMessage(responseData.message);

      if (response.ok) {
        setResponseTitle("Éxito");
        setResponseMessage(
          responseData.message ||
            `El rol del usuario "${responseData.fullname}" se actualizó a: "${responseData.roles[0]}"`
        );
        setLoadingModal(false);
      } else {
        setResponseTitle(`Error ${response.status}`);
        console.error("Falló al actualizar el role:", responseData);
      }
    } catch (error) {
      setResponseMessage("Error al actualizar el rol.");
      setResponseTitle("Error");
      console.error("Error:", error);
      setLoadingModal(false);
    }

    setShowResponseModal(true);
  };

  const handleResponseModal = () => {
    setShowResponseModal(false);
    setShowEditarRol(false);
    window.location.reload();
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormData });
  };

  //la misma persona
  const sameperson = () => {
    let person = JSON.parse(localStorage.getItem("userInformation"));

    if (person.person_id === person_id) {
      setSamePerson(true);
    } else {
      setSamePerson(false);
    }
  };

  return (
    <>
      <div className="border border-dark rounded p-3 my-2">
        <Row>
          <Col lg>
            <b className="text-primary">NOMBRE:</b>
            <div>
              <span>{fullname}</span>
            </div>
          </Col>
          <Col>
            <b className="text-primary">ROL:</b>
            <div>
              <span>{roles.join(", ")}</span>
            </div>
          </Col>
          <Col lg className="align-self-center d-flex justify-content-end">
            <Button
              className="custom-button btn btn-primary custom-btn-primary-outline w-50"
              onClick={handleClickEdit}
            >
              Editar
            </Button>
          </Col>
        </Row>
      </div>
      {/* --- */}
      <Modal
        size="lg"
        show={showModalInformacion}
        onHide={handleClose}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Informacion de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="tag-container mb-3">
              <label className="tag-label">INFORMACIÓN BÁSICA</label>
              <div>
                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>ID: </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      value={formData.person_id || ""}
                      disabled
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Nombre: </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      value={formData.name || ""}
                      disabled
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Apellido: </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      value={formData.lastname || ""}
                      disabled
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col lg>
                    <Form.Label>Nombre de usuario: </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="input"
                      value={formData.user_name || ""}
                      disabled
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Label>Rol:</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="text"
                      className="text-truncate"
                      disabled
                      value={roles[0]}
                    />
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="primary"
                      className="btn btn-primary custom-btn-primary-outline w-10"
                      onClick={() => {
                        setShowEditarRol(true);
                      }}
                      disabled={samePerson}
                    >
                      Cambiar Rol
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="tag-container mb-3">
              <label className="tag-label">INFORMACIÓN DE CONTACTO</label>
              <div>
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Correo Principal</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      className="text-truncate"
                      type="email"
                      value={formData.email || ""}
                      disabled
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal editar rol */}

      <Modal
        show={showEditarRol}
        onHide={() => setShowEditarRol(false)}
        centered
        backdrop="static"
        dialogClassName="modal-innermost"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <b>ROL:</b>
            </Col>

            <Col>
              <div>
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
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {loadingModal && (
            <Spinner
              className="me-3"
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          )}

          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={handleAccept}
          >
            Cambiar
          </Button>
          <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={() => setShowEditarRol(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de respuesta del servidor */}
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{responseTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{responseMessage}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary custom-btn-primary-outline"
            variant="primary"
            onClick={handleResponseModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
