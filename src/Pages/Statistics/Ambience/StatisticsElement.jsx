import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { getDataPerRange } from "../../../services/statistics";
import { Alert } from "react-bootstrap";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsElement(props) {
  const { classroom_name, classroom_status_name, classroom_id } = props;

  // Chart data
  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  // Reason table.
  const [tableData, setTableData] = useState([]);

  // Doughnut graph
  const [labelsDougnot, setLabelsDougnot] = useState([]);
  const [dataDounot, setDataDounot] = useState([]);

  // Start and end selectors
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const handleSearchByRange = async () => {
    const dataBody = {
      classroom_id: classroom_id,
      date_start: startDate,
      date_end: endDate,
    };
    const response = await getDataPerRange(dataBody);
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      processChartData(response.data);
      setErrors({ show: false, message: response.data.message });
    } else if (response.status >= 400 && response.status < 500) {
      setErrors({ show: true, message: response.data.message });
      processChartData([]);
    } else if (response.status >= 500) {
      processChartData([]);
      setErrors({ show: true, message: response.data.message });
    }
  };

  const processChartData = (stats) => {
    const dates = stats.chart.map((entry) => entry.date);
    const accepted = stats.chart.map((entry) => entry.accepted);
    const rejected = stats.chart.map((entry) => entry.rejected);
    const pending = stats.chart.map((entry) => entry.pending);
    const cancelled = stats.chart.map((entry) => entry.cancelled);

    setTableData(stats.table);
    setEtiquetas(dates);
    setAcceptedData(accepted);
    setRejectedData(rejected);
    setPendingData(pending);
    setCancelledData(cancelled);
    setLabelsDougnot(
      stats.table.map(({ reservation_reason_name }) => reservation_reason_name)
    );
    setDataDounot(
      stats.table.map(({ total_reservations }) => total_reservations)
    );
  };

  const dataDoughnut = {
    labels: labelsDougnot,
    datasets: [
      {
        data: dataDounot,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(0, 255, 0)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const optionsDoughnut = {
    type: "doughnut",
    data: dataDoughnut,
  };

  const optionsLine = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Reservas realizadas por fecha",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const dataLine = {
    labels: etiquetas,
    datasets: [
      {
        label: "Aceptados",
        data: acceptedData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Cancelados",
        data: cancelledData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Rechazados",
        data: rejectedData,
        borderColor: "rgba(54, 500, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Pendientes",
        data: pendingData,
        borderColor: "rgba(300, 100, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  return (
    <Container className="tag-container position-relative mb-5">
      <Card className="p-4 mb-4">
        <Card.Header className="bg-primary text-white">
          <h4>{classroom_name}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col xs md="auto">
              <Form.Label className="font-weight-bold">
                Estado:{" "}
                <span className="text-success">{classroom_status_name}</span>
              </Form.Label>
            </Col>
            <Col xs="auto" md="3">
              <Form.Group>
                <Form.Label>Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate ?? ""}
                  min="2024-03-01"
                  max="2024-07-01"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs="auto" md="3">
              <Form.Group>
                <Form.Label>Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate ?? ""}
                  min="2024-03-01"
                  max="2024-07-01"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs="auto" md="auto">
              <Button variant="primary " onClick={handleSearchByRange}>
                Buscar por rango
              </Button>
            </Col>
          </Row>

          {errors.show && (
            <Alert variant={"warning"} className="text-center">
              {errors.message}
            </Alert>
          )}
        </Card.Body>
      </Card>
      <Row className="justify-content-center mb-4">
        <Col md={3} className="mb-4">
          <Card>
            <Card.Body>
              <Doughnut options={optionsDoughnut} data={dataDoughnut} />
              <Card.Title className="text-center mt-3">Motivos</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Motivo</th>
                    <th>Cantidad</th>
                    <th>Cantidad de Estudiantes</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.reservation_reason_id}>
                      <td>{row.reservation_reason_name}</td>
                      <td>{row.total_reservations}</td>
                      <td>{row.average_students}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h5 className="mt-3">
                Total de solicitudes:{" "}
                {tableData.reduce(
                  (total, row) => total + row.total_reservations,
                  0
                )}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} className="mb-4">
          <Card style={{ height: "325px" }}>
            <Card.Body>
              <Line data={dataLine} options={optionsLine} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
