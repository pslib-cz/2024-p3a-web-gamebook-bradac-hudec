import LocationType from "./LocationType";

interface ConnectionType {
    connectionId: number;
    locationFromId: number;
    locationToId: number;
    locationFrom: LocationType;
    locationTo: LocationType;
}

export default ConnectionType;