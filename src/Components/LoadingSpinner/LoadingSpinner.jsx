import { Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  /* 
    Este Spinner es un indicador de carga de una pagina, de listas, etc.
    Ocupandose todo el espacio del contenedor, colocandolo al centro del mismo.
    No esta pensado como un Spinner de un boton o que deba estar junto a contenido, 
    este Spinner esta pensado para estar como unico contenido en la pantalla, o en caso de ser 
    un contenedor grande.
  */

  return (
    <div className="h-100 text-center d-flex justify-content-center align-items-center">
      <div>
        <Spinner animation="border" variant="secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div>
          <span className="fs-2 ps-2">Cargando</span>
        </div>
      </div>
    </div>
  );
}
