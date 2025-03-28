import React from 'react';
import { Link } from 'react-router-dom';
import LocationBtnCSS from "../styles/components/LocationBtn.module.css";
import ConnectionType from '../types/ConnectionType';

interface LocationOptionsProps {
    connections: ConnectionType[];
    currentLocationId: number;
}

const LocationOptions: React.FC<LocationOptionsProps> = ({ connections, currentLocationId }) => {
    return (
        <div className={LocationBtnCSS.locationOptions__container}>
            <div className={LocationBtnCSS.locationOptions__wrapper}>
                {connections.map((connection) => (
                    <Link 
                        key={connection.connectionId} 
                        to={`/locations/${connection.locationFromId === currentLocationId ? connection.locationToId : connection.locationFromId}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <button className={LocationBtnCSS.locationOptions__btn}>
                            {connection.locationFromId === currentLocationId ? connection.locationTo.name : connection.locationFrom.name}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LocationOptions;