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
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginRequest = async () => {
    setLoadingLogin(true);
    let { data, status } = await loginUser(email, password).finally(() =>
      setLoadingLogin(false)
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
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg bg-success-subtle"
      style={{ width: "100%", height: "100vh" }}
    >
      <div className="p-3 shadow p-3 mb-5 bg-light-subtle rounded">
        <h2 className="text-center pb-5 pt-2">Inicio de sesion</h2>

        {errorMessage && (
          <Alert variant={"danger"} className="">
            {errorMessage}
          </Alert>
        )}

        <div className="d-flex p-3 align-items-center">
          <b className="pe-2">Correo electronico</b>
          <input
            type="email"
            className="form-control flex-fill"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electronico"
          />
        </div>
        <div className="d-flex p-3 align-items-center">
          <b className="pe-3">Contraseña</b>
          <input
            type="password"
            className="form-control flex-fill"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
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
              <span role="status">Iniciando sesion, por favor, espere.</span>
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-center p-3">
            <button
              onClick={loginRequest}
              className="btn btn-primary flex-fill"
            >
              Iniciar sesion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
