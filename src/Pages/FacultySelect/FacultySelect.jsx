import { useEffect, useState } from "react";
import FacultyElement from "./FacultyElement";
import { useAuth } from "../../contexts/AuthProvider";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

export default function FacultySelect() {
  const { logout } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const api = import.meta.env.VITE_REACT_API_URL;
  const abortController = new AbortController();

  useEffect(() => {
    initFaculties();
  }, []);

  const initFaculties = async () => {
    const { status, data } = await fetchFaculties().finally(() =>
      setLoadingFaculties(false)
    );
    if (status >= 200 && status < 300) {
      setFaculties(data);
    } else if (
      (status >= 300 && status < 400) ||
      (status >= 400 && status < 500)
    ) {
      // Mostrar mensaje acorde al error.
      setFaculties([]);
    } else {
      // Error inesperado, mostra mensaje generico.
      setFaculties([]);
    }
  };

  const fetchFaculties = async () => {
    const token = localStorage.getItem("token");
    let responseFetch = {};
    await fetch(api + "faculties/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "aplication/json",
      },
      signal: abortController.signal,
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          abortController.abort();
          logout();
          return;
        }
        responseFetch.status = response.status;
        return response.json();
      })
      .then((data) => {
        responseFetch.data = data;
        return responseFetch;
      })
      .catch((err) => {
        console.error(err);
        responseFetch.status = 500;
        responseFetch.data.message =
          "Ocurrio un error, intentelo nuevamente mas tarde.";
      });
    return responseFetch;
  };
  return (
    <div
      className="container d-flex justify-content-center align-items-center w-100"
      style={{ height: "100vh" }}
    >
      <div className="p-3 shadow">
        {loadingFaculties ? (
          <LoadingSpinner />
        ) : (
          <>
            <h4 className="text-center py-3">Seleccione una facultad</h4>
            <div className="">
              {faculties.map((f) => {
                return (
                  <div key={f.faculty_id}>
                    <FacultyElement {...f} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
