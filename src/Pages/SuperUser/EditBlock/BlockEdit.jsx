import { Button } from "react-bootstrap";

const BlockEdit = ({ list, handleShowModal }) => {
  return (
    <div>
      {list.map((block, index) => (
        <div key={index} style={{ minWidth: "300px" }}>
          <div
            className="row border border-black rounded p-2 mb-2"
            style={{ minWidth: "400px" }}
          >
            <div className="col-sm-6">
              <div>
                <b className="col text-primary">ESTADO: </b>
                <b
                  className={`text-light rounded p-1 ${
                    parseInt(block.block_status_id) === 1
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {block.block_status_name}
                </b>
              </div>
              <div>
                <b className="text-primary">NOMBRE: </b>
                <b>{block.block_name}</b>
              </div>
            </div>
            <div className="col-sm-4">
              <div>
                <b className="text-primary">CANTIDAD DE AULAS: </b>
                <b>{block.block_maxclassrooms}</b>
              </div>
              <div>
                <b className="text-primary">NUMERO DE PISO: </b>
                <b>{block.block_maxfloor}</b>
              </div>
            </div>
            <div className="col-sm-2 align-self-center d-flex justify-content-end">
              <Button
                variant="primary"
                className="mt-1 custom-button"
                onClick={() => handleShowModal(block)}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockEdit;
