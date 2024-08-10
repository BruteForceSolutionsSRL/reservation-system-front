import GroupElement from "../GroupElement/GroupElement";

export default function GroupsList({ groupsList }) {
  return (
    <div>
      {groupsList.map((each, index) => {
        return (
          <div key={index}>
            <GroupElement {...each} />
          </div>
        );
      })}
    </div>
  );
}
