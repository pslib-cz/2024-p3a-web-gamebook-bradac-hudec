import { useState, useEffect } from "react";



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
        <div>
            <h3>{name}</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        {cols.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row[id]}</td>
                            {cols.map((col, index) => (
                                <td key={index}>
                                    <input type="text" defaultValue={row[col]} onChange={(e)=> {
                                            const value = e.target.value;
                                            console.log(value);
                                            row[col] = value;
                                            const newData = [...data];                                   
                                            newData[index][col] = value;
                                            setData(newData);
                                            updateData(name, id, row);
                                        }
                                    } />
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