import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LocationType from './types/LocationType';
import ConnectionType from './types/ConnectionType';
//import LocationCSS from './components/Location/Location.module.css';
import StoryBox from './components/StoryBox';
import StoryText from './components/StoryText';
import Bg from './components/Bg';
import LocationBtn from './components/LocationBtn';
import PokemonInventory from './Menus/PokemonInventory';
import PokemonCell from './components/PokemonCell';
import ItemInventory from './Menus/ItemInventory';
import ItemInventoryCell from './components/ItemInventoryCell';

const Location: React.FC = () => {
    
    // locationId use param from react-router
    const params = useParams();
    if (!params.locationId) {
        throw new Error('No location ID provided');
    }
    const locationId: number = parseInt(params.locationId);

    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationConnections, setLocationConnections] = useState<ConnectionType[]>([]);
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(true);

    const nickname = localStorage.getItem('nickname') || 'trenér';

    const replaceNickname = (text: string) => {
        return text.replace('{nickname}', nickname);
    };

    const fetchLocationConnections = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}/Connections`);
        const data = await response.json();
        console.log('Fetched connections:', data); 
        setLocationConnections(data);
    }, [locationId]);

    const fetchLocation = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}`);
        const data = await response.json();
        console.log('Fetched location:', data); 
        setLocation(data);
        fetchLocationConnections();
    }, [fetchLocationConnections, locationId]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    useEffect(() => {
        setCurrentTextIndex(0);
        setShowText(true);
        setShowOptions(false);
    }, [locationId]);

    const handleStoryBoxClick = () => {
        if (currentTextIndex < (location?.descriptions.length || 1) - 1) {
            console.log('click');
            setCurrentTextIndex((prevIndex) => prevIndex + 1);
        } else {
            setShowText(false);  
            setShowOptions(true);
        }
    };

    if (!location) {
        return <div>Loading...</div>;
    }
    
    return (         
        <Bg key={location.imageId} imageId={location.imageId}>
            <PokemonInventory>
                <PokemonCell/>
                <PokemonCell/>
                <PokemonCell/>
                <PokemonCell/>
                <PokemonCell/>
                <PokemonCell/>
            </PokemonInventory>
            <StoryBox onClick={handleStoryBoxClick} showContinueText={showText}>
                {showText && <StoryText text={replaceNickname(location.descriptions[currentTextIndex])} />}
                {showOptions && <LocationBtn connections={locationConnections} currentLocationId={locationId} />}
            </StoryBox> 
            <ItemInventory>
                <ItemInventoryCell/>
                <ItemInventoryCell/>
                <ItemInventoryCell/>
                <ItemInventoryCell/>
                <ItemInventoryCell/>
            </ItemInventory>
        </Bg>
    );
};

export default Location;