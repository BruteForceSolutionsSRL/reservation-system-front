import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import "./InformationUser.css";
import { useState, useEffect } from "react";

export default function InformationUser() {
  const [showconfirmacionConctrasena, setShowconfirmacionConctrasena] =
    useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [changes, setChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [show, setShow] = useState(false);
  const [changesState, setChangesState] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showCambiar, setShowCambiar] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [confirmacionConctrasena, setConfirmacionContrasena] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const URL = import.meta.env.VITE_REACT_API_URL;

  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    nombreUsuario: "",
    "Correo Principal": "",
    Rol: "",
  });

  const [data, setData] = useState({});

  const updateData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const originalData1String = localStorage.getItem("userInformation");

      if (originalData1String) {
        const originalData1 = JSON.parse(originalData1String);

        const updatedData = {
          Nombre: originalData1.name,
          Apellido: originalData1.lastname,
          nombreUsuario: originalData1.user_name,
          "Correo Principal": originalData1.email,
          Rol: originalData1.roles[0],
        };

        setFormData(updatedData);
        setInitialFormData(updatedData);
      } else {
        console.log("Sin data.");
      }
    };

    fetchData();
  }, []);

  const handleCambiar = () => {
    setShowCambiar(true);
  };

  const togglePasswordVisibilityConfirmation = () => {
    setShowconfirmacionConctrasena(!showconfirmacionConctrasena);
  };

  const togglePasswordVisibilityNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const handleCloseCambiar = () => {
    setConfirmacionContrasena("");
    setContrasenaNueva("");
    setShowconfirmacionConctrasena(false);
    setShowPasswordNew(false);
    setShowAlert(false);
    setShowCambiar(false);
  };

  const handleSendCambiar = async () => {
    setShowAlert(false);
    setIsLoading(true);
    const passwords = {
      new_password: contrasenaNueva,
      confirmation_password: confirmacionConctrasena,
    };

    // 'new_password'
    // 'confirmation_password'
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(URL + "auth/change/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const result = await response.json();

      if (!response.ok) {
        setAlertMessage(
          result.message || "Error al validar la contraseña actual."
        );
        setIsLoading(false);

        setShowAlert(true);
      } else {
        setSuccessMessage(result.message || "Contraseña cambiada con éxito.");
        setShowSuccessModal(true);
        handleCloseCambiar();
        setIsLoading(false);
      }
    } catch (error) {
      setAlertMessage("Error de conexión con el servidor.");
      setShowAlert(true);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCancelEdit = () => {
    setFormData({ ...initialFormData });
    setChanges(false);
    setModifiedFields({});
  };

  const handleAcceptClick = () => {
    setLoadingModal(true);
    setTimeout(() => {
      setLoadingModal(false);
      setShow(false);
    }, 1000);

    updateUser(data);
  };

  const handleCancelClick = () => {
    setShow(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };
      const hasChanges = Object.keys(newFormData).some(
        (key) => newFormData[key] !== initialFormData[key]
      );
      setChanges(hasChanges);

      setModifiedFields((prevModifiedFields) => ({
        ...prevModifiedFields,
        [name]: value !== initialFormData[name],
      }));
      return newFormData;
    });
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    const detectedChanges = getChanges();

    setChangesState(detectedChanges);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setShow(true);
  };

  const getChanges = () => {
    const changes = {};

    if (formData.Nombre !== initialFormData.Nombre) {
      changes.Nombre = formData.Nombre;
      updateData("name", changes.Nombre);
    }

    if (formData.Apellido !== initialFormData.Apellido) {
      changes.Apellido = formData.Apellido;
      updateData("last_name", changes.Apellido);
    }

    if (formData.nombreUsuario !== initialFormData.nombreUsuario) {
      changes["Nombre de Usuario"] = formData.nombreUsuario;
      updateData("user_name", changes["Nombre de Usuario"]);
    }

    if (formData["Correo Principal"] !== initialFormData["Correo Principal"]) {
      changes["Correo Principal"] = formData["Correo Principal"];
      updateData("email", changes["Correo Principal"]);
    }

    return changes;
  };

  const updateUser = async (sendData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(URL + "users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sendData),
      });
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        setModalContent({
          title: "Éxito",
          message:
            data.message ?? "Información del usuario actualizada con éxito.",
        });
        const newUserInformation = JSON.stringify(data);
        localStorage.setItem("userInformation", newUserInformation);
      } else {
        setModalContent({
          title: "Error",
          message:
            data.message ?? "Error al actualizar la información del usuario.",
        });
      }
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Error de conexión con el servidor.",
      });
    }
    setShowResponseModal(true);
  };

  const handleOnClickRS = () => {
    if (modalContent.title === "Éxito") {
      setShowResponseModal(false);
      window.location.reload();
    } else {
      setShowResponseModal(false);
    }
  };

  return (
    <>
      <Container>
        <h1 className="text-center py-4">Información de Usuario</h1>
        <hr className="mb-4" />
        <div className="tag-container mb-3">
          <label className="tag-label">INFORMACIÓN BÁSICA</label>
          <div>
            <Row className="mb-2">
              <Col lg>
                <Form.Label>Nombre</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.Nombre ? "3px solid #00ff66" : "",
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col lg>
                <Form.Label>Apellido</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="Apellido"
                  value={formData.Apellido}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.Apellido ? "3px solid #00ff66" : "",
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col lg>
                <Form.Label>Nombre de usuario</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="input"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields.nombreUsuario
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg>
                <Form.Label>Contraseña</Form.Label>
              </Col>
              <Col md style={{ position: "relative" }}>
                <Button
                  className="btn btn-primary custom-btn-primary-outline"
                  onClick={handleCambiar}
                >
                  Cambiar Contraseña
                </Button>
              </Col>
            </Row>

            <Row>
              <Col lg>
                <Form.Label>Rol</Form.Label>
              </Col>
              <Col>
                <Form.Control type="text" disabled value={formData.Rol} />
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
                  type="email"
                  name="Correo Principal"
                  value={formData["Correo Principal"]}
                  onChange={handleInputChange}
                  style={{
                    border: modifiedFields["Correo Principal"]
                      ? "3px solid #00ff66"
                      : "",
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          {changes && (
            <>
              {isLoading && (
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
                variant="success"
                className="btn btn-success custom-btn-green-outline mx-2"
                onClick={handleSaveChanges}
              >
                Guardar cambios
              </Button>

              <Button
                variant="secondary"
                className="btn btn-secondary custom-btn-gray-outline"
                onClick={handleCancelEdit}
              >
                Cancelar Edición
              </Button>
            </>
          )}
        </div>
      </Container>
      <Modal show={show} centered onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Está seguro de continuar con los siguientes cambios:</div>
          <div className="mt-2">
            <ul>
              {Object.entries(changesState).map(([key, value]) => (
                <li key={key}>
                  <Alert variant="success">
                    <strong>{key}</strong>: {value}
                  </Alert>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {loadingModal ? <Spinner animation="border" /> : ""}

          <Button
            variant="primary"
            className="btn btn-primary custom-btn-primary-outline"
            onClick={handleAcceptClick}
            disabled={loadingModal}
          >
            Aceptar
          </Button>
          <Button
            variant="secondary"
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={handleCancelClick}
            disabled={loadingModal}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal de respuesta servidor */}
      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={handleOnClickRS}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal cambiar contraseña */}

      <Modal
        show={showCambiar}
        onHide={handleCloseCambiar}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          <Row className="mb-4">
            <Col style={{ position: "relative" }}>
              <Form.Control
                required
                className="text-truncate"
                type={showPasswordNew ? "text" : "password"}
                name="contrasenaNueva"
                placeholder="Contraseña Nueva"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
              />
              <i
                className={showPasswordNew ? "bi bi-eye-slash" : "bi bi-eye"}
                onClick={togglePasswordVisibilityNew}
                style={{
                  position: "absolute",
                  right: "25px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              ></i>
            </Col>
          </Row>
          <Row>
            <Col style={{ position: "relative" }}>
              <Form.Control
                required
                className="text-truncate"
                type={showconfirmacionConctrasena ? "text" : "password"}
                name="confirmationContrasena"
                placeholder="Confirmacion de Contraseña"
                value={confirmacionConctrasena}
                onChange={(e) => setConfirmacionContrasena(e.target.value)}
              />
              <i
                className={
                  showconfirmacionConctrasena ? "bi bi-eye-slash" : "bi bi-eye"
                }
                onClick={togglePasswordVisibilityConfirmation}
                style={{
                  position: "absolute",
                  right: "25px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              ></i>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {isLoading && (
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
            onClick={handleSendCambiar}
          >
            Cambiar
          </Button>
          <Button
            className="btn btn-secondary custom-btn-gray-outline"
            variant="secondary"
            onClick={handleCloseCambiar}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        show={showSuccessModal}
        onHide={handleCloseSuccessModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">{successMessage}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
