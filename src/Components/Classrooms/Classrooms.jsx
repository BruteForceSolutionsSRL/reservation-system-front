import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import "./Classrooms.css";

const BlocksSelect = (blocks) => (
 
  <Form.Group>
		<option value="">Seleccione...</option>
    {blocks.map((block_id, block_name) => (
      <option key={block_id} value={block_id}>
        {block_name}
      </option>
    ))}
  </Form.Group>
);

export default function Classrooms({ blocks, classrooms }) {
  return (
    <>
      <div className="ubicacion-container position-relative mb-3">
        <label className="ubicacion-label">AMBIENTE</label>
        <Container>
          <Row className="mb-3">
            <Col xs={12} md={4}>
              {BlocksSelect(blocks)}
            </Col>
          </Row>
          <Row></Row>
        </Container>
      </div>
    </>
  );
}
