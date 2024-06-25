import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { loginUser } from "../../services/login";
import { Alert } from "react-bootstrap";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const loginRequest = async () => {
    setLoadingLogin(true);
    try {
      let { data, status } = await loginUser(email, password);
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

  return (
    <div
      className="d-flex justify-content-center align-items-center bg bg-success-subtle"
      style={{ width: "100%", height: "100vh" }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          loginRequest();
        }
      }}
    >
      <div className="p-3 shadow p-3 mb-5 bg-light-subtle rounded">
        <h1 className="text-center">Inicio de sesión</h1>
        <hr />
        {errorMessage && (
          <Alert variant={"danger"} className="">
            {errorMessage}
          </Alert>
        )}

        <div className="d-flex p-3 align-items-center">
          <b className="pe-2">Correo electrónico</b>
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
        <div className="d-flex p-3 align-items-center">
          <b className="pe-3">Contraseña</b>
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
        <hr />
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
    </div>
  );
};

export default LoginPage;
