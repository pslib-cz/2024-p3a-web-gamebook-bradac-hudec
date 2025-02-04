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
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};

const updateData = async (
    name: string,
    id: string,
    data: any,
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
    await fetch(`http://localhost:5212/api/${name}/${id}`, {
        method: "DELETE",
    });
};

const AdminTable: React.FC<AdminTableProps> = ({ id, name, cols }) => {
    const [data, setData] = useState<any[]>([]);
    const [newRow, setNewRow] = useState<any>({});
    const [editingId, setEditingId] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData(name);
                // For Images table, only keep id and name
                if (name === "Images") {
                    const simplifiedData = result.map((item: any) => ({
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
            const addedRow = await addData(name, newRow);
            setData([...data, addedRow]);
            setNewRow({});
        } catch (err) {
            setError("Failed to add row");
            console.error(err);
        }
    };

    const handleSaveRow = async (row: any) => {
        try {
            const newId = editingId[row[id]];
            await updateData(name, id, row, newId);

            const refreshedData = await fetchData(name);
            if (name === "Images") {
                const simplifiedData = refreshedData.map((item: any) => ({
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
            await deleteData(name, rowId);
            setData(data.filter((row) => row[id] !== rowId));
        } catch (err) {
            setError("Failed to delete row");
            console.error(err);
        }
    };

    const renderIdCell = (row: any) => {
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

    const renderCell = (row: any, col: string) => {
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

    if (error) {
        return <div className={AdminTableCSS.error}>{error}</div>;
    }

    return (
        <div className={AdminTableCSS.adminTable}>
            <h3 className={AdminTableCSS.adminTable__heading}>{name}</h3>
            <table className={AdminTableCSS.adminTable__table}>
                <thead className={AdminTableCSS.adminTable__thead}>
                    <tr className={AdminTableCSS.adminTable__tr}>
                        <th className={AdminTableCSS.adminTable__th}>ID</th>
                        {cols.map((col, index) => (
                            <th
                                key={index}
                                className={AdminTableCSS.adminTable__th}
                            >
                                {col}
                            </th>
                        ))}
                        <th className={AdminTableCSS.adminTable__th}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className={AdminTableCSS.adminTable__tbody}>
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={AdminTableCSS.adminTable__tr}
                        >
                            {renderIdCell(row)}
                            {cols.map((col) => renderCell(row, col))}
                            <td className={AdminTableCSS.adminTable__td}>
                                <button
                                    className={AdminTableCSS.adminTable__button}
                                    onClick={() => handleSaveRow(row)}
                                >
                                    Save
                                </button>
                                <button
                                    className={AdminTableCSS.adminTable__button}
                                    onClick={() => handleDeleteRow(row[id])}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr className={AdminTableCSS.adminTable__tr}>
                        <td className={AdminTableCSS.adminTable__td}>New</td>
                        {cols.map((col, index) => (
                            <td
                                key={index}
                                className={AdminTableCSS.adminTable__td}
                            >
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
                                Add
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
