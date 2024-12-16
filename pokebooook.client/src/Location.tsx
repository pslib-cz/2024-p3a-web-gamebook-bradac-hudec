import React, { useEffect, useState } from 'react';

interface ImageData {
    id: number;
    type: string;
    data: string; 
}

interface LocationProps {
    locationId: number;
}

const Location: React.FC<LocationProps> = ({ locationId }) => {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [imageData, setImageData] = useState<ImageData | null>(null);

    const fetchLocation = async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}`);
        const data = await response.json();
        setLocationName(data.name);
        fetchImage(data.imageId);
    };

    const fetchImage = async (imageId: number) => {
        const response = await fetch(`http://localhost:5212/api/Images/${imageId}`);
        const data = await response.json();
        setImageData(data);
    };

    useEffect(() => {
        fetchLocation();
    }, [locationId]);

    if (!locationName) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1>{locationName}</h1>
            <p>Location ID: <b>{locationId}</b></p>
            {imageData && <img src={`data:${imageData.type};base64,${imageData.data}`} alt="location" />}
        </div>
    );
};

export default Location;