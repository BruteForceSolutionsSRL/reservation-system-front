import { useState } from "react";
import GroupElement from "../GroupElement/GroupElement";

export default function GroupsList({ groupsList }) {
  const [list, setList] = useState(groupsList);
  return (
    <div>
      {list.map((each, index) => {
        return (
          <div key={index}>
            <GroupElement {...each} />
          </div>
        );
      })}
    </div>
  );
}
