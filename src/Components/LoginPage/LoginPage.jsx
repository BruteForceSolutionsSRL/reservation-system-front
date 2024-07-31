import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { Alert } from "react-bootstrap";
import { useSessionUserService } from "../../Hooks/useSessionUserService";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { loginUser } = useSessionUserService();
  const navigate = useNavigate();
  const [abortController, setAbortController] = useState(null);

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
        let { access_token, person } = data;
        if (person.roles[0] === "DOCENTE") {
          login({ role: "user" });
          navigate("/user/select-faculty");
        } else if (person.roles[0] === "ENCARGADO") {
          login({ role: "superuser" });
          navigate("/superuser/home");
        }
        localStorage.setItem("token", access_token);
        localStorage.setItem("userInformation", JSON.stringify(person));
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
      className="d-flex justify-content-center align-items-center bg bg-success-subtle all-color"
      style={{ width: "100%", height: "100vh" }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
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
