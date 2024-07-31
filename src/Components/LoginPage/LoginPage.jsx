import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { Alert, Modal } from "react-bootstrap";
import { useSessionUserService } from "../../Hooks/useSessionUserService";
import {useFetchService} from "../Hooks/useFetchService";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { loginUser } = useSessionUserService();
  const { postFetch } = useFetchService();
  const navigate = useNavigate();
  const [abortController, setAbortController] = useState(null);
  const [showModalRecoverP, setShowModalRecoverP] = useState(false);
  const [recoverPEmail, setRecoverPEmail] = useState("");
  const [errMessageRecoverPassword, setErrMessageRecoverPassword] = useState("");
  const [sendedEmailRecover,setSendedEmailRecover] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      if (savedUser.role === "user") {
        navigate("/user/home");
      } else if (savedUser.role === "superuser") {
        navigate("/superuser/home");
      }
    }
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginRequest = async () => {
    let newAbortController = new AbortController();
    setAbortController(newAbortController);
    setLoadingLogin(true);
    try {
      let { data, status } = await loginUser(
        email,
        password,
        newAbortController
      );
      if (status >= 200 && status < 300) {
        let { token, user } = data;
        if (user.roles[0] === "DOCENTE") {
          login({ role: "user" });
          navigate("/user/home");
        } else if (user.roles[0] === "ENCARGADO") {
          login({ role: "superuser" });
          navigate("/superuser/home");
        }
        localStorage.setItem("token", token);
        localStorage.setItem("userInformation", JSON.stringify(user));
        setErrorMessage("");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(
        "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  const sendRecoverPassword = async () => {
    const abortC = new AbortController();
    const {status, data} = await postFetch("auth/recover/password",{email: recoverPEmail}, abortC);
    if (status >= 200 && status < 300) {
      setSendedEmailRecover(true);
      setResponseMessage(data.message)
      setErrMessageRecoverPassword("")
    } else {
      setErrMessageRecoverPassword(data.message)
    }
  }

  const handleCloseModalRP = () => {
    setShowModalRecoverP(false);
    setSendedEmailRecover(false);
    setRecoverPEmail("");
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center bg bg-success-subtle all-color"
      style={{ width: "100%", height: "100vh" }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !showModalRecoverP) {
          loginRequest();
        }
      }}
    >
      <div
        className="p-3 shadow p-3 mb-5 bg-light-subtle rounded"
        style={{ width: "40%", minWidth: "280px" }}
      >
        <h1 className="text-center">Inicio de sesión</h1>
        <hr />
        {errorMessage && (
          <Alert variant={"danger"} className="">
            {errorMessage}
          </Alert>
        )}

        <div className=" align-items-center mt-1">
          <b className="">Usuario / Correo electrónico</b>
          <div className=" d-flex mt-2">
            <input
              type="email"
              className="form-control flex-fill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
            />

            <div className="input-group-text">
              <i className="bi bi-envelope"></i>
            </div>
          </div>
        </div>
        <div className="mt-2 ">
          <b className="">Contraseña</b>
          <div className="d-flex mt-2">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control flex-fill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <div
              className="input-group-text"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </div>
          </div>
        </div>
        <div
          className="btn btn-link"
          onClick={() => setShowModalRecoverP(true)}
        >
          <span>Recuperar contraseña</span>
        </div>
        {loadingLogin ? (
          <div className="d-flex justify-content-center p-3">
            <button
              className="btn btn-secondary flex-fill"
              type="button"
              disabled
            >
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
              <span className="p-2" role="status">
                Iniciando sesión, por favor, espere.
              </span>
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-center p-3">
            <button
              onClick={loginRequest}
              className="btn btn-primary flex-fill"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>

      <Modal
        show={showModalRecoverP}
        onHide={handleCloseModalRP}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{!sendedEmailRecover ? "Recuperar contraseña" : "Enviado"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!sendedEmailRecover ? 
            <>
              <p>Ingrese el correo para recuperar su contraseña.</p>
              <div>
                {errMessageRecoverPassword && (
                  <Alert variant={"danger"}>
                    {errMessageRecoverPassword}
                  </Alert>
                )}
              </div>
              <input
                type="email"
                className="form-control"
                value={recoverPEmail}
                placeholder="ejemplo@gmail.com"
                onChange={(e) => setRecoverPEmail(e.target.value)}
              />
            </> :
              <p>{responseMessage}</p>
          }
        </Modal.Body>
        <Modal.Footer>
          {sendedEmailRecover ? 
          <>
            <button
              className="btn btn-secondary"
              onClick={handleCloseModalRP}
            >
              Cerrar
            </button>
          </> : 
          <>
            <button
              className="btn btn-primary"
              onClick={sendRecoverPassword}
              disabled={!recoverPEmail.trim()}
            >
              Enviar
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCloseModalRP}
            >
              Cancelar
            </button>
          </>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;
