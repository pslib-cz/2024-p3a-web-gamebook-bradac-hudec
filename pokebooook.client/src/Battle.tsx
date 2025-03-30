import React, { useState, useEffect } from "react";
import PokemonContainer from "./components/PokemonContainer";
import StoryBox from "./components/StoryBox";
import AttacksContainer from "./components/AttacksContainer";
import PokemonType from "./types/PokemonType";
import AttackType from "./types/AttackType";
import BattleCSS from "./styles/pages/Battle.module.css";
import ItemInventory from "./Menus/ItemInventory";
import PokemonInventory from "./Menus/PokemonInventory";
import ItemInventoryCell from "./components/ItemInventoryCell";
import PokemonCell from "./components/PokemonCell";
import PokemonTypeEnum from "./types/PokemonTypeEnum";
import PokemonAttack from "./types/pokemonAttacks";
import GameItem from "./types/GameItem";
import PokemonSelectionGrid from "./components/PokemonSelectionGrid";
import VictoryScreen from "./components/VictoryScreen";
import GameOverScreen from "./components/GameOverScreen";
import { API_URL } from "./env";

interface BattleState {
  player: {
    pokemon: PokemonType | null;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    attacks: AttackType[];
  };
  enemy: {
    pokemon: PokemonType | null;
    health: number;
    maxHealth: number;
    attacks: AttackType[];
  };
}

type BattleProps = {
  locationPokemonId?: number;
  locationPokemon?: PokemonType;
  isChampionBattle?: boolean;
  onBattleComplete: (wasVictorious: boolean, earnedItems?: GameItem[]) => void;
};

const Battle: React.FC<BattleProps> = ({
  locationPokemonId,
  locationPokemon,
  isChampionBattle = false,
  onBattleComplete,
}) => {
  const [battleState, setBattleState] = useState<BattleState>({
    player: {
      pokemon: null,
      health: 0,
      maxHealth: 0,
      energy: 0,
      maxEnergy: 0,
      attacks: [],
    },
    enemy: {
      pokemon: null,
      health: 0,
      maxHealth: 0,
      attacks: [],
    },
  });
  const [playerPokemons, setPlayerPokemons] = useState<PokemonType[]>(() => {
    const saved = localStorage.getItem("playerPokemons");
    return saved ? JSON.parse(saved) : [];
  });
  const [playerItems, setPlayerItems] = useState<GameItem[]>(() => {
    const saved = localStorage.getItem("playerItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [showPokemonSelection, setShowPokemonSelection] =
    useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<string>(
    "Vyber si svého pokémona!"
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState<boolean>(false);
  const [earnedItems, setEarnedItems] = useState<GameItem[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonTypeEnum[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [capturedPokemon, setCapturedPokemon] = useState<PokemonType | null>(null);
  const [championTeam, setChampionTeam] = useState<PokemonType[]>([]);
  const [championPokemonIndex, setChampionPokemonIndex] = useState<number>(0);

  useEffect(() => {
    fetchPokemonTypes();
    
    // Přidáme instanceId ke všem pokémonům hráče, pokud ho ještě nemají
    const updatedPokemons = playerPokemons.map(pokemon => {
      if (!pokemon.instanceId) {
        // Vytvoříme náhodné ID pro každou instanci pokémona
        return { ...pokemon, instanceId: `pokemon_${pokemon.pokemonId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` };
      }
      return pokemon;
    });
    
    // Pokud jsme upravili nějaké pokémony, aktualizujeme localStorage a stav
    if (updatedPokemons.some(p => !p.instanceId)) {
      setPlayerPokemons(updatedPokemons);
      localStorage.setItem("playerPokemons", JSON.stringify(updatedPokemons));
      console.log("Přidána instanceId ke všem pokémonům hráče", updatedPokemons);
    }
    
    // Načteme tým šampiona, pokud jde o finální bitvu
    if (isChampionBattle) {
      try {
        const savedChampionTeam = localStorage.getItem("championTeam");
        if (savedChampionTeam) {
          const parsedTeam = JSON.parse(savedChampionTeam);
          setChampionTeam(parsedTeam);
          console.log("Načten tým šampiona:", parsedTeam);
        }
      } catch (error) {
        console.error("Chyba při načítání týmu šampiona:", error);
      }
    }
  }, [isChampionBattle]);

  const checkBattleEnd = (playerHealth: number, enemyHealth: number) => {
    if (enemyHealth <= 0) {
      if (isChampionBattle && championPokemonIndex < championTeam.length - 1) {
        setChampionPokemonIndex(prevIndex => prevIndex + 1);
        
        const nextPokemon = championTeam[championPokemonIndex + 1];
        setCurrentMessage(`Šampion posílá do boje ${nextPokemon.name}!`);
        
        setTimeout(() => {
          const updatedIndex = championPokemonIndex + 1;
          initializeBattle(battleState.player.pokemon as PokemonType, updatedIndex);
        }, 2000);
        
        return true;
      }
      
      setCurrentMessage(isChampionBattle 
        ? "Vítězství! Porazil jsi všechny pokémony šampiona!" 
        : "Vítězství! Porazil jsi protivníka!");
      setIsPlayerTurn(false);
      setBattleEnded(true);

      (async () => {
        await generateRewards();
        
        handleVictory();
      })();

      return true;
    }

    if (playerHealth <= 0) {
      const hasLivePokemon = playerPokemons.some(
        (pokemon) =>
          pokemon.health > 0 &&
          // Použijeme instanceId k jednoznačnému rozlišení pokémonů
          (battleState.player.pokemon?.instanceId 
            ? pokemon.instanceId !== battleState.player.pokemon.instanceId
            : pokemon.pokemonId !== battleState.player.pokemon?.pokemonId)
      );

      if (hasLivePokemon) {
        setCurrentMessage(
          `${battleState.player.pokemon?.name} omdlel! Vyber dalšího pokémona!`
        );

        const newPlayerPokemons = [...playerPokemons];
        // Použijeme instanceId pro přesné nalezení aktuálního pokémona
        const selectedPokemonIndex = newPlayerPokemons.findIndex(
          (p) => battleState.player.pokemon?.instanceId 
                 ? p.instanceId === battleState.player.pokemon.instanceId
                 : (p.pokemonId === battleState.player.pokemon?.pokemonId && 
                   (!p.instanceId || !battleState.player.pokemon?.instanceId))
        );

        if (selectedPokemonIndex !== -1) {
          // Nastavíme pokémona jednoznačně na mrtvého
          newPlayerPokemons[selectedPokemonIndex] = {
            ...newPlayerPokemons[selectedPokemonIndex],
            health: 0
          };
          localStorage.setItem(
            "playerPokemons",
            JSON.stringify(newPlayerPokemons)
          );
          setPlayerPokemons(newPlayerPokemons);
          console.log(`Pokémon ${newPlayerPokemons[selectedPokemonIndex].name} byl označen jako vyčerpaný`);
        } else {
          console.warn(`Nepodařilo se najít aktuálního pokémona ${battleState.player.pokemon?.name} v seznamu`);
        }

        setShowPokemonSelection(true);

        return false;
      } else {
        setCurrentMessage("Všichni tví pokémoni omdleli! Hra končí!");

        const newPlayerPokemons = playerPokemons.map((pokemon) => ({
          ...pokemon,
          health: 0,
        }));
        localStorage.setItem(
          "playerPokemons",
          JSON.stringify(newPlayerPokemons)
        );
        setPlayerPokemons(newPlayerPokemons);

        setGameOver(true);
        setBattleEnded(true);
        return true;
      }
    }

    return false;
  };

  const generateRewards = async () => {
    try {
      console.log("Začátek generování odměn");

      const response = await fetch(`${API_URL}api/Items`);

      if (response.ok) {
        const items = await response.json();

        if (items.length === 0) {
          console.warn("Žádné předměty nejsou k dispozici");
          setEarnedItems([]);
          return;
        }

        const shuffledItems = [...items].sort(() => Math.random() - 0.5);
        
        const selectedItems = [];
        
        if (shuffledItems.length > 0) {
          selectedItems.push({...shuffledItems[0]});
        }

        console.log("Vygenerované předměty:", selectedItems);

        setEarnedItems(selectedItems);

        return selectedItems;
      }
    } catch (err) {
      console.error("Chyba při získávání odměn:", err);
      setEarnedItems([]);
    }
  };

  const handlePokemonSelection = async (selectedPokemon: PokemonType) => {
    if (!selectedPokemon || !selectedPokemon.pokemonId) {
      setCurrentMessage("Neplatný pokémon!");
      return;
    }

    if (selectedPokemon.health <= 0) {
      setCurrentMessage("Tento pokémon je vyčerpaný! Vyber jiného.");
      return;
    }

    if (selectedPokemon.energy === undefined) {
      console.log("Pokémon nemá definovanou energii, nastavujeme na 100");
      selectedPokemon.energy = 100;
    }

    setLoading(true);
    try {
      await initializeBattle(selectedPokemon);
      setShowPokemonSelection(false);
      setCurrentMessage(`Jdi do toho, ${selectedPokemon.name}!`);
      setBattleEnded(false);
      setIsPlayerTurn(true);
    } catch (err) {
      console.error("Chyba při výběru pokémona:", err);
      setCurrentMessage("Něco se pokazilo při výběru pokémona. Zkus to znovu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonTypes = async () => {
    try {
      const response = await fetch(`${API_URL}api/PokemonTypes`);
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon types");
      }
      const data = await response.json();
      setPokemonTypes(data);
    } catch (error) {
      console.error("Chyba při načítání typů pokémonů:", error);
      setCurrentMessage(
        "Nepodařilo se načíst typy pokémonů. Zkuste to prosím znovu."
      );
    }
  };

  const initializeBattle = async (selectedPokemon: PokemonType, championIndex?: number) => {
    try {
      if (!selectedPokemon.pokemonId) {
        throw new Error("Selected pokemon has no valid ID");
      }

      if (!isChampionBattle && !locationPokemon && !locationPokemonId) {
        throw new Error("Location pokemon or its ID is missing");
      }

      const playerResponse = await fetch(
        `${API_URL}api/Pokemons/${selectedPokemon.pokemonId}`
      );

      let enemyData;
      
      if (isChampionBattle && championTeam.length > 0) {
        const indexToUse = championIndex !== undefined ? championIndex : championPokemonIndex;
        enemyData = championTeam[indexToUse];
        console.log(`Šampionův pokémon č. ${indexToUse + 1}: ${enemyData.name}`);
      } else if (locationPokemon) {
        enemyData = locationPokemon;
      } else {
        const enemyResponse = await fetch(`${API_URL}api/Pokemons/${locationPokemonId}`);
        if (!enemyResponse.ok) {
          throw new Error("Failed to fetch enemy Pokémon data");
        }
        enemyData = await enemyResponse.json();
      }

      if (!playerResponse.ok) {
        throw new Error("Failed to fetch player Pokémon data");
      }

      const playerData = await playerResponse.json();

      const playerType = pokemonTypes.find(
        (t) => t.typeId === playerData.typeId
      );
      const enemyType = pokemonTypes.find((t) => t.typeId === enemyData.typeId);

      if (!playerType || !enemyType) {
        throw new Error("Failed to find Pokemon types");
      }

      if (
        !playerData.pokemonAttacks ||
        !Array.isArray(playerData.pokemonAttacks)
      ) {
        throw new Error("Player pokemon has no attacks");
      }

      if (
        !enemyData.pokemonAttacks ||
        !Array.isArray(enemyData.pokemonAttacks)
      ) {
        throw new Error("Enemy pokemon has no attacks");
      }

      const playerAttacks = playerData.pokemonAttacks.map(
        (attack: PokemonAttack) => ({
          attackId: attack.pokemonAttackId,
          attackName: attack.attackName,
          energyCost: attack.energyCost,
          baseDamage: attack.baseDamage,
        })
      );

      const enemyAttacks = enemyData.pokemonAttacks.map(
        (attack: PokemonAttack) => ({
          attackId: attack.pokemonAttackId,
          attackName: attack.attackName,
          energyCost: attack.energyCost,
          baseDamage: attack.baseDamage,
        })
      );

      if (playerAttacks.length === 0) {
        console.log("Hráčův pokémon nemá žádné útoky, přidávám základní sadu");
        playerAttacks.push(
          {
            attackId: 1000,
            attackName: "Tackle",
            energyCost: 20,
            baseDamage: 40
          },
          {
            attackId: 1001,
            attackName: "Quick Attack",
            energyCost: 15,
            baseDamage: 30
          },
          {
            attackId: 1002,
            attackName: "Flee",
            energyCost: 0,
            baseDamage: 0
          }
        );
      }

      if (enemyAttacks.length === 0) {
        console.log("Nepřátelský pokémon nemá žádné útoky, přidávám základní sadu");
        enemyAttacks.push(
          {
            attackId: 2000,
            attackName: "Tackle",
            energyCost: 20,
            baseDamage: 40
          },
          {
            attackId: 2001,
            attackName: "Scratch",
            energyCost: 15,
            baseDamage: 30
          },
          {
            attackId: 2002,
            attackName: "Growl",
            energyCost: 10,
            baseDamage: 20
          }
        );
      }

      if (playerAttacks.length === 0 || enemyAttacks.length === 0) {
        throw new Error("No valid attacks found for one or both Pokemon");
      }

      // Zachováme zdraví a energii hráčova pokémona pokud jsme v bitvě se šampionem a pouze měníme pokémona
      let currentHealth = selectedPokemon.health;
      let currentEnergy = selectedPokemon.energy !== undefined ? selectedPokemon.energy : 100;
      
      // Pokud jsme v bitvě se šampionem a již máme nastavený stav bitvy (=přepínáme na dalšího pokémona)
      if (isChampionBattle && battleState.player.pokemon && championIndex !== undefined) {
        // Použijeme aktuální zdraví a energii pokémona z battleState, ne z localStorage
        if (battleState.player.pokemon.pokemonId === selectedPokemon.pokemonId) {
          currentHealth = battleState.player.health;
          currentEnergy = battleState.player.energy;
          console.log(`Zachovávám stav hráčova pokémona: zdraví=${currentHealth}, energie=${currentEnergy}`);
        }
      }

      // Pro nepřátelské pokémony šampiona vždy použijeme plné zdraví z dat pokémona,
      // protože pokaždé posílá nového pokémona se 100% zdravím
      const enemyHealth = enemyData.health;

      setBattleState({
        player: {
          pokemon: {
            ...playerData,
            imageId: playerData.imageId.toString(),
            type: playerType.name,
            typeImageId: playerType.imageId,
          },
          health: currentHealth,
          maxHealth: playerData.health,
          energy: currentEnergy,
          maxEnergy: 100,
          attacks: playerAttacks,
        },
        enemy: {
          pokemon: {
            ...enemyData,
            imageId: enemyData.imageId.toString(),
            type: enemyType.name,
            typeImageId: enemyType.imageId,
          },
          health: enemyHealth,
          maxHealth: enemyData.health,
          attacks: enemyAttacks,
        },
      });
    } catch (error) {
      console.error("Chyba při inicializaci bitvy:", error);
      throw error;
    }
  };

  const handleVictory = async () => {
    try {
      const newPlayerPokemons = [...playerPokemons];
      const selectedPokemonIndex = newPlayerPokemons.findIndex(
        (p) => p.pokemonId === battleState.player.pokemon?.pokemonId
      );

      if (selectedPokemonIndex !== -1) {
        newPlayerPokemons[selectedPokemonIndex].health =
          battleState.player.health;
        newPlayerPokemons[selectedPokemonIndex].energy =
          battleState.player.energy;
      }

      let caughtPokemon = null;
      if (battleState.enemy.pokemon && Math.random() < 1.0) { 
        if (newPlayerPokemons.length >= 6) {
          setCurrentMessage("Pokémon by chtěl jít s tebou, ale tvůj tým je plný!");
        } else {
          caughtPokemon = {
            ...battleState.enemy.pokemon,
            health: Math.floor(battleState.enemy.maxHealth * 0.3),
            maxHealth: battleState.enemy.maxHealth,
            energy: 100,
          };
          
          newPlayerPokemons.push(caughtPokemon);
          setCurrentMessage(`Chytil jsi ${battleState.enemy.pokemon.name}!`);

          try {
            // Získat současnou hodnotu počítadla chycených pokémonů
            const caughtPokemonCount = localStorage.getItem("stats_caughtPokemon") || "0";
            // Převedeme na číslo a přidáme 1
            const newCaughtPokemonCount = parseInt(caughtPokemonCount) + 1;
            // Uložíme aktualizovanou hodnotu
            localStorage.setItem("stats_caughtPokemon", newCaughtPokemonCount.toString());
            
            console.log("Přidán nový pokémon do statistik. Celkem chyceno:", newCaughtPokemonCount);
          } catch (error) {
            console.error("Chyba při aktualizaci statistik chycených pokémonů:", error);
          }
        }
      }

      localStorage.setItem("playerPokemons", JSON.stringify(newPlayerPokemons));
      setPlayerPokemons(newPlayerPokemons);
      
      setCapturedPokemon(caughtPokemon);

      console.log(
        "Předávám získané předměty do nadřazené komponenty:",
        earnedItems
      );

      setTimeout(() => {
        setShowVictoryScreen(true);
      }, 1000);
    } catch (err) {
      console.error("Chyba při zpracování vítězství:", err);
      onBattleComplete(true);
    }
  };

  const handlePlayerAttack = (attack: AttackType) => {
    if (
      !isPlayerTurn ||
      battleEnded ||
      !battleState.player.pokemon ||
      !battleState.enemy.pokemon
    ) {
      return;
    }

    if (attack.attackName === "Flee") {
      handleSwapPokemon();
      return;
    }

    if (battleState.player.energy >= attack.energyCost) {
      const newEnemyHealth = Math.max(
        battleState.enemy.health - attack.baseDamage,
        0
      );
      const newPlayerEnergy = battleState.player.energy - attack.energyCost;

      setBattleState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          energy: newPlayerEnergy,
        },
        enemy: {
          ...prev.enemy,
          health: newEnemyHealth,
        },
      }));

      setCurrentMessage(
        `${battleState.player.pokemon.name} used ${attack.attackName}!`
      );

      if (!checkBattleEnd(battleState.player.health, newEnemyHealth)) {
        setIsPlayerTurn(false);
        setTimeout(() => {
          handleEnemyAttack();
        }, 1000);
      }
    } else {
      setCurrentMessage("Not enough energy to use this attack!");
    }

    const updatedItems = [...playerItems];
    setPlayerItems(updatedItems);
  };

  const handleEnemyAttack = () => {
    if (
      !battleState.enemy.pokemon ||
      battleEnded ||
      !battleState.enemy.attacks.length
    ) {
      return;
    }

    const randomAttack =
      battleState.enemy.attacks[
        Math.floor(Math.random() * battleState.enemy.attacks.length)
      ];

    const newPlayerHealth = Math.max(
      battleState.player.health - randomAttack.baseDamage,
      0
    );

    setBattleState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        health: newPlayerHealth,
      },
    }));

    setCurrentMessage(
      `${battleState.enemy.pokemon.name} used ${randomAttack.attackName}!`
    );

    if (newPlayerHealth === 0 && battleState.player.pokemon) {
      const newPlayerPokemons = [...playerPokemons];
      const selectedPokemonIndex = newPlayerPokemons.findIndex(
        (p) => battleState.player.pokemon?.instanceId 
               ? p.instanceId === battleState.player.pokemon.instanceId
               : (p.pokemonId === battleState.player.pokemon?.pokemonId && 
                 (!p.instanceId || !battleState.player.pokemon?.instanceId))
      );

      if (selectedPokemonIndex !== -1) {
        // Nastavíme pokémona jednoznačně na mrtvého
        newPlayerPokemons[selectedPokemonIndex] = {
          ...newPlayerPokemons[selectedPokemonIndex],
          health: 0
        };
        localStorage.setItem(
          "playerPokemons",
          JSON.stringify(newPlayerPokemons)
        );
        setPlayerPokemons(newPlayerPokemons);
        console.log(`Pokémon ${newPlayerPokemons[selectedPokemonIndex].name} byl označen jako vyčerpaný po útoku nepřítele`);
      } else {
        console.warn(`Nepodařilo se najít aktuálního pokémona ${battleState.player.pokemon?.name} v seznamu po útoku nepřítele`);
      }
    }

    if (!checkBattleEnd(newPlayerHealth, battleState.enemy.health)) {
      setIsPlayerTurn(true);
    }
  };

  const handleSwapPokemon = () => {
    if (!isPlayerTurn || battleEnded) {
      return;
    }

    const newPlayerPokemons = [...playerPokemons];
    // Použijeme instanceId pro přesné nalezení aktuálního pokémona
    const selectedPokemonIndex = newPlayerPokemons.findIndex(
      (p) => (battleState.player.pokemon?.instanceId 
             ? p.instanceId === battleState.player.pokemon.instanceId 
             : p.pokemonId === battleState.player.pokemon?.pokemonId && p.health === battleState.player.health)
    );

    if (selectedPokemonIndex !== -1) {
      newPlayerPokemons[selectedPokemonIndex].health = battleState.player.health;
      newPlayerPokemons[selectedPokemonIndex].energy = battleState.player.energy;
      
      localStorage.setItem("playerPokemons", JSON.stringify(newPlayerPokemons));
      setPlayerPokemons(newPlayerPokemons);
    }

    setShowPokemonSelection(true);
    setCurrentMessage("Vyber jiného pokémona!");
  };

  const handleRestartGame = () => {
    // Zálohujeme statistiky před resetováním localStorage
    const stats = {
      completedGames: localStorage.getItem("stats_completedGames"),
      caughtPokemon: localStorage.getItem("stats_caughtPokemon")
    };
    
    // Resetujeme localStorage
    localStorage.clear();
    
    // Obnovíme statistiky ze zálohy
    if (stats.completedGames) {
      localStorage.setItem("stats_completedGames", stats.completedGames);
    }
    if (stats.caughtPokemon) {
      localStorage.setItem("stats_caughtPokemon", stats.caughtPokemon);
    }
    
    window.location.href = "/nickname";
  };

  const handleContinue = () => {
    onBattleComplete(true, earnedItems);
  };

  if (gameOver) {
    return <GameOverScreen onRestart={handleRestartGame} />;
  }

  if (showVictoryScreen) {
    return (
      <VictoryScreen 
        earnedItems={earnedItems} 
        capturedPokemon={capturedPokemon}
        onContinue={handleContinue} 
      />
    );
  }

  if (showPokemonSelection) {
    return (
      <div className={BattleCSS.battle}>
        <div className={BattleCSS.pokemonSelection}>
          <h2>Vyber si pokémona</h2>
          <PokemonSelectionGrid
            playerPokemons={playerPokemons}
            loading={loading}
            onSelect={handlePokemonSelection}
          />
        </div>
      </div>
    );
  }

  if (!battleState.player.pokemon || !battleState.enemy.pokemon) {
    return <div className={BattleCSS.loading}>Načítání souboje...</div>;
  }

  return (
    <div className={BattleCSS.battle}>
      <div className={BattleCSS.battle__inventories}>
        <div className={BattleCSS.battle__inventory}>
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
        </div>
        <div className={BattleCSS.battle__pokemons}>
          <PokemonContainer
            pokemon={battleState.player.pokemon}
            health={battleState.player.health}
            maxHealth={battleState.player.maxHealth}
            energy={battleState.player.energy}
            maxEnergy={battleState.player.maxEnergy}
            type={battleState.player.pokemon?.type}
            typeImageId={battleState.player.pokemon?.typeImageId}
            isPlayer={true}
          />
          <PokemonContainer
            pokemon={battleState.enemy.pokemon}
            health={battleState.enemy.health}
            maxHealth={battleState.enemy.maxHealth}
            type={battleState.enemy.pokemon?.type}
            typeImageId={battleState.enemy.pokemon?.typeImageId}
            isPlayer={false}
          />
        </div>
        <div className={BattleCSS.battle__inventory}>
          <ItemInventory>
            {playerItems.slice(0, 6).map((item) => (
              <ItemInventoryCell key={item.id} item={item} />
            ))}
            {Array(Math.max(0, 6 - playerItems.length))
              .fill(null)
              .map((_, index) => (
                <ItemInventoryCell key={`empty-${index}`} />
              ))}
          </ItemInventory>
        </div>
      </div>
      <StoryBox showContinueText={false}>
        <p>{currentMessage}</p>
        {!battleEnded && isPlayerTurn && battleState.player.attacks && (
          <>
            <AttacksContainer
              attacks={battleState.player.attacks}
              onAttack={handlePlayerAttack}
            />
          </>
        )}
      </StoryBox>
    </div>
  );
};

export default Battle;
