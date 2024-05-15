import React, { useState } from "react";
import { Calendar } from "primereact/calendar"; // yarn add primereact
import { Button, Col, Row } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";

import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function StatisticsAmbience() {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);
  // const cities = [
  //   { name: "New York", code: "NY" },
  //   { name: "Rome", code: "RM" },
  //   { name: "London", code: "LDN" },
  //   { name: "Istanbul", code: "IST" },
  //   { name: "Paris", code: "PRS" },
  // ];

  const cities = [
    { id: "1", name: "opcion 1" },
    { id: "2", name: "opcion 2" },
    { id: "3", name: "opcion 3" },
    { id: "4", name: "opcion 4" },
    { id: "5", name: "opcion 5" },
  ];

  const handleSelector = (event) => {
    const value = event.value;
    setSelectedCities(value);
    console.log(value);
  };

  return (
    <div>
      <div>
        <h1 className="text-center mb-4">Estadisicas de ambiente</h1>
      </div>

      <div className="search-cotainer mb-4">buscador</div>

      <div className="tag-container position-relative mb-3">
        <label className="tag-label">Nombre de aula</label>

        <div className="mb-3">
          <Row className="mt-3">
            <Col xs md="auto">
              <label className="total-requests mb-4"> Estado: Habilitado</label>
            </Col>
            <Col xs md="auto">
              <Row xs md="auto">
                <Col xs md="auto">
                  <label className="mb-3"> Inicio</label>
                  <Calendar
                    value={date1}
                    onChange={(e) => {
                      setDate1(e.value);
                      console.log(date1);
                    }}
                  />
                </Col>

                <Col xs="auto" md="auto">
                  <label className="mb-3"> Fin</label>
                  <Calendar
                    value={date2}
                    onChange={(e) => {
                      setDate2(e.value);
                      console.log(date2);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col className="justify-content-center" xs="auto" md="auto">
              <Button>Buscar por rango</Button>
            </Col>
          </Row>
          <Row className="justify-content-center mb-4" lg={2}>
            <MultiSelect
              value={selectedCities}
              onChange={handleSelector}
              options={cities}
              optionLabel="name"
              display="chip"
              placeholder="Select Cities"
              maxSelectedLabels={4}
              className="w-full md:w-20rem mt-3"
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
