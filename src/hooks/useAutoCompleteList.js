import { useState, useEffect } from "react";

// Helpers para leer y escribir en storage único
const getStorage = () => JSON.parse(localStorage.getItem("pesStats") || "{}");
const saveStorage = (data) =>
  localStorage.setItem("pesStats", JSON.stringify(data));

// Función de orden alfabético
const ordenarLista = (arr) => [...arr].sort((a, b) => a.localeCompare(b));

export function useAutoCompleteList(tipo) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const storage = getStorage();
    const lista = ordenarLista(storage[tipo] || []);
    setList(lista);
  }, [tipo]);

  const addToList = (nombre) => {
    const storage = getStorage();
    const lista = storage[tipo] || [];

    if (!lista.includes(nombre)) {
      const nuevaLista = ordenarLista([...lista, nombre]);
      saveStorage({ ...storage, [tipo]: nuevaLista });
      setList(nuevaLista);
    }
  };

  return [list, addToList];
}
