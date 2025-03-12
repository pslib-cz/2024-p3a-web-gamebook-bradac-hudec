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
import PokemonAttack from "./types/pokemonAttacks";
import PokemonType from "./types/PokemonType";
import GameItem from "./types/GameItem";

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
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);
  const [showSelectionSuccess, setShowSelectionSuccess] =
    useState<boolean>(false);
  const [selectedStarterPokemon, setSelectedStarterPokemon] =
    useState<PokemonType | null>(null);
  const [playerPokemons, setPlayerPokemons] = useState<PokemonType[]>(() => {
    const saved = localStorage.getItem("playerPokemons");
    return saved ? JSON.parse(saved) : [];
  });
  const [playerItems, setPlayerItems] = useState<GameItem[]>(() => {
    const saved = localStorage.getItem("playerItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [visitedLocations, setVisitedLocations] = useState<number[]>(() => {
    const saved = localStorage.getItem("visitedLocations");
    return saved ? JSON.parse(saved) : [];
  });

  const nickname = localStorage.getItem("nickname") || "trenér";

  const fetchLocationConnections = useCallback(async () => {
    try {
      const response = await fetch(`/api/Locations/${locationId}/Connections`);
      if (!response.ok) {
        throw new Error("Failed to fetch location connections");
      }
      const data = await response.json();
      const filteredConnections = data.filter((connection: ConnectionType) => {
        const targetLocationId =
          connection.locationFromId === parseInt(locationId)
            ? connection.locationToId
            : connection.locationFromId;
        return !visitedLocations.includes(targetLocationId);
      });
      setLocationConnections(filteredConnections);
    } catch (error) {
      console.error("Error fetching location connections:", error);
    }
  }, [locationId, visitedLocations]);

  const fetchLocationPokemon = useCallback(async (pokemonId: number) => {
    try {
      const response = await fetch(`/api/Pokemons/${pokemonId}`);
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
      const response = await fetch(`/api/Locations/${locationId}`);
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
    setHasCompletedIntro(false);
    setShowSelectionSuccess(false);
    setSelectedStarterPokemon(null);
  }, [locationId]);

  useEffect(() => {
    if (!visitedLocations.includes(parseInt(locationId))) {
      const updatedLocations = [...visitedLocations, parseInt(locationId)];
      setVisitedLocations(updatedLocations);
      localStorage.setItem(
        "visitedLocations",
        JSON.stringify(updatedLocations)
      );
    }
  }, [locationId]);

  const handleStoryBoxClick = () => {
    if (!location) return;

    if (location.locationId === 2 && showSelectionSuccess) {
      if (currentTextIndex < location.descriptions.length - 1) {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      } else {
        setShowText(false);
        setShowOptions(true);
        setShowSelectionSuccess(false); 
      }
      return;
    }

    if (location.locationId === 2) {
      if (currentTextIndex < 2) {
        setCurrentTextIndex((prevIndex) => prevIndex + 1);
      } else {
        setShowText(false);
        setHasCompletedIntro(true);
        setShowStarterSelection(true);
      }
      return;
    }

    if (currentTextIndex < location.descriptions.length - 1) {
      setCurrentTextIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowText(false);
      setHasCompletedIntro(true);
      if (location.hasPokemon) {
        setShowBattle(true);
      } else {
        setShowOptions(true);
      }
    }
  };

  const handleStarterSelection = (selectedPokemon: StarterPokemon) => {
    console.log("Handling starter selection with:", selectedPokemon);

    if (playerPokemons.length >= 6) {
      alert("Nemůžeš mít více než 6 pokémonů!");
      setShowStarterSelection(false);
      setShowOptions(true);
      return;
    }

    if (!selectedPokemon.id) {
      console.error("Selected pokemon has no ID!");
      alert("Chyba při výběru pokémona!");
      return;
    }

    // Fetch complete pokemon data from API
    fetch(`/api/Pokemons/${selectedPokemon.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((pokemonData) => {
        console.log("Received pokemon data from API:", pokemonData);

        if (!pokemonData || !pokemonData.pokemonId) {
          throw new Error("Invalid pokemon data received from API");
        }

        // Transform attacks data to match the AttackType format
        const transformedAttacks =
          pokemonData.pokemonAttacks?.map((attack: any) => ({
            attackId: attack.pokemonAttackId,
            attackName: attack.attackName,
            energyCost: attack.energyCost,
            baseDamage: attack.baseDamage,
          })) || [];

        console.log("Transformed attacks:", transformedAttacks);

        const completeData: PokemonType = {
          pokemonId: pokemonData.pokemonId,
          name: pokemonData.name,
          imageId: (pokemonData.imageId || selectedPokemon.imageId).toString(),
          health: pokemonData.health || selectedPokemon.health,
          maxHealth: pokemonData.health || selectedPokemon.health,
          energy: pokemonData.energy || selectedPokemon.energy || 100,
          type: "Normal",
          typeImageId: 1,
          pokemonAttacks: transformedAttacks,
        };

        console.log("Created pokemon data:", completeData);

        const updatedPokemons = [...playerPokemons, completeData];
        console.log("Updated pokemons array:", updatedPokemons);

        setPlayerPokemons(updatedPokemons);
        localStorage.setItem("playerPokemons", JSON.stringify(updatedPokemons));
        setSelectedStarterPokemon(completeData);
        setShowStarterSelection(false);
        setShowText(true);
        setShowSelectionSuccess(true);
        setCurrentTextIndex(3);
      })
      .catch((error) => {
        console.error("Error fetching complete pokemon data:", error);
        alert("Chyba při získávání dat o pokémonovi!");
      });
  };

  if (!location) return <div>Loading...</div>;

  if (location.locationId === 2 && !hasCompletedIntro) {
    return (
      <Bg key={location.imageId} imageId={location.imageId}>
        <StoryBox onClick={handleStoryBoxClick} showContinueText={true}>
          <StoryText
            text={replaceText(
              location.descriptions[currentTextIndex],
              nickname,
              ""
            )}
          />
        </StoryBox>
      </Bg>
    );
  }

  return (
    <Bg key={location.imageId} imageId={location.imageId}>
      {!showBattle && !showStarterSelection && (
        <>
          <PokemonInventory>
            {playerPokemons.map((pokemon, index) => (
              <PokemonCell key={`pokemon-${index}`} pokemon={pokemon} />
            ))}
            {Array(6 - playerPokemons.length)
              .fill(null)
              .map((_, index) => (
                <PokemonCell key={`empty-${index}`} />
              ))}
          </PokemonInventory>
          {(showText || showSelectionSuccess) && (
            <StoryBox onClick={handleStoryBoxClick} showContinueText={true}>
              <StoryText
                text={replaceText(
                  location.descriptions[currentTextIndex],
                  nickname,
                  selectedStarterPokemon?.name || pokemon?.name
                )}
              />
            </StoryBox>
          )}
          {showOptions && (
            <LocationBtn
              connections={locationConnections}
              currentLocationId={parseInt(locationId)}
            />
          )}
          <ItemInventory>
            {playerItems.slice(0, 5).map((item, index) => (
              <ItemInventoryCell key={index} item={item} />
            ))}
            {Array(Math.max(0, 5 - playerItems.length))
              .fill(null)
              .map((_, index) => (
                <ItemInventoryCell key={`empty-${index}`} />
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
