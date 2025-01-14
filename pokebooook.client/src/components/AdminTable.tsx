import { useState, useEffect } from "react";
import AdminTableCSS from "./AdminTable.module.css";

type AdminTableProps = {
    id: string;
    name: string;
    cols: string[];
}

const updateData = (name: string, id: string, data: any) => {
    fetch('http://localhost:5212/api/' + name + '/' + data[id], {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

const AdminTable: React.FC<AdminTableProps> = ({id, name, cols}) => {
    //get stuff from API
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5212/api/' + name)
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

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
                    </tr>
                </thead>
                <tbody className={AdminTableCSS.adminTable__tbody}>
                    {data.map((row, index) => (
                        <tr key={index} className={AdminTableCSS.adminTable__tr}>
                            <td className={AdminTableCSS.adminTable__td}>{row[id]}</td>
                            {cols.map((col, index) => (
                                <td key={index} className={AdminTableCSS.adminTable__td}>
                                    <input 
                                        type="text" 
                                        defaultValue={row[col]} 
                                        className={AdminTableCSS.adminTable__input}
                                        onChange={(e)=> {
                                            const value = e.target.value;
                                            console.log(value);
                                            row[col] = value;
                                            const newData = [...data];                                   
                                            newData[index][col] = value;
                                            setData(newData);
                                            updateData(name, id, row);
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable;
