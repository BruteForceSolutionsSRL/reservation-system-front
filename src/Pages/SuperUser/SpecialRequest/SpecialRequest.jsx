import { useEffect, useState } from "react";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { useTimeSlotsService } from "../../../Components/Hooks/useTimeSlotsService";
import { useReasonsRequestService } from "../../../Components/Hooks/useReasonsRequestService";
import { useBlockService } from "../../../Components/Hooks/useBlocksService";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import Select from "react-select";
import { Alert, Collapse, Modal } from "react-bootstrap";
import { useFetchService } from "../../../Components/Hooks/useFetchService";

export default function SpecialRequest() {
  const [loadingPage, setLoadingPage] = useState(true);
  const { getTimeSlots } = useTimeSlotsService();
  const { getReasons } = useReasonsRequestService();
  const { getBlocks } = useBlockService();
  const { getFetch, postFetch } = useFetchService();
  const [dates, setDates] = useState(null);
  const [abortController, setAbortController] = useState([]);

  const [allBlocksList, setAllBlocksList] = useState([]);
  const [blocksOptions, setBlockOptions] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);

  const [allowClassroomsSelect, setAllowClassroomsSelect] = useState(false);

  const [allClassroomsList, setAllClassroomsList] = useState([]);
  const [classroomsOptions, setClassroomsOptions] = useState([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);

  const [quantity, setQuantity] = useState("");
  const [errorMessageQuantity, setErrorMessageQuantity] = useState("");

  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(0);

  const [timeSlots, setTimeSlots] = useState([]);
  const [startTimeSlot, setStartTimeSlot] = useState([]);
  const [endTimeSlot, setEndTimeSlot] = useState([]);
  const [selectedStartSlot, setSelectedStartSlot] = useState(-1);
  const [selectedEndSlot, setSelectedEndSlot] = useState(-1);

  const [description, setDescription] = useState("");

  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    Promise.all([fetchTimeSlots(), fetchReasons(), fetchBlocks()]).finally(() =>
      setLoadingPage(false)
    );
    return () => {
      abortController.forEach((controller) => controller.abort());
    };
  }, []);

  useEffect(() => {
    formCompleted();
  }, [
    selectedBlocks,
    quantity,
    selectedEndSlot,
    selectedReason,
    selectedStartSlot,
    description,
    dates,
  ]);

  const createAbortController = () => {
    const abortController = new AbortController();
    setAbortController((prevControllers) => [
      ...prevControllers,
      abortController,
    ]);
    return abortController;
  };

  const fetchTimeSlots = async () => {
    const newAbortController = createAbortController();
    let { status, data } = await getTimeSlots(newAbortController);
    if (status >= 200 && status < 300) {
      let startSlots = data.slice(0, -1);
      let endSlots = data.slice(1);
      setTimeSlots(data);
      setStartTimeSlot(startSlots);
      setEndTimeSlot(endSlots);
      setSelectedStartSlot(startSlots[0].time_slot_id);
      setSelectedEndSlot(endSlots[endSlots.length - 1].time_slot_id);
    } else {
      setTimeSlots([]);
    }
  };

  const fetchReasons = async () => {
    const newAbortController = createAbortController();
    let { status, data } = await getReasons(newAbortController);
    if (status >= 200 && status < 300) {
      setReasons(data);
      setSelectedReason(data[0].reason_id);
    } else {
      setReasons([]);
    }
  };

  const fetchBlocks = async () => {
    const newAbortController = createAbortController();
    let { status, data } = await getBlocks(newAbortController);
    if (status >= 200 && status < 300) {
      setAllBlocksList(data);
      formatOptions(data, "blocks");
    } else {
      setAllBlocksList([]);
    }
  };

  const formatOptions = (list, format) => {
    const options = [...list];
    switch (format) {
      case "blocks":
        let formatedBlocks = options.map((block) => {
          return {
            value: block,
            label: block.block_name,
          };
        });
        setBlockOptions(formatedBlocks);
        break;
      case "classrooms":
        let totalClassrooms = [];
        options.map((block) => {
          block.map((classroom) => {
            return (totalClassrooms = [
              ...totalClassrooms,
              {
                value: classroom.classroom_id,
                label: classroom.classroom_name,
              },
            ]);
          });
        });
        setClassroomsOptions(totalClassrooms);
        break;
    }
  };

  const handleChangeBlocks = (event) => {
    setSelectedBlocks(event);
    setSelectedClassrooms([]);
    if (event.length === 0) {
      setSelectedClassrooms([]);
      setClassroomsOptions([]);
    }
    if (allowClassroomsSelect) {
      classByBlock(event);
    }
  };

  const classByBlock = (list) => {
    let classroomsByBlocks = [];
    list.map(async (block) => {
      let response = await fetchClassroomsByBlock(block.value.block_id);
      classroomsByBlocks = [...classroomsByBlocks, response];
      formatOptions(classroomsByBlocks, "classrooms");
    });
  };

  const fetchClassroomsByBlock = async (block_id) => {
    let newAbortController = createAbortController();
    let { status, data } = await getFetch(
      `classrooms/block/${block_id}`,
      newAbortController
    );
    if (status >= 200 && status < 300) {
      return data;
    } else {
      return [];
    }
  };

  const handleChangeDate = (value) => {
    setDates(value);
  };

  const formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  };

  const formCompleted = () => {
    let flag = true;
    if (
      !selectedBlocks ||
      !selectedStartSlot ||
      !selectedEndSlot ||
      !selectedReason ||
      !description.trim() ||
      !quantity.trim() ||
      quantity < 25 ||
      quantity > 5000 ||
      dates.length === 0 ||
      !dates[0] ||
      !dates[1]
    ) {
      flag = false;
    }
    setCompleted(flag);
  };

  const handleSendRequest = async () => {
    let newAbortController = createAbortController();
    let request = {
      quantity: quantity,
      date_start: formatDate(dates[0]),
      date_end: formatDate(dates[1]),
      reason_id: selectedReason,
      observation: description,
      classroom_id: selectedClassrooms.map(({ value }) => value),
      time_slot_id: [selectedStartSlot, selectedEndSlot],
      block_id: selectedBlocks.map((block) => {
        return block.value.block_id;
      }),
    };

    let { status, data } = await postFetch(
      "reservations/special",
      request,
      newAbortController
    );
    if (status == 200) {
      if (
        data.message ===
        "Se realizo la reserva de tipo especial de manera correcta, para ver mas detalles revisar en el historial de solicitudes."
      ) {
        setModalContent({ title: "Reservado", body: data.message });
        setShowModal(true);
      } else if (
        data.message ===
        "No se puede realizar la reserva de tipo especial, dado que existen ambientes ya ocupados con otra actividad de reserva especial, por favor intente con otra fecha/periodos."
      ) {
        setModalContent({
          title: "¡Error!",
          body: data.message,
        });
        setShowModal(true);
      }
    } else {
      setModalContent({
        title: "¡Error!",
        body: "Ocurrio un error inesperado, intentelo nuevamente.",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="container mt-2">
      {loadingPage ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <div className="">
          <div className="pt-2 pb-4">
            <h1 className="text-center">Nueva solicitud de reserva</h1>
          </div>
          <div className="d-flex align-items-center">
            <b className="pe-2">BLOQUES</b>
            <Select
              className="flex-fill"
              isMulti
              options={blocksOptions}
              onChange={(e) => handleChangeBlocks(e)}
              value={selectedBlocks}
              noOptionsMessage={() => "Todas las opciones fueron seleccionadas"}
              placeholder="Seleccione almenos un bloque a la solicitud."
              closeMenuOnSelect={false}
            />
          </div>

          <div className="py-2">
            <div
              onClick={() => setAllowClassroomsSelect(!allowClassroomsSelect)}
            >
              <Checkbox
                onChange={(e) => {
                  setAllowClassroomsSelect(e.checked);
                  classByBlock(selectedBlocks);
                }}
                checked={allowClassroomsSelect}
              ></Checkbox>
              <i className="ps-2 text-secondary">
                (Opcional) ¿Agregar ambientes a la solicitud?, al no seleccionar
                ningun aula, se seleccionará automaticamente todas las aulas
                dentro de los bloques seleccionados
              </i>
            </div>

            <Collapse in={allowClassroomsSelect}>
              <div className="row">
                <div className="col-md-9 d-flex align-items-center py-2">
                  <b className="pe-2">AULAS</b>
                  <Select
                    isMulti
                    className="flex-fill"
                    options={classroomsOptions}
                    onChange={(e) => setSelectedClassrooms(e)}
                    value={selectedClassrooms}
                    noOptionsMessage={() =>
                      "Todas las opciones fueron seleccionadas"
                    }
                    placeholder="Seleccionar aulas para la solicitud."
                    closeMenuOnSelect={false}
                  />
                </div>
              </div>
            </Collapse>
          </div>

          <div className="py-2">
            <div className="row">
              <div className="col-lg-6 py-2 d-flex align-items-center">
                <b>PERIODOS ACADEMICOS: </b>
                <div className="d-flex flex-fill">
                  <select
                    className="mx-2 form-select"
                    value={selectedStartSlot}
                    onChange={(e) => {
                      setSelectedStartSlot(e.target.value);
                      let index = timeSlots.findIndex(
                        ({ time_slot_id }) =>
                          time_slot_id === Number(e.target.value)
                      );

                      let endSlots = timeSlots.slice(index + 1);
                      setEndTimeSlot(endSlots);
                      setSelectedEndSlot(endSlots[0]);
                    }}
                  >
                    {startTimeSlot.map((slot) => {
                      return (
                        <option
                          key={slot.time_slot_id}
                          value={slot.time_slot_id}
                        >
                          {slot.time}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    className="mx-2 form-select"
                    value={selectedEndSlot}
                    onChange={(event) => {
                      setSelectedEndSlot(event.target.value);
                    }}
                  >
                    {endTimeSlot &&
                      endTimeSlot.map((slot) => {
                        return (
                          <option
                            key={slot.time_slot_id}
                            value={slot.time_slot_id}
                          >
                            {slot.time}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="col-lg-6 py-2 d-flex align-items-center">
                <b className="pe-2">FECHA DE RESERVA:</b>
                <Calendar
                  placeholder="Seleccione el rango de fechas a la solicitud."
                  value={dates}
                  onChange={(e) => {
                    handleChangeDate(e.value);
                  }}
                  className="flex-fill"
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                />
              </div>
            </div>
          </div>
          <div className="row py-2">
            <div className="col-sm-6 d-flex">
              <div>
                <b className="pe-2">CANTIDAD DE ESTUDIANTES</b>
              </div>
              <div className="">
                <input
                  type="number"
                  className="form-control flex-fill"
                  value={quantity}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*$/.test(value)) {
                      setQuantity(value);
                    }
                    if (value < 25) {
                      setErrorMessageQuantity(
                        "La cantidad de estudiantes debe ser mayor a 25."
                      );
                    } else if (value >= 5000) {
                      setErrorMessageQuantity(
                        "La cantidad de estudiantes debe ser menor a 5000"
                      );
                    } else {
                      setErrorMessageQuantity("");
                    }
                  }}
                />

                {errorMessageQuantity.trim() && (
                  <Alert variant="danger" className="mt-2">
                    {errorMessageQuantity}
                  </Alert>
                )}
              </div>
            </div>
            <div className="col-sm-6 d-flex">
              <div>
                <b>MOTIVO DE RESERVA</b>
              </div>
              <div>
                <select
                  className="form-select"
                  value={selectedReason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                  }}
                >
                  {reasons.map((reason) => {
                    return (
                      <option key={reason.reason_id} value={reason.reason_id}>
                        {reason.reason_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="py-2">
            <b className="">DESCRIPCION DE LA RESERVA</b>
            <textarea
              type="area"
              className="form-control mt-2"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="d-flex justify-content-end">
            <div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-success custom-btn-green-outline w-50 my-3"
                  disabled={!completed}
                  onClick={handleSendRequest}
                >
                  Reservar
                </button>
              </div>
              <div className="">
                <i className="text-secondary">
                  NOTA: El boton "Reservar" se mantiene deshabilitado hasta que
                  todos <br /> los campos esten completados, excepto los campos
                  opcionales.
                </i>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showModal}
        centered
        onHide={() => setShowModal(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.body}</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary custom-btn-gray-outline"
            onClick={() => setShowModal(false)}
          >
            Aceptar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
