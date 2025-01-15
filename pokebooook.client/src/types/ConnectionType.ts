import LocationType from "./LocationType";

interface ConnectionType {
    connectionId: number;
    name: string;
    locationFromId: number;
    locationToId: number;
    locationFrom: LocationType;
    locationTo: LocationType;
}

export default ConnectionType;