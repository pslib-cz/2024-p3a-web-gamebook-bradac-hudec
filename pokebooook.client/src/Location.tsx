import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
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
import LocationCSS from "./styles/pages/Location.module.css";
import { API_URL } from "./env";

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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
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
  const [selectedPokemonForItem, setSelectedPokemonForItem] = useState<GameItem | null>(null);
  
 
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
      
     
      const locationResponse = await fetch(`${API_URL}api/Locations/${locId}`);
      if (!locationResponse.ok) throw new Error("Failed to fetch location");
      const locationData = await locationResponse.json();
      setLocation(locationData);

     
      const connectionsResponse = await fetch(`${API_URL}api/Locations/${locId}/Connections`);
      const connectionsData = connectionsResponse.ok ? await connectionsResponse.json() : [];
      
      // Vždy filtrujeme spojení tak, aby bylo možné jít pouze dopředu
      const filteredConnections = connectionsData.filter((connection: ConnectionType) => {
        const targetLocationId =
          connection.locationFromId === locId
            ? connection.locationToId
            : connection.locationFromId;
        return targetLocationId > locId; // Zobrazujeme pouze lokace s vyšším ID
      });
      setLocationConnections(filteredConnections);

      
      if (locationData.hasPokemon && locationData.pokemonId) {
        const pokemonResponse = await fetch(`${API_URL}api/Pokemons/${locationData.pokemonId}`);
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
    // Resetujeme stav komponenty
    setCurrentTextIndex(0);
    setShowText(true);
    setShowOptions(false);
    setShowBattle(false);
    setShowStarterSelection(false);
    setHasCompletedIntro(false);
    setShowSelectionSuccess(false);
    setSelectedStarterPokemon(null);
    
    // Načteme vždy aktuální pokémony z localStorage
    try {
      const savedPokemons = localStorage.getItem("playerPokemons");
      if (savedPokemons) {
        setPlayerPokemons(JSON.parse(savedPokemons));
      }
      
      const savedItems = localStorage.getItem("playerItems");
      if (savedItems) {
        setPlayerItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error("Chyba při načítání dat z localStorage:", error);
    }
    
    // Načteme lokaci
    loadLocation();
  }, [locationId]);

 
  function handleBattleComplete(wasVictorious: boolean, earnedItems?: GameItem[]) {
    setShowBattle(false);
    
    if (wasVictorious) {
      setShowOptions(true);
      
      // Po vítězném souboji načteme aktuální seznam pokémonů z localStorage
      try {
        const savedPokemons = localStorage.getItem("playerPokemons");
        if (savedPokemons) {
          const parsedPokemons = JSON.parse(savedPokemons);
          // Aktualizujeme stav playerPokemons, aby reflektoval chyceného pokémona z Battle komponenty
          setPlayerPokemons(parsedPokemons);
          console.log("Aktualizován seznam pokémonů po souboji:", parsedPokemons);
        }
      } catch (error) {
        console.error("Chyba při načítání pokémonů:", error);
      }
      
      // Zpracování získaných předmětů
      if (earnedItems && Array.isArray(earnedItems) && earnedItems.length > 0) {
        console.log("Hráč získal předměty:", earnedItems);
        
        const updatedItems = [...playerItems];
        
        earnedItems.forEach(newItem => {
          // Důležité: Hledáme existující položku PŘESNĚ podle názvu
          // Tímto způsobem zajistíme, že každý typ předmětu bude mít vždy vlastní políčko v inventáři
          const existingItemIndex = updatedItems.findIndex(
            item => item.name === newItem.name
          );
          
          if (existingItemIndex !== -1) {
            // Existující položka se stejným názvem byla nalezena, zvýšíme počet
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              count: (existingItem.count || 1) + 1
            };
          } else {
            // Položka s tímto názvem neexistuje, přidáme ji jako novou
            // Použijeme spread operátor pro vytvoření kopie, abychom předešli sdílení reference
            updatedItems.push({
              ...newItem,
              count: 1
            });
          }
        });
        
        // Vypíšeme pro kontrolu výsledný seznam předmětů
        console.log("Aktualizovaný seznam předmětů:", updatedItems);
        
        setPlayerItems(updatedItems);
        localStorage.setItem("playerItems", JSON.stringify(updatedItems));
      }
    } else {
      const allExhausted = playerPokemons.every(pokemon => pokemon.health <= 0);
      
      if (allExhausted) {
        console.log("Všichni pokémoni jsou vyčerpaní, resetuji hru");
        localStorage.clear();
        setRedirectPath("/nickname");
      } else {
        setShowOptions(true);
      }
    }
  }

  // Funkce pro použití předmětu na pokémona
  function handleUseItem(item: GameItem, pokemonIndex: number) {
    if (!item || pokemonIndex < 0 || pokemonIndex >= playerPokemons.length) {
      return;
    }

    // Vytvoříme kopii pokémona a pole pokémonů, abychom neměnili přímo stav
    const updatedPokemons = [...playerPokemons];
    const pokemon = { ...updatedPokemons[pokemonIndex] };

    // Aplikujeme efekt předmětu
    if (item.effect === "heal") {
      // Výpočet obnovení zdraví
      const newHealth = Math.min(pokemon.health + item.value, pokemon.maxHealth);
      pokemon.health = newHealth;
      console.log(`Použit ${item.name} na ${pokemon.name}. Zdraví: ${pokemon.health}/${pokemon.maxHealth}`);
    } else if (item.effect === "energy") {
      // Výpočet obnovení energie - používáme hodnotu 100 jako maximum
      const MAX_ENERGY = 100; // Definujeme konstantu pro max energii
      const newEnergy = Math.min(pokemon.energy + item.value, MAX_ENERGY);
      pokemon.energy = newEnergy;
      console.log(`Použit ${item.name} na ${pokemon.name}. Energie: ${pokemon.energy}/${MAX_ENERGY}`);
    } else {
      console.log(`Předmět ${item.name} nemá implementovaný efekt: ${item.effect}`);
      return; // Pokud efekt není implementován, nepokračujeme
    }

    // Aktualizujeme pokémona v poli
    updatedPokemons[pokemonIndex] = pokemon;
    setPlayerPokemons(updatedPokemons);

    // Aktualizujeme lokální úložiště
    localStorage.setItem('playerPokemons', JSON.stringify(updatedPokemons));

    // Aktualizujeme stav předmětů - snížíme počet
    const updatedItems = [...playerItems];
    const itemIndex = updatedItems.findIndex(i => i.id === item.id);
    
    if (itemIndex >= 0) {
      if (updatedItems[itemIndex].count && updatedItems[itemIndex].count! > 1) {
        // Snížíme počet předmětu o 1
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          count: updatedItems[itemIndex].count! - 1
        };
      } else {
        // Pokud je to poslední předmět, odstraníme ho z inventáře
        updatedItems.splice(itemIndex, 1);
      }
      
      // Aktualizujeme stav a lokální úložiště
      setPlayerItems(updatedItems);
      localStorage.setItem('playerItems', JSON.stringify(updatedItems));
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

    // Speciální případ pro lokaci s ID 19 - konec příběhu
    if (location.locationId === 19) {
      if (currentTextIndex < location.descriptions.length - 1) {
        setCurrentTextIndex(prevIndex => prevIndex + 1);
      } else {
        // Místo skrytí textu pouze upravíme stav, aby se zobrazilo tlačítko
        setHasCompletedIntro(true);
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

  // Funkce pro návrat do hlavního menu a resetování localStorage
  function handleReturnToMainMenu() {
    // Nejprve aktualizujeme statistiky
    try {
      // Přičteme jeden průchod hry do statistik
      const completedGames = localStorage.getItem("stats_completedGames");
      const newCompletedGames = completedGames ? parseInt(completedGames) + 1 : 1;
      localStorage.setItem("stats_completedGames", newCompletedGames.toString());

      console.log("Dokončený průchod hry zaznamenán do statistik:", newCompletedGames);
    } catch (error) {
      console.error("Chyba při aktualizaci statistik:", error);
    }

    // Resetujeme pouze herní data, ne statistiky
    const statsCompletedGames = localStorage.getItem("stats_completedGames");
    const statsCaughtPokemon = localStorage.getItem("stats_caughtPokemon");
    
    // Resetujeme localStorage
    localStorage.clear();
    
    // Obnovíme statistiky
    if (statsCompletedGames) {
      localStorage.setItem("stats_completedGames", statsCompletedGames);
    }
    if (statsCaughtPokemon) {
      localStorage.setItem("stats_caughtPokemon", statsCaughtPokemon);
    }
    
    // Místo navigate použijeme setRedirectPath
    setRedirectPath("/");
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
      fetch(`${API_URL}api/Pokemons/${selectedPokemon.id}`)
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

  // Přidám funkci pro výběr předmětu
  function handleItemSelect(item: GameItem) {
    // Pokud byl vybrán předmět, zobrazíme výběr pokémona
    setSelectedPokemonForItem(item);
  }

  // Funkce pro výběr pokémona pro aplikaci předmětu
  function handlePokemonSelectForItem(pokemonIndex: number) {
    if (selectedPokemonForItem) {
      // Použijeme vybraný předmět na vybraného pokémona
      handleUseItem(selectedPokemonForItem, pokemonIndex);
      // Resetujeme výběr
      setSelectedPokemonForItem(null);
    }
  }

  function cancelItemSelection() {
    // Zrušení výběru předmětu
    setSelectedPokemonForItem(null);
  }

  // Pokud máme nastavený redirectPath, přesměrujeme
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
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
      {/* Výběr pokémona pro použití předmětu */}
      {selectedPokemonForItem && (
        <div className={LocationCSS["item-pokemon-selection"]}>
          <h3>Vyber pokémona pro použití předmětu {selectedPokemonForItem.name}</h3>
          <div className={LocationCSS["pokemon-selection-grid"]}>
            {playerPokemons.map((pokemon, index) => (
              <div 
                key={index} 
                className={`${LocationCSS["pokemon-option"]} ${pokemon.health <= 0 ? LocationCSS["disabled"] : ''}`}
                onClick={() => pokemon.health > 0 ? handlePokemonSelectForItem(index) : null}
              >
                <img
                  src={`${API_URL}/api/Images/${pokemon.imageId}`}
                  alt={pokemon.name}
                  className={LocationCSS["pokemon-image"]}
                />
                <div className={LocationCSS["pokemon-info"]}>
                  <span className={LocationCSS["pokemon-name"]}>{pokemon.name}</span>
                  <span>HP: {pokemon.health}/{pokemon.maxHealth}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            className={LocationCSS["cancel-button"]} 
            onClick={cancelItemSelection}
          >
            Zrušit
          </button>
        </div>
      )}

      {!showBattle && !showStarterSelection && !selectedPokemonForItem && (
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
            <StoryBox onClick={location?.locationId === 19 && currentTextIndex >= (location.descriptions.length - 1) ? undefined : handleStoryBoxClick} showContinueText={!(location?.locationId === 19 && currentTextIndex >= (location.descriptions.length - 1))}>
              <StoryText
                text={replaceText(
                  location.descriptions[currentTextIndex],
                  nickname,
                  selectedStarterPokemon?.name || pokemon?.name
                )}
              />
              {location.locationId === 19 && currentTextIndex >= (location.descriptions.length - 1) && (
                <button 
                  onClick={handleReturnToMainMenu}
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.5em',
                    backgroundColor: '#d9d9d9',
                    border: 'solid 5px #a1a1a1',
                    borderRadius: '20px',
                    color: '#fff',
                    cursor: 'pointer',
                    textShadow: '1px 1px 30px #000',
                    marginTop: '20px'
                  }}
                >
                  Zpět do hlavního menu
                </button>
              )}
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
              <ItemInventoryCell 
                key={item.id} 
                item={item} 
                onClick={handleItemSelect}
              />
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