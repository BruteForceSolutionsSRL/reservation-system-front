import { useAuth } from "../../contexts/AuthProvider";

export function useSpecialRequestService() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_REACT_API_URL;

  const sendSpecialRequest = async (abortController, bodySpecialRequest) => {
    let responseFetch = {};
    let token = localStorage.getItem("token");
    try {
      const response = await fetch(url + "reservation/special", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.signal,
        body: JSON.stringify(bodySpecialRequest),
      });
      console.log(response);

      if (response.status === 401 || response.status === 403) {
        abortController.abort();
        logout();
        return;
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

  return { sendSpecialRequest };
}
