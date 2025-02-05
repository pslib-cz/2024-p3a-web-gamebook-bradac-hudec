import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import LocationType from "./types/LocationType";
import ConnectionType from "./types/ConnectionType";
import StoryBox from "./components/StoryBox";
import StoryText from "./components/StoryText";
import Bg from "./components/Bg";
import LocationBtn from "./components/LocationBtn";
import PokemonInventory from "./Menus/PokemonInventory";
import PokemonCell from "./components/PokemonCell";
import ItemInventory from "./Menus/ItemInventory";
import ItemInventoryCell from "./components/ItemInventoryCell";
import Battle from "./Battle";
import StarterSelection from "./components/StarterSelection";
import StarterPokemon from "./types/StarterPokemon";

type PokemonType = {
    pokemonId: number;
    id: number;
    name: string;
    imageId: number;
    health: number;
    maxHealth: number;
    energy: number;
    pokemonAttacks: any[];
};

const replaceText = (
    text: string,
    nickname: string,
    pokemonName: string | undefined
) => {
    let processedText = text.replace("{nickname}", `${nickname}`);

    processedText = processedText.replace("{pokemonname}", `${pokemonName}`);

    return processedText;
};

const Location: React.FC = () => {
    const { locationId } = useParams<{ locationId: string }>();
    if (!locationId) throw new Error("No location ID provided");

    const [location, setLocation] = useState<LocationType | null>(null);
    const [locationConnections, setLocationConnections] = useState<
        ConnectionType[]
    >([]);
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(true);
    const [showBattle, setShowBattle] = useState<boolean>(false);
    const [pokemon, setPokemon] = useState<PokemonType | null>(null);
    const [showStarterSelection, setShowStarterSelection] =
        useState<boolean>(false);
    const [playerPokemons, setPlayerPokemons] = useState<PokemonType[]>(() => {
        const saved = localStorage.getItem("playerPokemons");
        return saved ? JSON.parse(saved) : [];
    });

    const nickname = localStorage.getItem("nickname") || "trenér";

    const fetchLocationConnections = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:5212/api/Locations/${locationId}/Connections`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch location connections");
            }
            const data = await response.json();
            setLocationConnections(data);
        } catch (error) {
            console.error("Error fetching location connections:", error);
        }
    }, [locationId]);

    const fetchLocationPokemon = useCallback(async (pokemonId: number) => {
        try {
            const response = await fetch(
                `http://localhost:5212/api/Pokemons/${pokemonId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch location pokemon");
            }
            const data = await response.json();
            setPokemon(data);
        } catch (error) {
            console.error("Error fetching Pokemon:", error);
        }
    }, []);

    const fetchLocation = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:5212/api/Locations/${locationId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch location");
            }
            const data = await response.json();
            setLocation(data);
            await fetchLocationConnections();

            if (data.hasPokemon && data.pokemonId) {
                await fetchLocationPokemon(data.pokemonId);
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    }, [fetchLocationConnections, locationId, fetchLocationPokemon]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    useEffect(() => {
        setCurrentTextIndex(0);
        setShowText(true);
        setShowOptions(false);
        setShowBattle(false);
        setShowStarterSelection(false);
    }, [locationId]);

    const handleStoryBoxClick = () => {
        if (!location) return;

        if (currentTextIndex < location.descriptions.length - 1) {
            setCurrentTextIndex((prevIndex) => prevIndex + 1);
        } else {
            setShowText(false);
            if (location.locationId === 2) {
                setShowStarterSelection(true);
            } else if (location.hasPokemon) {
                setShowBattle(true);
            } else {
                setShowOptions(true);
            }
        }
    };

    const handleStarterSelection = (selectedPokemon: StarterPokemon) => {
        if (playerPokemons.length >= 6) {
            alert("Nemůžeš mít více než 6 pokémonů!");
            setShowStarterSelection(false);
            setShowOptions(true);
            return;
        }

        const pokemonData: PokemonType = {
            ...selectedPokemon,
            pokemonId: selectedPokemon.id,
            maxHealth: selectedPokemon.health,
            pokemonAttacks: [],
        };
        const updatedPokemons = [...playerPokemons, pokemonData];
        setPlayerPokemons(updatedPokemons);
        localStorage.setItem("playerPokemons", JSON.stringify(updatedPokemons));
        setShowStarterSelection(false);
        setShowOptions(true);
    };

    if (!location) return <div>Loading...</div>;

    return (
        <Bg key={location.imageId} imageId={location.imageId}>
            {!showBattle && !showStarterSelection && (
                <>
                    <PokemonInventory>
                        {playerPokemons.map((pokemon, index) => (
                            <PokemonCell
                                key={`pokemon-${index}`}
                                pokemon={pokemon}
                            />
                        ))}
                        {Array(6 - playerPokemons.length)
                            .fill(null)
                            .map((_, index) => (
                                <PokemonCell key={`empty-${index}`} />
                            ))}
                    </PokemonInventory>
                    <StoryBox
                        onClick={handleStoryBoxClick}
                        showContinueText={showText}
                    >
                        {showText && (
                            <StoryText
                                text={replaceText(
                                    location.descriptions[currentTextIndex],
                                    nickname,
                                    pokemon?.name
                                )}
                            />
                        )}
                        {showOptions && (
                            <LocationBtn
                                connections={locationConnections}
                                currentLocationId={parseInt(locationId)}
                            />
                        )}
                    </StoryBox>
                    <ItemInventory>
                        {Array(5)
                            .fill(null)
                            .map((_, index) => (
                                <ItemInventoryCell key={`item-${index}`} />
                            ))}
                    </ItemInventory>
                </>
            )}
            {showStarterSelection && (
                <StarterSelection onSelect={handleStarterSelection} />
            )}
            {showBattle && pokemon && (
                <Battle locationPokemonId={location.pokemonId} />
            )}
        </Bg>
    );
};

export default Location;
