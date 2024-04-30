import React from "react";
import Form from "react-bootstrap/Form";
import "./Blocks.css";

const BlocksName = ({ blocks }) => {
  return blocks.map(({ block_id, block_name }) => (
    <option key={block_id} value={block_id}>
      {block_name}
    </option>
  ));
};

export default function Blocks({ blocks }) {
  return (
    <>
      <div className="block-cm">
        <div className="block-cm-t">
          <h5>BLOQUE</h5>
        </div>
        <div>
          <Form.Select>
            <option key="default">Seleccione...</option>
            {BlocksName({ blocks })}
          </Form.Select>
        </div>
      </div>
    </>
  );
}
