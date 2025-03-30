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

 
  const [currentMessage, setCurrentMessage] = useState<string>("");
  
  async function loadLocation() {
    setIsLoading(true);
    
    try {
     
      if (!locationId) {
        throw new Error("Neplatné ID lokace");
      }
      
      const locId = parseInt(locationId);
      
      
      if ([17, 18, 19].includes(locId)) {
        
        const savedPokemons = localStorage.getItem("playerPokemons");
        const parsedPokemons = savedPokemons ? JSON.parse(savedPokemons) : [];
        
        if (parsedPokemons.length < 6) {
          console.log(`Pokus o vstup do lokace ${locId} s ${parsedPokemons.length} pokémony. Potřeba 6.`);
          setCurrentMessage("Pro vstup do této oblasti potřebuješ tým 6 pokémonů!");
          
        
          const validLocations = visitedLocations.filter(loc => ![17, 18, 19].includes(loc));
          const lastValidLocation = validLocations.length > 0 ? Math.max(...validLocations) : 1;
          
     
          setRedirectPath(`/location/${lastValidLocation}`);
          return;
        }
      }
      
      const locationResponse = await fetch(`${API_URL}api/Locations/${locId}`);
      if (!locationResponse.ok) throw new Error("Failed to fetch location");
      const locationData = await locationResponse.json();
      setLocation(locationData);

     
      const connectionsResponse = await fetch(`${API_URL}api/Locations/${locId}/Connections`);
      const connectionsData = connectionsResponse.ok ? await connectionsResponse.json() : [];
      
      
      const filteredConnections = connectionsData.filter((connection: ConnectionType) => {
        const targetLocationId =
          connection.locationFromId === locId
            ? connection.locationToId
            : connection.locationFromId;
        return targetLocationId > locId; 
      });
      setLocationConnections(filteredConnections);

 
      if (locId === 18) {
        try {
          console.log("Finální bitva s šampionem - léčení pokémonů hráče");
          const savedPokemons = localStorage.getItem("playerPokemons");
          if (savedPokemons) {
            const parsedPokemons = JSON.parse(savedPokemons);
            
            const healedPokemons = parsedPokemons.map((pokemon: PokemonType) => ({
              ...pokemon,
              health: pokemon.maxHealth || pokemon.health,
              energy: 100
            }));
            localStorage.setItem("playerPokemons", JSON.stringify(healedPokemons));
            setPlayerPokemons(healedPokemons);
            console.log("Pokémoni hráče byli vyléčeni před finální bitvou", healedPokemons);
          }
        } catch (error) {
          console.error("Chyba při léčení pokémonů hráče:", error);
        }
      }
      
      if (locationData.hasPokemon) {
      
        if (locId !== 18) {
          try {
          
            const pokemonsResponse = await fetch(`${API_URL}api/Pokemons`);
            if (!pokemonsResponse.ok) throw new Error("Failed to fetch pokemons");
            
            const pokemonsData = await pokemonsResponse.json();
            const pokemonList = Array.isArray(pokemonsData.value) ? pokemonsData.value : pokemonsData;
            
            if (pokemonList.length > 0) {
             
              const randomIndex = Math.floor(Math.random() * pokemonList.length);
              const randomPokemon = pokemonList[randomIndex];
              
             
              const pokemonResponse = await fetch(`${API_URL}api/Pokemons/${randomPokemon.pokemonId}`);
              if (pokemonResponse.ok) {
                const pokemonData = await pokemonResponse.json();
                setPokemon(pokemonData);
                console.log(`Náhodný pokémon v lokaci ${locId}: ${pokemonData.name}`);
              } else {
                setPokemon(null);
                console.error("Nepodařilo se získat detaily náhodného pokémona");
              }
            } else {
              setPokemon(null);
              console.error("Seznam pokémonů je prázdný");
            }
          } catch (error) {
            console.error("Chyba při načítání náhodného pokémona:", error);
            setPokemon(null);
          }
        } 
       
        else {
          try {
            console.log("Finální bitva se šampionem - příprava 6 unikátních pokémonů");
            
            
            const pokemonsResponse = await fetch(`${API_URL}api/Pokemons`);
            if (!pokemonsResponse.ok) throw new Error("Failed to fetch pokemons");
            
            const pokemonsData = await pokemonsResponse.json();
            const pokemonList = Array.isArray(pokemonsData.value) ? pokemonsData.value : pokemonsData;
            
            if (pokemonList.length >= 6) {
             
              const shuffledPokemons = [...pokemonList].sort(() => Math.random() - 0.5);
              
              
              const selectedPokemons = shuffledPokemons.slice(0, 6);
              
              try {
              
                const championTeam = [];
                
               
                for (const pokemon of selectedPokemons) {
                  const detailResponse = await fetch(`${API_URL}api/Pokemons/${pokemon.pokemonId}`);
                  if (detailResponse.ok) {
                    const detailData = await detailResponse.json();
                    
                   
                    const attacks = Array.isArray(detailData.pokemonAttacks) ? detailData.pokemonAttacks : [];
                    
                  
                    const pokemonAttacks = attacks.length > 0 ? attacks : [
                      {
                        pokemonAttackId: 2000,
                        attackName: "Tackle",
                        energyCost: 20,
                        baseDamage: 40
                      },
                      {
                        pokemonAttackId: 2001,
                        attackName: "Scratch",
                        energyCost: 15,
                        baseDamage: 30
                      },
                      {
                        pokemonAttackId: 2002,
                        attackName: "Growl",
                        energyCost: 10,
                        baseDamage: 20
                      }
                    ];
                    
                 
                    championTeam.push({
                      pokemonId: detailData.pokemonId,
                      name: detailData.name,
                      health: detailData.health,
                      maxHealth: detailData.health,
                      energy: detailData.energy || 100,
                      typeId: detailData.typeId,
                      imageId: detailData.imageId,
                      type: "Normal",
                      typeImageId: 1,
                      pokemonAttacks: pokemonAttacks
                    });
                  }
                }
                
               
                if (championTeam.length > 0) {
                  localStorage.setItem("championTeam", JSON.stringify(championTeam));
                  
                  const firstPokemonDetailResponse = await fetch(`${API_URL}api/Pokemons/${championTeam[0].pokemonId}`);
                  if (firstPokemonDetailResponse.ok) {
                    const firstPokemonData = await firstPokemonDetailResponse.json();
                    setPokemon(firstPokemonData);
                    console.log(`Šampionův první pokémon: ${championTeam[0].name}`);
                    console.log(`Šampionův tým (${championTeam.length} pokémonů):`, championTeam);
                  } else {
                    throw new Error("Nepodařilo se načíst detaily prvního pokémona šampiona");
                  }
                } else {
                  throw new Error("Nepodařilo se načíst žádného pokémona pro tým šampiona");
                }
              } catch (error) {
                console.error("Chyba při načítání detailů pokémonů šampiona:", error);
                setPokemon(null);
              }
            } else {
              console.warn("Není dostatek pokémonů pro tým šampiona, použijeme dostupné");
              
              if (pokemonList.length > 0) {
                const randomIndex = Math.floor(Math.random() * pokemonList.length);
                const randomPokemon = pokemonList[randomIndex];
                
                const pokemonResponse = await fetch(`${API_URL}api/Pokemons/${randomPokemon.pokemonId}`);
                if (pokemonResponse.ok) {
                  const pokemonData = await pokemonResponse.json();
                  setPokemon(pokemonData);
                }
              }
            }
          } catch (error) {
            console.error("Chyba při načítání týmu šampiona:", error);
            setPokemon(null);
          }
        }
      }

    
      if (!visitedLocations.includes(locId)) {
        const updatedLocations = [...visitedLocations, locId];
        localStorage.setItem("visitedLocations", JSON.stringify(updatedLocations));
        setVisitedLocations(updatedLocations);
      }
    } catch (error) {
      console.error("Chyba při načítání lokace:", error);
    }
      setIsLoading(false);
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
    

    loadLocation();
  }, [locationId]);

 
  function handleBattleComplete(wasVictorious: boolean, earnedItems?: GameItem[]) {
    setShowBattle(false);
    
    if (wasVictorious) {
      setShowOptions(true);
      
    
      try {
        const savedPokemons = localStorage.getItem("playerPokemons");
        if (savedPokemons) {
          const parsedPokemons = JSON.parse(savedPokemons);
         
          setPlayerPokemons(parsedPokemons);
          console.log("Aktualizován seznam pokémonů po souboji:", parsedPokemons);
        }
      } catch (error) {
        console.error("Chyba při načítání pokémonů:", error);
      }
      
     
      if (earnedItems && Array.isArray(earnedItems) && earnedItems.length > 0) {
        console.log("Hráč získal předměty:", earnedItems);
        
        const updatedItems = [...playerItems];
        
        earnedItems.forEach(newItem => {
        
          const existingItemIndex = updatedItems.findIndex(
            item => item.name === newItem.name
          );
          
          if (existingItemIndex !== -1) {
          
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              count: (existingItem.count || 1) + 1
            };
          } else {
          
            updatedItems.push({
              ...newItem,
              count: 1
            });
          }
        });
        
        console.log("Aktualizovaný seznam předmětů:", updatedItems);
        
        setPlayerItems(updatedItems);
        localStorage.setItem("playerItems", JSON.stringify(updatedItems));
      }
    } else {
      const allExhausted = playerPokemons.every(pokemon => pokemon.health <= 0);
      
      if (allExhausted) {
        console.log("Všichni pokémoni jsou vyčerpaní, resetuji hru");
        
        const stats = {
          completedGames: localStorage.getItem("stats_completedGames"),
          caughtPokemon: localStorage.getItem("stats_caughtPokemon")
        };
        
        localStorage.clear();
        
        if (stats.completedGames) {
          localStorage.setItem("stats_completedGames", stats.completedGames);
        }
        if (stats.caughtPokemon) {
          localStorage.setItem("stats_caughtPokemon", stats.caughtPokemon);
        }
        
        setRedirectPath("/nickname");
      } else {
        setShowOptions(true);
      }
    }
  }

  
  function handleUseItem(item: GameItem, pokemonIndex: number) {
    if (!item || pokemonIndex < 0 || pokemonIndex >= playerPokemons.length) {
      return;
    }

    
    const updatedPokemons = [...playerPokemons];
    const pokemon = { ...updatedPokemons[pokemonIndex] };

    
    if (item.effect === "heal") {
      
      const newHealth = Math.min(pokemon.health + item.value, pokemon.maxHealth);
      pokemon.health = newHealth;
      console.log(`Použit ${item.name} na ${pokemon.name}. Zdraví: ${pokemon.health}/${pokemon.maxHealth}`);
    } else if (item.effect === "energy") {
     
      const MAX_ENERGY = 100; 
      const newEnergy = Math.min(pokemon.energy + item.value, MAX_ENERGY);
      pokemon.energy = newEnergy;
      console.log(`Použit ${item.name} na ${pokemon.name}. Energie: ${pokemon.energy}/${MAX_ENERGY}`);
    } else {
      console.log(`Předmět ${item.name} nemá implementovaný efekt: ${item.effect}`);
      return; 
    }

    
    updatedPokemons[pokemonIndex] = pokemon;
    setPlayerPokemons(updatedPokemons);

    
    localStorage.setItem('playerPokemons', JSON.stringify(updatedPokemons));

    
    const updatedItems = [...playerItems];
    const itemIndex = updatedItems.findIndex(i => i.id === item.id);
    
    if (itemIndex >= 0) {
      if (updatedItems[itemIndex].count && updatedItems[itemIndex].count! > 1) {
        
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          count: updatedItems[itemIndex].count! - 1
        };
      } else {
       
        updatedItems.splice(itemIndex, 1);
      }
      
    
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

    
    if (location.locationId === 19) {
      if (currentTextIndex < location.descriptions.length - 1) {
        setCurrentTextIndex(prevIndex => prevIndex + 1);
      } else {
       
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

  
  function handleReturnToMainMenu() {
    
    try {
    
      const completedGames = localStorage.getItem("stats_completedGames") || "0";
     
      const newCompletedGames = parseInt(completedGames) + 1;
      
      localStorage.setItem("stats_completedGames", newCompletedGames.toString());

      console.log("Dokončený průchod hry zaznamenán do statistik. Celkem dokončeno:", newCompletedGames);
    } catch (error) {
      console.error("Chyba při aktualizaci statistik dokončených her:", error);
    }

    
    const stats = {
      completedGames: localStorage.getItem("stats_completedGames"),
      caughtPokemon: localStorage.getItem("stats_caughtPokemon")
    };
    
 
    localStorage.clear();
    
   
    if (stats.completedGames) {
      localStorage.setItem("stats_completedGames", stats.completedGames);
    }
    if (stats.caughtPokemon) {
      localStorage.setItem("stats_caughtPokemon", stats.caughtPokemon);
    }
    
    
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

 
  function handleItemSelect(item: GameItem) {
   
    setSelectedPokemonForItem(item);
  }

 
  function handlePokemonSelectForItem(pokemonIndex: number) {
    if (selectedPokemonForItem) {
     
      handleUseItem(selectedPokemonForItem, pokemonIndex);
   
      setSelectedPokemonForItem(null);
    }
  }

  function cancelItemSelection() {
   
    setSelectedPokemonForItem(null);
  }

 
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (isLoading) return <div className="loading-spinner">Načítání...</div>;
  if (!location) return <div>Lokace nenalezena</div>;

  if (currentMessage) {
    return (
      <Bg key={location.imageId} imageId={location.imageId}>
        <StoryBox onClick={() => setRedirectPath(`/location/${visitedLocations[visitedLocations.length - 1] || 1}`)} showContinueText={true}>
          <StoryText text={currentMessage} />
        </StoryBox>
      </Bg>
    );
  }

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
                  src={`${API_URL}api/Images/${pokemon.imageId}`}
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
          locationPokemon={pokemon}
          isChampionBattle={location?.locationId === 18}
          onBattleComplete={handleBattleComplete}
        />
      )}
    </Bg>
  );
};

export default Location; 