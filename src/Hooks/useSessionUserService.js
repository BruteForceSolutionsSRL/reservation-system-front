import { useAuth } from "../contexts/AuthProvider";

export function useSessionUserService() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_REACT_API_URL;

  const loginUser = async (email, password, abortController) => {
    let responseFetch = {};
    try {
      let response = await fetch(url + "login", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({ login: email, password: password }),
      });
      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        logout();
        return;
      }
      let data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: {
          message:
            "Ocurrio un error inesperado, intentelo nuevamente mas tarde.",
        },
      };
    }
    return responseFetch;
  };

  const logoutUser = async (abortController) => {
    let token = localStorage.getItem("token");
    let responseFetch = {};
    try {
      let response = await fetch(url + "logout", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.signal,
      });
      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        logout();
        return;
      }
      let data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: {
          message:
            "Ocurrio un error inesperado, intentelo nuevamente mas tarde.",
        },
      };
    }
    return responseFetch;
  };

  const tokenStatusUser = async (abortController) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      let response = await fetch(url + "token/status", {
        headers: {
          "Content-Type": "aplication/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.signal,
      });
      let data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: {
          message:
            "Ocurrio un error inesperado, intentelo nuevamente mas tarde.",
        },
      };
    }
    return responseFetch;
  };

  const tokenRefreshUser = async () => {};

  return { loginUser, logoutUser, tokenStatusUser };
}
