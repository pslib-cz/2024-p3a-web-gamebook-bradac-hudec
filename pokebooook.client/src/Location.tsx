import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LocationType from "./types/LocationType";
import ConnectionType from "./types/ConnectionType";
import StoryBox from "./components/StoryBox";
import StoryText from "./components/StoryText";
import Bg from "./components/Bg";
import LocationOptions from "./components/LocationBtn";
import PokemonInventory from "./Menus/PokemonInventory";
import PokemonCell from "./components/PokemonCell";
import ItemInventory from "./Menus/ItemInventory";
import ItemInventoryCell from "./components/ItemInventoryCell";
import Battle from "./Battle";
import StarterSelection from "./components/StarterSelection";
import StarterPokemon from "./types/StarterPokemon";
import PokemonType from "./types/PokemonType";
import GameItem from "./types/GameItem";


const replaceText = (
  text: string,
  nickname: string,
  pokemonName: string | undefined
) => {
  let processedText = text.replace("{nickname}", nickname);
  processedText = processedText.replace("{pokemonname}", pokemonName || "");
  return processedText;
};

const Location: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  if (!locationId) throw new Error("No location ID provided");

  
  const [location, setLocation] = useState<LocationType | null>(null);
  const [locationConnections, setLocationConnections] = useState<ConnectionType[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(true);
  const [showBattle, setShowBattle] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const [showStarterSelection, setShowStarterSelection] = useState<boolean>(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);
  const [showSelectionSuccess, setShowSelectionSuccess] = useState<boolean>(false);
  const [selectedStarterPokemon, setSelectedStarterPokemon] = useState<PokemonType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
 
  const [playerPokemons, setPlayerPokemons] = useState<PokemonType[]>(() => {
    try {
      const saved = localStorage.getItem("playerPokemons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [playerItems, setPlayerItems] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("playerItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [visitedLocations, setVisitedLocations] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("visitedLocations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const nickname = localStorage.getItem("nickname") || "trenér";

  
  async function loadLocation() {
    setIsLoading(true);
    
    try {
     
      if (!locationId) {
        throw new Error("Neplatné ID lokace");
      }
      
      const locId = parseInt(locationId);
      
     
      const locationResponse = await fetch(`/api/Locations/${locId}`);
      if (!locationResponse.ok) throw new Error("Failed to fetch location");
      const locationData = await locationResponse.json();
      setLocation(locationData);

     
      const connectionsResponse = await fetch(`/api/Locations/${locId}/Connections`);
      const connectionsData = connectionsResponse.ok ? await connectionsResponse.json() : [];
      
     
      const filteredConnections = connectionsData.filter((connection: ConnectionType) => {
        const targetLocationId =
          connection.locationFromId === locId
            ? connection.locationToId
            : connection.locationFromId;
        return !visitedLocations.includes(targetLocationId);
      });
      
      setLocationConnections(filteredConnections);

      
      if (locationData.hasPokemon && locationData.pokemonId) {
        const pokemonResponse = await fetch(`/api/Pokemons/${locationData.pokemonId}`);
        if (pokemonResponse.ok) {
          const pokemonData = await pokemonResponse.json();
          setPokemon(pokemonData);
        } else {
          setPokemon(null);
        }
      }

    
      if (!visitedLocations.includes(locId)) {
        const updatedLocations = [...visitedLocations, locId];
        localStorage.setItem("visitedLocations", JSON.stringify(updatedLocations));
        setVisitedLocations(updatedLocations);
      }
    } catch (error) {
      console.error("Chyba při načítání lokace:", error);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
   
    setCurrentTextIndex(0);
    setShowText(true);
    setShowOptions(false);
    setShowBattle(false);
    setShowStarterSelection(false);
    setHasCompletedIntro(false);
    setShowSelectionSuccess(false);
    setSelectedStarterPokemon(null);
    
    
    loadLocation();
  }, [locationId]);

 
  function handleBattleComplete(wasVictorious: boolean, earnedItems?: GameItem[]) {
    setShowBattle(false);
    
    if (wasVictorious) {
      setShowOptions(true);
      
      
      if (earnedItems && Array.isArray(earnedItems) && earnedItems.length > 0) {
        console.log("Hráč získal předměty:", earnedItems);
        
     
        const updatedItems = [...playerItems];
        
       
        earnedItems.forEach(newItem => {
          
          const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
          
          if (existingItemIndex !== -1) {
         
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              count: (existingItem.count || 1) + 1
            };
          } else {
            
            updatedItems.push(newItem);
          }
        });
        
        
        setPlayerItems(updatedItems);
        
        
        localStorage.setItem("playerItems", JSON.stringify(updatedItems));
      }
    } else {
     
      const allExhausted = playerPokemons.every(pokemon => pokemon.health <= 0);
      
      if (allExhausted) {
       
        console.log("Všichni pokémoni jsou vyčerpaní, resetuji hru");
        
       
        localStorage.clear();
        
        
        window.location.href = "/nickname";
      } else {
        
        setShowOptions(true);
      }
    }
  }

  function handleStoryBoxClick() {
    if (!location) return;

    if (location.locationId === 2 && showSelectionSuccess) {
      if (currentTextIndex < location.descriptions.length - 1) {
        setCurrentTextIndex(prevIndex => prevIndex + 1);
      } else {
        setShowText(false);
        setShowOptions(true);
        setShowSelectionSuccess(false); 
      }
      return;
    }

    if (location.locationId === 2) {
      if (currentTextIndex < 2) {
        setCurrentTextIndex(prevIndex => prevIndex + 1);
      } else {
        setShowText(false);
        setHasCompletedIntro(true);
        setShowStarterSelection(true);
      }
      return;
    }

    if (currentTextIndex < location.descriptions.length - 1) {
      setCurrentTextIndex(prevIndex => prevIndex + 1);
    } else {
      setShowText(false);
      setHasCompletedIntro(true);
      
      if (location.hasPokemon) {
        setShowBattle(true);
      } else {
        setShowOptions(true);
      }
    }
  }

  function handleStarterSelection(selectedPokemon: StarterPokemon) {
    if (playerPokemons.length >= 6) {
      alert("Nemůžeš mít více než 6 pokémonů!");
      setShowStarterSelection(false);
      setShowOptions(true);
      return;
    }

    if (!selectedPokemon.id) {
      alert("Chyba při výběru pokémona!");
      return;
    }

    setIsLoading(true);
    fetch(`/api/Pokemons/${selectedPokemon.id}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(pokemonData => {
        if (!pokemonData || !pokemonData.pokemonId) {
          throw new Error("Invalid pokemon data received from API");
        }

        const transformedAttacks = 
          pokemonData.pokemonAttacks?.map((attack: {
            pokemonAttackId: number;
            attackName: string;
            energyCost: number;
            baseDamage: number;
          }) => ({
            attackId: attack.pokemonAttackId,
            attackName: attack.attackName,
            energyCost: attack.energyCost,
            baseDamage: attack.baseDamage,
          })) || [];

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

        const updatedPokemons = [...playerPokemons, completeData];
        localStorage.setItem("playerPokemons", JSON.stringify(updatedPokemons));
        setPlayerPokemons(updatedPokemons);
        setSelectedStarterPokemon(completeData);
        setShowStarterSelection(false);
        setShowText(true);
        setShowSelectionSuccess(true);
        setCurrentTextIndex(3);
      })
      .catch(() => {
        alert("Chyba při získávání dat o pokémonovi!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (isLoading) return <div className="loading-spinner">Načítání...</div>;
  if (!location) return <div>Lokace nenalezena</div>;

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
            {Array(Math.max(0, 6 - playerPokemons.length))
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
            <LocationOptions
              connections={locationConnections}
              currentLocationId={parseInt(locationId)}
            />
          )}
          
          <ItemInventory>
            {playerItems.slice(0, 5).map((item) => (
              <ItemInventoryCell key={item.id} item={item} />
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
        <Battle 
          locationPokemonId={pokemon.pokemonId} 
          onBattleComplete={handleBattleComplete}
        />
      )}
    </Bg>
  );
};

export default Location;