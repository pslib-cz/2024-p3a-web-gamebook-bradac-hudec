import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LocationType from './types/LocationType';
import ConnectionType from './types/ConnectionType';
import StoryBox from './components/StoryBox';
import StoryText from './components/StoryText';
import Bg from './components/Bg';
import LocationBtn from './components/LocationBtn';
import PokemonInventory from './Menus/PokemonInventory';
import PokemonCell from './components/PokemonCell';
import ItemInventory from './Menus/ItemInventory';
import ItemInventoryCell from './components/ItemInventoryCell';
import PokemonContainer from './components/PokemonContainer';
import Battle from './Battle';

type PokemonType = {
    id: number;
    name: string;
    imageId: number;
    health: number;
    energy: number;
};
const Location: React.FC = () => {
    const { locationId } = useParams<{ locationId: string }>();
    if (!locationId) throw new Error('No location ID provided');

    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationConnections, setLocationConnections] = useState<ConnectionType[]>([]);
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(true);
    const [showBattle, setShowBattle] = useState<boolean>(false);
    const [pokemon, setPokemon] = useState<PokemonType | null>(null);

    const nickname = localStorage.getItem('nickname') || 'trenér';

    const replaceNickname = (text: string) => text.replace('{nickname}', nickname);

    const fetchLocationConnections = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}/Connections`);
        const data = await response.json();
        setLocationConnections(data);
    }, [locationId]);

    const fetchLocation = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Locations/${locationId}`);
        const data = await response.json();
        setLocation(data);
        fetchLocationConnections();

        // If the location has a Pokémon encounter, prepare the Pokémon data
        if (data.hasPokemon) {
            fetchRandomPokemon();
        }
    }, [fetchLocationConnections, locationId]);

    const fetchRandomPokemon = useCallback(async () => {
        const randomId = Math.floor(Math.random() * 9) + 1;
        const response = await fetch(`http://localhost:5212/api/Pokemons/${randomId}`);
        const data = await response.json();
        setPokemon(data);
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    useEffect(() => {
        setCurrentTextIndex(0);
        setShowText(true);
        setShowOptions(false);
        setShowBattle(false);
    }, [locationId]);

    const handleStoryBoxClick = () => {
        if (currentTextIndex < (location?.descriptions.length || 1) - 1) {
            setCurrentTextIndex((prevIndex) => prevIndex + 1);
        } else {
            setShowText(false);
            if (location?.hasPokemon) {
                setShowBattle(true); // Trigger battle component if `hasPokemon` is true
            } else {
                setShowOptions(true);
            }
        }
    };

    if (!location) return <div>Loading...</div>;

    return (
        <Bg key={location.imageId} imageId={location.imageId}>
            {!showBattle && (
                <>
                    <PokemonInventory>
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                    </PokemonInventory>
                    <StoryBox onClick={handleStoryBoxClick} showContinueText={showText}>
                        {showText && <StoryText text={replaceNickname(location.descriptions[currentTextIndex])} />}
                        {showOptions && <LocationBtn connections={locationConnections} currentLocationId={parseInt(locationId)} />}
                    </StoryBox>
                    <ItemInventory>
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                    </ItemInventory>
                </>
            )}
            {showBattle && pokemon && (
                <Battle/>
            )}
        </Bg>
    );
};
export default Location;
