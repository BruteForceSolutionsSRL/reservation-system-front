import "./SearchBar.css";
export default function SearchBar({ value, onChange, className, onPaste }) {
  return (
    <>
      <b className="me-2">Buscar</b>
      <div className={`d-inline-flex border p-2 rounded ${className}`}>
        <i className="bi bi-search"></i>
        <input
          className="search-input"
          type="search"
          placeholder="Buscar..."
          onChange={onChange}
          value={value}
          onPaste={onPaste}
        />
      </div>
    </>
  );
}
