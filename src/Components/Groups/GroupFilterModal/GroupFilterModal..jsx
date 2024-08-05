import { OverlayTrigger, Popover } from "react-bootstrap";

export default function GroupFilterModal() {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div>
          <h6>Filtrar por:</h6>
          <hr />
          <div>
            <strong>Filtrar por:</strong>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger
      trigger="click"
      placement="auto"
      overlay={popover}
      rootClose
    >
      <button className="btn">
        <i className="bi bi-filter fs-3 d-block"></i>
        <span>Filtrar</span>
      </button>
    </OverlayTrigger>
  );
}
