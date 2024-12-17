import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import LocationType from './types/LocationType';
import ConnectionType from './types/ConnectionType';
import LocationCSS from './Location.module.css';

interface ImageData {
    id: number;
    type: string;
    data: string; 
}

const Location: React.FC = () => {
    
    // locationId use param from react-router
    const params = useParams();
    if (!params.locationId) {
        throw new Error('No location ID provided');
    }
    const locationId: number = parseInt(params.locationId);

    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationConnections, setLocationConnections] = useState<ConnectionType[]>([]);
    const [imageData, setImageData] = useState<ImageData | null>(null);

    const fetchImage = useCallback(async (imageId: number) => {
        const response = await fetch(`http://localhost:5212/api/Images/${imageId}`);
        const data = await response.json();
        setImageData(data);
    }, [setImageData]);

    const fetchLocationConnections = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}/Connections`);
        const data = await response.json();
        setLocationConnections(data);
    }, [locationId]);

    const fetchLocation = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}`);
        const data = await response.json();
        fetchLocationConnections();
        setLocation(data);
        fetchImage(data.imageId);
    }, [fetchImage, fetchLocationConnections, locationId]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    if (!location) {
        return <div>Loading...</div>;
    }
    
    return (    
        <div className={LocationCSS.location__container}>
            <div className={LocationCSS.location__info}>
                <div className={LocationCSS.info__text}>
                    <h1>{location.name}</h1>
                    <p>Location ID: <b>{locationId}</b></p>
                    <p>Location type: <b>{((location.rocketChance/100) > Math.random()) ? 'ROCKET' : 'BASIC'}</b></p>
                </div>
                {imageData && <img className={LocationCSS.location__img} src={`data:${imageData.type};base64,${imageData.data}`} alt="location" />}
            </div>
            {
                locationConnections && (
                    <div className={LocationCSS.connections__container}>
                        <h2>Connections</h2>
                        <ul className={LocationCSS.connections__list}>
                            {locationConnections.map((connection: ConnectionType) => (
                                <li key={connection.connectionId}>
                                    <Link to={`/locations/${connection.locationFromId == locationId ? connection.locationToId : connection.locationFromId }`}>
                                        <button className={LocationCSS.connections__btn}>{connection.locationFromId == locationId ? connection.locationTo.name : connection.locationFrom.name}</button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    );
};

export default Location;