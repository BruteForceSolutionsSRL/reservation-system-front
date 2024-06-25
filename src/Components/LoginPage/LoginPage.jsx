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
      className="d-flex justify-content-center align-items-center"
      style={{ width: "100%", height: "100vh" }}
    >
      <div className="p-3 border">
        <h2 className="text-center pb-3">Inicio de sesion</h2>

        {errorMessage && (
          <Alert variant={"danger"} className="">
            {errorMessage}
          </Alert>
        )}

        <div>
          <label>Correo electronico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electronico"
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </div>
        {loadingLogin ? (
          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span role="status">Iniciando sesion, por favor, espere.</span>
          </button>
        ) : (
          <button onClick={loginRequest}>Iniciar sesion</button>
        )}
        {/* <button onClick={handleLogin}>Iniciar sesion</button>
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden" role="status">
            Loading...
          </span>
        </button> */}
      </div>
    </div>
  );
};

export default LoginPage;
