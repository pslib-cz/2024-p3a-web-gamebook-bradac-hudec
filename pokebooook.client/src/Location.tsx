import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

const LocationList = () => {
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        const response = await fetch(`/api/locations`);
        const data = await response.json();
        setLocations(data.results);
    }

    useEffect(() => {
       fetchLocations();
    }, []);

    return (
        <div>
            <ul>
                {locations.map(location => (
                    <li key={location.id}>
                        <a href={`/location/${location.id}`}>{location.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LocationDetail = () => {
    const { id } = useParams();
    const [location, setLocation] = useState(null);

    const fetchLocation = async () => {
        const response = await fetch(`/api/locations/${id}`);
        const data = await response.json();
        setLocation(data);
    }

    useEffect(() => {
        fetchLocation();
    }, [id]);

    if (!location) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{location.name}</h1>
            <p>{location.description}</p>
        </div>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LocationList />} />
                <Route path="/location/:id" element={<LocationDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;