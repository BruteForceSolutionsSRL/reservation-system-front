import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthProvider";

export default function RecoverPassword() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const url = import.meta.env.VITE_REACT_API_URL;
  const [errMessage, setErrMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);

  const validateCode = async () => {
    const newAbortController = new AbortController();
    let responseFetch = {};
    await fetch(url + "auth/change/password", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "aplication/json",
      },
      signal: newAbortController.signal,
      body: JSON.stringify({
        new_password: newPassword,
        confirmation_password: confirmPassword,
      }),
    })
      .then((response) => {
        responseFetch.status = response.status;
        return response.json();
      })
      .then((data) => {
        responseFetch.data = data;
      })
      .catch((err) => {
        console.error(err);
        responseFetch = {
          status: 500,
          data: {
            message: "Ocurrio un error inesperado, intentelo nuevamente.",
          },
        };
      });
    return responseFetch;
  };

  const handleChangePassword = async () => {
    setLoadingChangePassword(true);
    const { status, data } = await validateCode().finally(() =>
      setLoadingChangePassword(false)
    );
    if (status >= 200 && status < 300) {
      setErrMessage("");
      const { access_token, person, refresh_token } = data;
      if (person.roles[0] === "DOCENTE") {
        login({ role: "user" });
        navigate("/user/home");
      } else if (person.roles[0] === "ENCARGADO") {
        login({ role: "superuser" });
        navigate("/superuser/home");
      }
      localStorage.setItem("token", access_token);
      localStorage.setItem("userInformation", JSON.stringify(person));
    } else {
      setErrMessage(data.message);
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="shadow p-3">
          <div className="p-3 text-center">
            <h2>Titulo</h2>
          </div>
          <div>
            <div>
              <div className="py-2 d-flex">
                <label>Nueva contrasenia: </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="py-2 d-flex">
                <label>Confirmar contrasenia: </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary w-100 my-2"
              onClick={handleChangePassword}
              disabled={
                !newPassword.trim() &&
                !confirmPassword.trim() &&
                newPassword !== "" &&
                confirmPassword !== ""
              }
            >
              Cambiar contraseña
            </button>
          </div>
          <div>
            {errMessage && <Alert variant={"danger"}>{errMessage}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
}
