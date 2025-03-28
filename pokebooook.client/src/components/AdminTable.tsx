import { useState, useEffect } from "react";
import AdminTableCSS from "../styles/components/AdminTable.module.css";

type AdminTableProps = {
  id: string;
  name: string;
  cols: string[];
};

interface TableRow {
  [key: string]: string | number;
}

const fetchData = async (name: string) => {
  const response = await fetch(`http://localhost:5212/api/${name}`);
  return await response.json();
};

const addData = async (name: string, data: TableRow) => {
  try {
    // Přidání dodatečné validace pro různé typy entit
    if (name.toLowerCase() === "items") {
      // Zajistíme správný formát dat pro položky podle API serveru
      if (!data.name) {
        throw new Error("Jméno položky je povinné");
      }
      
      // Zajištění, že všechna povinná pole mají hodnotu
      const requiredFields = ["name", "description", "effect", "value", "imageId"];
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === "") {
          throw new Error(`Pole ${field} je povinné`);
        }
      }
      
      // Zajištění správných typů pro hodnoty
      if (typeof data.value !== "number") {
        data.value = parseInt(data.value?.toString() || "0") || 0;
      }
      
      if (typeof data.imageId !== "number") {
        data.imageId = parseInt(data.imageId?.toString() || "1") || 1;
      }
    }
    
    // Logování odesílaných dat
    console.log(`Odesílám POST požadavek na ${name}:`, JSON.stringify(data, null, 2));
    
    const response = await fetch(`http://localhost:5212/api/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Chyba při vytváření ${name}:`, response.status, errorText);
      throw new Error(`Chyba: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Chyba při vytváření ${name}:`, error);
    throw error;
  }
};

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:5212/api/Images/upload", {
    method: "POST",
    body: formData,
  });
  return await response.json();
};

const updateData = async (
  name: string,
  id: string,
  data: TableRow,
  newId?: string
) => {
  if (name === "Images" && newId && newId !== data[id]) {
    const response = await fetch(
      `http://localhost:5212/api/Images/${data[id]}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageId: parseInt(newId),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update image ID");
    }
    return;
  }

  await fetch(`http://localhost:5212/api/${name}/${data[id]}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const deleteData = async (name: string, id: string) => {
  console.log(
    `Sending DELETE request to: http://localhost:5212/api/${name}/${id}`
  );

  const response = await fetch(`http://localhost:5212/api/${name}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Delete failed with status: ${response.status}`);
  }

  return response;
};

const AdminTable: React.FC<AdminTableProps> = ({ id, name, cols }) => {
  const [data, setData] = useState<TableRow[]>([]);
  const [newRow, setNewRow] = useState<TableRow>({});
  const [editingId, setEditingId] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData(name);
        if (name === "Images") {
          const simplifiedData = result.map((item: TableRow) => ({
            imageId: item.imageId,
            name: item.name,
          }));
          setData(simplifiedData);
        } else {
          setData(result);
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };
    fetchDataAsync();
  }, [name]);

  const handleAddRow = async () => {
    try {
      if (name === "Images" && selectedFile) {
        const uploadedImage = await uploadImage(selectedFile);
        setData([...data, uploadedImage]);
        setSelectedFile(null);
      } else {
        // Vytvoříme kopii dat, abychom mohli provést konverze typů
        const rowToAdd = {...newRow};
        
        // Kontrola, zda jsou zadány všechny povinné vlastnosti
        if (name.toLowerCase() === "items") {
          const requiredFields = ["name", "description", "effect", "value", "imageId"];
          const missingFields = requiredFields.filter(field => !rowToAdd[field]);
          
          if (missingFields.length > 0) {
            throw new Error(`Chybí povinná pole: ${missingFields.join(", ")}`);
          }
          
          // Items - zpracování hodnoty 'value' jako číslo
          rowToAdd.value = parseInt(rowToAdd.value?.toString() || "0");
          rowToAdd.imageId = parseInt(rowToAdd.imageId?.toString() || "1");
          
          // Ověření, že všechny hodnoty jsou validní
          if (isNaN(rowToAdd.value)) {
            throw new Error("Hodnota (value) musí být číslo");
          }
          
          if (isNaN(rowToAdd.imageId)) {
            throw new Error("ID obrázku (imageId) musí být číslo");
          }
          
          // Vytvoříme objekt ve formátu, který očekává API
          const itemToAdd = {
            name: rowToAdd.name,
            description: rowToAdd.description,
            effect: rowToAdd.effect,
            value: rowToAdd.value,
            imageId: rowToAdd.imageId,
          };
          
          // Server očekává přímo pole položek bez obalujícího objektu
          const requestData = [itemToAdd];
          
          console.log("Odesílám data pro položku (item):", JSON.stringify(requestData, null, 2));
          
          // Přímé volání fetch místo addData pro lepší kontrolu
          const response = await fetch(`http://localhost:5212/api/${name}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Chyba při vytváření položky:`, response.status, errorText);
            throw new Error(`Server vrátil chybu: ${response.status} ${response.statusText}\n${errorText}`);
          }
          
          const addedRow = await response.json();
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else if (name.toLowerCase() === "locations") {
          // Locations - zpracování číselných hodnot a boolean
          if (rowToAdd.pokemonId) {
            rowToAdd.pokemonId = parseInt(rowToAdd.pokemonId.toString()) || 0;
          }
          
          if (rowToAdd.rocketChance) {
            rowToAdd.rocketChance = parseFloat(rowToAdd.rocketChance.toString()) || 0;
          }
          
          if (rowToAdd.imageId) {
            rowToAdd.imageId = parseInt(rowToAdd.imageId.toString()) || 1;
          }
          
          // Převod hasPokemon na boolean - převedeme na string "true" nebo "false"
          if (typeof rowToAdd.hasPokemon === 'string') {
            rowToAdd.hasPokemon = rowToAdd.hasPokemon.toLowerCase() === 'true' ? "true" : "false";
          }
          
          console.log("Odesílám data pro lokaci:", JSON.stringify(rowToAdd, null, 2));
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else if (name.toLowerCase() === "pokemons") {
          // Pokemons - zpracování číselných hodnot
          if (rowToAdd.imageId) {
            rowToAdd.imageId = parseInt(rowToAdd.imageId.toString()) || 1;
          }
          
          if (rowToAdd.locationId) {
            rowToAdd.locationId = parseInt(rowToAdd.locationId.toString()) || 0;
          }
          
          if (rowToAdd.energy) {
            rowToAdd.energy = parseInt(rowToAdd.energy.toString()) || 100;
          }
          
          if (rowToAdd.health) {
            rowToAdd.health = parseInt(rowToAdd.health.toString()) || 100;
          }
          
          if (rowToAdd.typeId) {
            rowToAdd.typeId = parseInt(rowToAdd.typeId.toString()) || 1;
          }
          
          console.log("Odesílám data pro pokémona:", JSON.stringify(rowToAdd, null, 2));
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else if (name.toLowerCase() === "connections") {
          // Connections - zpracování ID lokací
          if (rowToAdd.locationFromId) {
            rowToAdd.locationFromId = parseInt(rowToAdd.locationFromId.toString());
          }
          
          if (rowToAdd.locationToId) {
            rowToAdd.locationToId = parseInt(rowToAdd.locationToId.toString());
          }
          
          console.log("Odesílám data pro spojení:", JSON.stringify(rowToAdd, null, 2));
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        } else {
          // Pro ostatní typy entit
          console.log(`Odesílám data pro ${name}:`, JSON.stringify(rowToAdd, null, 2));
          const addedRow = await addData(name, rowToAdd);
          console.log("Přidaný řádek:", addedRow);
          setData([...data, addedRow]);
        }
      }
      setNewRow({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
      setError(`Chyba při přidávání řádku: ${errorMessage}`);
      console.error("Chyba při přidávání řádku:", err);
      
      // Upozornit uživatele na chybu pomocí alert
      alert(`Nepodařilo se přidat řádek: ${errorMessage}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveRow = async (row: TableRow) => {
    try {
      const newId = editingId[row[id]];
      
      // For items, ensure 'value' is sent as a number
      if (name.toLowerCase() === "items" && typeof row.value === 'string') {
        row.value = parseInt(row.value) || 0;
      }
      
      await updateData(name, id, row, newId);

      const refreshedData = await fetchData(name);
      if (name === "Images") {
        const simplifiedData = refreshedData.map((item: TableRow) => ({
          imageId: item.imageId,
          name: item.name,
        }));
        setData(simplifiedData);
      } else {
        setData(refreshedData);
      }

      setEditingId({});
    } catch (err) {
      setError("Failed to save row");
      console.error(err);
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    try {
      console.log(`Attempting to delete item with ID: ${rowId}`);

      await deleteData(name, rowId);

      const updatedData = data.filter((row) => {
        const currentRowId = String(row[id]);
        const targetId = String(rowId);

        console.log(
          `Comparing row ID ${currentRowId} with target ID ${targetId}`
        );
        return currentRowId !== targetId;
      });

      setData(updatedData);
    } catch (err) {
      setError("Failed to delete row");
      console.error(err);
    }
  };

  const handleDeleteClick = (rowId: string) => {
    if (confirm(`Opravdu chcete smazat tento záznam?`)) {
      handleDeleteRow(rowId);
    }
  };

  const renderIdCell = (row: TableRow) => {
    if (name === "Images") {
      return (
        <td className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[id]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => {
              setEditingId({
                ...editingId,
                [row[id]]: e.target.value,
              });
            }}
          />
        </td>
      );
    }
    return <td className={AdminTableCSS.adminTable__td}>{row[id]}</td>;
  };

  const renderCell = (row: TableRow, col: string) => {
    if (name === "Images" && col === "name") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={`http://localhost:5212/api/Images/${row.imageId}`}
              alt={row.name as string}
              className={AdminTableCSS.imagePreview}
            />
            <input
              type="text"
              defaultValue={row[col]}
              className={AdminTableCSS.adminTable__input}
              onChange={(e) => (row[col] = e.target.value)}
            />
          </div>
        </td>
      );
    }
    
    // Special handling for item effect field
    if (name.toLowerCase() === "items" && col === "effect") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <select
            defaultValue={row[col] as string || "other"}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = e.target.value)}
          >
            <option value="heal">heal</option>
            <option value="energy">energy</option>
            <option value="other">other</option>
          </select>
        </td>
      );
    }
    
    // Special handling for item value field
    if (name.toLowerCase() === "items" && col === "value") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[col]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = parseInt(e.target.value) || 0)}
          />
        </td>
      );
    }
    
    // Special handling for hasPokemon in locations
    if (name.toLowerCase() === "locations" && col === "hasPokemon") {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <select
            defaultValue={row[col]?.toString() || "false"}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = e.target.value)}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </td>
      );
    }
    
    // Special handling for numeric fields in locations
    if (name.toLowerCase() === "locations" && (col === "pokemonId" || col === "rocketChance" || col === "imageId")) {
      return (
        <td key={col} className={AdminTableCSS.adminTable__td}>
          <input
            type="number"
            defaultValue={row[col]}
            className={AdminTableCSS.adminTable__input}
            onChange={(e) => (row[col] = e.target.value ? parseInt(e.target.value) : "")}
          />
        </td>
      );
    }
    
    return (
      <td key={col} className={AdminTableCSS.adminTable__td}>
        <input
          type="text"
          defaultValue={row[col]}
          className={AdminTableCSS.adminTable__input}
          onChange={(e) => (row[col] = e.target.value)}
        />
      </td>
    );
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  if (error) {
    return <div className={AdminTableCSS.error}>{error}</div>;
  }

  return (
    <div className={AdminTableCSS.adminTable}>
      <h3 className={AdminTableCSS.adminTable__heading}>{name}</h3>

      <div className={AdminTableCSS.adminTable__filter}>
        <input
          type="text"
          placeholder="Hledat..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {name === "Images" && (
        <div className={AdminTableCSS.imageUpload}>
          <label className={AdminTableCSS.imageUpload__label}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={AdminTableCSS.imageUpload__input}
            />
            Nahrát obrázek
          </label>
          {selectedFile && (
            <button
              className={AdminTableCSS.adminTable__button}
              onClick={handleAddRow}
            >
              Uložit obrázek
            </button>
          )}
        </div>
      )}

      <table className={AdminTableCSS.adminTable__table}>
        <thead>
          <tr>
            <th className={AdminTableCSS.adminTable__th}>ID</th>
            {cols.map((col, index) => (
              <th key={index} className={AdminTableCSS.adminTable__th}>
                {col}
              </th>
            ))}
            <th className={AdminTableCSS.adminTable__th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => {
            return (
              <tr key={row[id]} className={AdminTableCSS.adminTable__tr}>
                {renderIdCell(row)}
                {cols.map((col) => renderCell(row, col))}
                <td className={AdminTableCSS.adminTable__td}>
                  <button
                    className={AdminTableCSS.adminTable__button}
                    onClick={() => handleSaveRow(row)}
                  >
                    Uložit
                  </button>
                  <button
                    className={`${AdminTableCSS["adminTable__button"]} ${AdminTableCSS["adminTable__button--delete"]}`}
                    onClick={() => handleDeleteClick(row[id].toString())}
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            );
          })}
          {name !== "Images" && (
            <tr className={AdminTableCSS.adminTable__tr}>
              <td className={AdminTableCSS.adminTable__td}>New</td>
              {cols.map((col, index) => (
                <td key={index} className={AdminTableCSS.adminTable__td}>
                  {name.toLowerCase() === "items" && col === "effect" ? (
                    <select
                      value={newRow[col] as string || "other"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    >
                      <option value="heal">heal</option>
                      <option value="energy">energy</option>
                      <option value="other">other</option>
                    </select>
                  ) : name.toLowerCase() === "items" && col === "value" ? (
                    <input
                      type="number"
                      value={newRow[col] || "0"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: parseInt(e.target.value) || 0 });
                      }}
                    />
                  ) : name.toLowerCase() === "locations" && col === "hasPokemon" ? (
                    <select
                      value={newRow[col] as string || "false"}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : name.toLowerCase() === "locations" && (col === "pokemonId" || col === "rocketChance" || col === "imageId") ? (
                    <input
                      type="number"
                      value={newRow[col] || ""}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={newRow[col] || ""}
                      className={AdminTableCSS.adminTable__input}
                      onChange={(e) => {
                        setNewRow({ ...newRow, [col]: e.target.value });
                      }}
                    />
                  )}
                </td>
              ))}
              <td className={AdminTableCSS.adminTable__td}>
                <button
                  className={AdminTableCSS.adminTable__button}
                  onClick={handleAddRow}
                >
                  Přidat
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;