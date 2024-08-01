/*
 * 1. Requires an abort controller for cancel request for error or any same reason.
 * 2. When any error appear, the user is logged out and the request is aborted/canceled, the
 *    errors status are 401, 403 for now.
 */

import { useAuth } from "../../contexts/AuthProvider";

export function useFetchService() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_REACT_API_URL;

  const getFetch = async (
    endpoint,
    abortController = new AbortController()
  ) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
      });
      if (!continueFetch(response.status)) {
        abortController.abort();
        logout();
        return { status: response.status, data: { message: "Fetch aborted." } };
      }

      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: { message: "Ocurrio un error inesperado, intentelo nuevamente." },
      };
    }
    return responseFetch;
  };

  const postFetch = async (
    endpoint,
    postBody = {},
    abortController = new AbortController()
  ) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify(postBody),
      });

      if (!continueFetch(response.status)) {
        abortController.abort();
        logout();
        return { status: response.status, data: { message: "Fetch aborted." } };
      }

      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: { message: "Ocurrio un error inesperado, intentelo nuevamente." },
      };
    }
    return responseFetch;
  };
  const putFetch = async (
    endpoint,
    putBody = {},
    abortController = new AbortController()
  ) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify(putBody),
      });

      if (!continueFetch(response.status)) {
        abortController.abort();
        logout();
        return { status: response.status, data: { message: "Fetch aborted." } };
      }

      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: { message: "Ocurrio un error inesperado, intentelo nuevamente." },
      };
    }
    return responseFetch;
  };
  const deleteFetch = async (
    endpoint,
    deleteBody = {},
    abortController = new AbortController()
  ) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify(deleteBody),
      });

      if (!continueFetch(response.status)) {
        abortController.abort();
        logout();
        return { status: response.status, data: { message: "Fetch aborted." } };
      }

      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: { message: "Ocurrio un error inesperado, intentelo nuevamente." },
      };
    }
    return responseFetch;
  };
  const patchFetch = async (
    endpoint,
    patchBody = {},
    abortController = new AbortController()
  ) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "aplication/json",
        },
        signal: abortController.signal,
        body: JSON.stringify(patchBody),
      });

      if (!continueFetch(response.status)) {
        abortController.abort();
        logout();
        return { status: response.status, data: { message: "Fetch aborted." } };
      }

      const data = await response.json();
      responseFetch = { status: response.status, data: data };
    } catch (error) {
      console.log(error);
      responseFetch = {
        status: 500,
        data: { message: "Ocurrio un error inesperado, intentelo nuevamente." },
      };
    }
    return responseFetch;
  };

  const continueFetch = (status) => {
    let flag = true;
    if (status === 401 || status === 403) {
      flag = false;
      alert("Sesion terminada, redireccionando a la pagina principal.");
    }
    return flag;
  };

  return {
    getFetch,
    postFetch,
    putFetch,
    deleteFetch,
    patchFetch,
  };
}
