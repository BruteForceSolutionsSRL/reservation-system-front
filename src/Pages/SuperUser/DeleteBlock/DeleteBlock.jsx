import { useEffect, useState } from "react";
import SearchBar from "../../../Components/SearchBar/SearchBar";
import { getBlocks } from "../../../services/blocks";
import { searchBlocks } from "../../../utils/searchBlocks";
import { Spinner } from "react-bootstrap";
import BlockDelete from "./BlockDelete";

function DeleteBlock() {
  const [allBlocks, setAllBlocks] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [msgNoResults, setMsgNoResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  useEffect(() => {
    setReloadList(false);
    setLoading(true);
    getBlockList();
  }, [reloadList]);

  useEffect(() => {
    if (searchValue === "") {
      setBlocks(allBlocks);
      setMsgNoResults("");
    } else {
      const results = searchBlocks(allBlocks, searchValue);
      if (results.length < 1) {
        setMsgNoResults("No se encontraron resultados para la busqueda.");
      } else {
        setMsgNoResults("");
      }
      setBlocks(results);
    }
  }, [searchValue]);

  const getBlockList = async () => {
    let envl = await getBlocks()
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => console.error(err));
    setAllBlocks(envl);
    setBlocks(envl);
  };

  return (
    <div className="container">
      <h1 className="text-center">Lista de Bloques</h1>
      <SearchBar
        value={searchValue}
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9\s]*$/;
          if (regex.test(event.target.value) || event.target.value === "") {
            setSearchValue(event.target.value);
          }
        }}
      />
      <hr />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="secondary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <div>
          {blocks.length > 0 ? (
            <>
              {blocks.map((each) => (
                <BlockDelete
                  key={each.block_id}
                  {...each}
                  reloadList={(change) => setReloadList(change)}
                />
              ))}
            </>
          ) : (
            <>
              <h3 className="text-center">{msgNoResults}</h3>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default DeleteBlock;
