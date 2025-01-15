import { useState, useEffect } from "react";
import AdminTableCSS from "./AdminTable.module.css";

type AdminTableProps = {
  id: string;
  name: string;
  cols: string[];
};

const fetchData = async (name: string) => {
  const response = await fetch(`http://localhost:5212/api/${name}`);
  return await response.json();
};

const addData = async (name: string, data: any) => {
  const response = await fetch(`http://localhost:5212/api/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};

const updateData = async (name: string, id: string, data: any) => {
  await fetch(`http://localhost:5212/api/${name}/${data[id]}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

const deleteData = async (name: string, id: string) => {
  await fetch(`http://localhost:5212/api/${name}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const AdminTable: React.FC<AdminTableProps> = ({ id, name, cols }) => {
  const [data, setData] = useState<any[]>([]);
  const [newRow, setNewRow] = useState<any>({});

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData(name);
      setData(result);
    };
    fetchDataAsync();
  }, [name]);

  const handleAddRow = async () => {
    const addedRow = await addData(name, newRow);
    setData([...data, addedRow]);
    setNewRow({});
  };

  const handleSaveRow = async (row: any) => {
    await updateData(name, id, row);
  };

  const handleDeleteRow = async (rowId: string) => {
    await deleteData(name, rowId);
    setData(data.filter((row) => row[id] !== rowId));
  };

  return (
    <div className={AdminTableCSS.adminTable}>
      <h3 className={AdminTableCSS.adminTable__heading}>{name}</h3>
      <table className={AdminTableCSS.adminTable__table}>
        <thead className={AdminTableCSS.adminTable__thead}>
          <tr className={AdminTableCSS.adminTable__tr}>
            <th className={AdminTableCSS.adminTable__th}>ID</th>
            {cols.map((col, index) => (
              <th key={index} className={AdminTableCSS.adminTable__th}>{col}</th>
            ))}
            <th className={AdminTableCSS.adminTable__th}>Actions</th>
          </tr>
        </thead>
        <tbody className={AdminTableCSS.adminTable__tbody}>
          {data.map((row, index) => (
            <tr key={index} className={AdminTableCSS.adminTable__tr}>
              <td className={AdminTableCSS.adminTable__td}>{row[id]}</td>
              {cols.map((col) => (
                <td key={col} className={AdminTableCSS.adminTable__td}>
                  <input
                    type="text"
                    defaultValue={row[col]}
                    className={AdminTableCSS.adminTable__input}
                    onChange={(e) => (row[col] = e.target.value)}
                  />
                </td>
              ))}
              <td className={AdminTableCSS.adminTable__td}>
                <button onClick={() => handleSaveRow(row)}>Save</button>
                <button onClick={() => handleDeleteRow(row[id])}>Delete</button>
              </td>
            </tr>
          ))}
          <tr className={AdminTableCSS.adminTable__tr}>
            <td className={AdminTableCSS.adminTable__td}>New</td>
            {cols.map((col, index) => (
              <td key={index} className={AdminTableCSS.adminTable__td}>
                <input
                  type="text"
                  value={newRow[col] || ''}
                  className={AdminTableCSS.adminTable__input}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewRow({ ...newRow, [col]: value });
                  }}
                />
              </td>
            ))}
            <td className={AdminTableCSS.adminTable__td}>
              <button onClick={handleAddRow}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;