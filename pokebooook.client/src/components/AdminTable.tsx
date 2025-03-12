import { useState, useEffect } from "react";
import AdminTableCSS from "./AdminTable.module.css";

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
  const response = await fetch(`http://localhost:5212/api/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
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
        const addedRow = await addData(name, newRow);
        setData([...data, addedRow]);
      }
      setNewRow({});
    } catch (err) {
      setError("Failed to add row");
      console.error(err);
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
                  <input
                    type="text"
                    value={newRow[col] || ""}
                    className={AdminTableCSS.adminTable__input}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewRow({ ...newRow, [col]: value });
                    }}
                  />
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
