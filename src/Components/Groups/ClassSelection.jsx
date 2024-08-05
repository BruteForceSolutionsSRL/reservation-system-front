import { useState } from "react";
import { Collapse } from "react-bootstrap";

export default function ClassSelection({
  blocks,
  id,
  periods,
  classroomsFirstBlock,
  onChange,
}) {
  const capitalicedId = id[0].toUpperCase() + id.slice(1);
  const [selectedBlock, setSelectedBlock] = useState(blocks[0].block_id);
  const [classrooms, setClassrooms] = useState(classroomsFirstBlock);
  const [selectedClassroom, setSelectedClassroom] = useState(
    classroomsFirstBlock[0].classroom_id
  );
  const [selectedPeriods, setSelectedPeriods] = useState([1, 2]);
  const [checked, setChecked] = useState(false);
  const [startPeriods, setStartPeriods] = useState(periods.slice(0, -1));
  const [endPeriods, setEndPeriods] = useState(periods.slice(1, -1));
  const [body, setBody] = useState({
    checked: false,
    period1: 1,
    period2: 66,
    block: blocks[0].block_id,
    classroom: classroomsFirstBlock[0].classroom_id,
  });

  const handleChangeBlock = (event) => {
    const { value } = event.target;
    const block = blocks.find((b) => b.block_id + "" === value + "");
    setSelectedBlock(value);
    setClassrooms(block.classrooms);
    setSelectedClassroom(block.classrooms[0].classroom_id);
    changeBody("block", value);
  };

  const handleChangeClassroom = (event) => {
    const { value, id } = event.target;
    setSelectedClassroom(value);
    changeBody(id, value);
  };

  const changeBody = (field, value) => {
    const newBody = { ...body, [field]: value };
    setBody(newBody);
    onChange(id, newBody);
  };

  const sliceEndPeriod = (indexStartPeriod) => {
    const index = periods.findIndex(
      (p) => p.time_slot_id + "" === indexStartPeriod
    );
    const list = periods.slice(index + 1, index + 8);
    setEndPeriods(list);
  };

  return (
    <div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={checked}
          id={"checked"}
          onChange={(event) => {
            setChecked(!checked);
            changeBody(event.target.id, event.target.checked);
          }}
        />
        <label className="form-check-label" htmlFor={"checked"}>
          {capitalicedId}
        </label>
      </div>
      <Collapse in={checked}>
        <div className="">
          <div className="d-flex my-1">
            <label className="pe-2">PERIODOS</label>
            <div className="d-flex">
              <select
                className="form-select"
                value={selectedPeriods[0]}
                id="period1"
                onChange={(event) => {
                  setSelectedPeriods([event.target.value, selectedPeriods[1]]);
                  changeBody(event.target.id, event.target.value);
                  sliceEndPeriod(event.target.value);
                }}
              >
                {startPeriods.map((p) => {
                  return (
                    <option value={p.time_slot_id} key={p.time_slot_id}>
                      {p.time}
                    </option>
                  );
                })}
              </select>
              <select
                className="form-select"
                id="period2"
                value={selectedPeriods[1]}
                onChange={(event) => {
                  setSelectedPeriods([selectedPeriods[0], event.target.value]);
                  changeBody(event.target.id, event.target.value);
                }}
              >
                {endPeriods.map((p) => {
                  return (
                    <option value={p.time_slot_id} key={p.time_slot_id}>
                      {p.time}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <div className="d-flex my-1">
              <label className="pe-2">BLOQUE: </label>
              <select
                className="form-select"
                id="block"
                value={selectedBlock}
                onChange={handleChangeBlock}
              >
                {blocks.map((b) => {
                  return (
                    <option value={b.block_id} key={b.block_id}>
                      {b.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <div className="d-flex my-1">
              <label className="pe-2">AULAS: </label>
              <select
                className="form-select"
                id="classroom"
                value={selectedClassroom}
                onChange={handleChangeClassroom}
                disabled={classrooms?.length === 0}
              >
                {classrooms?.map((c) => {
                  return (
                    <option value={c.classroom_id} key={c.classroom_id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
