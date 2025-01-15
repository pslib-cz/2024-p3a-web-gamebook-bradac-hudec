import React from 'react';
import { Link } from 'react-router-dom';
import LocationBtnCSS from './LocationBtn.module.css';
import ConnectionType from '../types/ConnectionType';

interface LocationOptionsProps {
    connections: ConnectionType[];
    currentLocationId: number;
}

const LocationOptions: React.FC<LocationOptionsProps> = ({ connections, currentLocationId }) => {
    return (
        <>
            {connections.map((connection) => (
                <Link key={connection.connectionId} to={`/locations/${connection.locationFromId === currentLocationId ? connection.locationToId : connection.locationFromId}`}>
                    <button className={LocationBtnCSS.locationOptions__btn}>
                        {connection.locationFromId === currentLocationId ? connection.locationTo.name : connection.locationFrom.name}
                    </button>
                </Link>
            ))}
        </>
    );
};

export default LocationOptions;