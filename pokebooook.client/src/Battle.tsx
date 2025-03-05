import React, { useState, useEffect } from "react";
import PokemonContainer from "./components/PokemonContainer";
import StoryBox from "./components/StoryBox";
import AttacksContainer from "./components/AttacksContainer";
import PokemonType from "./types/PokemonType";
import AttackType from "./types/AttackType";
import BattleCSS from "./Battle.module.css";
import ItemInventory from "./Menus/ItemInventory";
import PokemonInventory from "./Menus/PokemonInventory";
import ItemInventoryCell from "./components/ItemInventoryCell";
import PokemonCell from "./components/PokemonCell";
import PokemonTypeEnum from "./types/PokemonTypeEnum";
import PokemonAttack from "./types/pokemonAttacks";
import GameItem from "./types/GameItem";

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

interface BattleProps {
  locationPokemonId: number;
}

const Battle: React.FC<BattleProps> = ({ locationPokemonId }) => {
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

  useEffect(() => {
    console.log("Component mounted, available pokemons:", playerPokemons);
    fetchPokemonTypes();
  }, []);

  const handlePokemonSelection = async (selectedPokemon: PokemonType) => {
    console.log("Pokemon selection started with:", selectedPokemon);

    if (!selectedPokemon || !selectedPokemon.pokemonId) {
      console.error("Invalid pokemon selected:", selectedPokemon);
      setCurrentMessage("Neplatný pokémon!");
      return;
    }

    if (selectedPokemon.health <= 0) {
      console.log("Attempted to select fainted pokemon:", selectedPokemon);
      setCurrentMessage("Tento pokémon je vyčerpaný! Vyber jiného.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "Initializing battle with pokemon:",
        selectedPokemon.name,
        "ID:",
        selectedPokemon.pokemonId
      );
      await initializeBattle(selectedPokemon);
      setShowPokemonSelection(false);
      setCurrentMessage(`Jdi do toho, ${selectedPokemon.name}!`);
      setBattleEnded(false);
      setIsPlayerTurn(true);
    } catch (error) {
      console.error("Error in handlePokemonSelection:", error);
      setCurrentMessage("Něco se pokazilo při výběru pokémona. Zkus to znovu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonTypes = async () => {
    try {
      const response = await fetch("http://localhost:5212/api/PokemonTypes");
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon types");
      }
      const data = await response.json();
      setPokemonTypes(data);
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
    }
  };

  const initializeBattle = async (selectedPokemon: PokemonType) => {
    try {
      console.log(
        "Initializing battle with selected pokemon:",
        selectedPokemon
      );

      if (!selectedPokemon.pokemonId) {
        throw new Error("Selected pokemon has no valid ID");
      }

      if (!locationPokemonId) {
        throw new Error("Location pokemon ID is missing");
      }

      const playerResponse = await fetch(
        `http://localhost:5212/api/Pokemons/${selectedPokemon.pokemonId}`
      );

      const enemyResponse = await fetch(
        `http://localhost:5212/api/Pokemons/${locationPokemonId}`
      );

      if (!playerResponse.ok || !enemyResponse.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      const playerData = await playerResponse.json();
      const enemyData = await enemyResponse.json();

      console.log("Player data:", playerData);
      console.log("Enemy data:", enemyData);
      console.log("Player attacks:", playerData.pokemonAttacks);
      console.log("Enemy attacks:", enemyData.pokemonAttacks);

      // Get the type data for both Pokemon
      const playerType = pokemonTypes.find(
        (t) => t.typeId === playerData.typeId
      );
      const enemyType = pokemonTypes.find((t) => t.typeId === enemyData.typeId);

      if (!playerType || !enemyType) {
        throw new Error("Failed to find Pokemon types");
      }

      // Kontrola, zda pokémoni mají útoky
      if (
        !playerData.pokemonAttacks ||
        !Array.isArray(playerData.pokemonAttacks)
      ) {
        console.error(
          "Player pokemon attacks is not valid:",
          playerData.pokemonAttacks
        );
        throw new Error("Player pokemon has no attacks");
      }

      if (
        !enemyData.pokemonAttacks ||
        !Array.isArray(enemyData.pokemonAttacks)
      ) {
        console.error(
          "Enemy pokemon attacks is not valid:",
          enemyData.pokemonAttacks
        );
        throw new Error("Enemy pokemon has no attacks");
      }

      console.log("Starting to fetch player attacks...");
      // Fetch attacks for both Pokemon
      const playerAttacks = playerData.pokemonAttacks.map(
        (attack: PokemonAttack) => ({
          attackId: attack.pokemonAttackId,
          attackName: attack.attackName,
          energyCost: attack.energyCost,
          baseDamage: attack.baseDamage,
        })
      );
      console.log("Player attacks processed:", playerAttacks);

      console.log("Starting to fetch enemy attacks...");
      const enemyAttacks = enemyData.pokemonAttacks.map(
        (attack: PokemonAttack) => ({
          attackId: attack.pokemonAttackId,
          attackName: attack.attackName,
          energyCost: attack.energyCost,
          baseDamage: attack.baseDamage,
        })
      );
      console.log("Enemy attacks processed:", enemyAttacks);

      if (playerAttacks.length === 0 || enemyAttacks.length === 0) {
        console.error(
          "No valid attacks found. Player attacks:",
          playerAttacks,
          "Enemy attacks:",
          enemyAttacks
        );
        throw new Error("No valid attacks found for one or both Pokemon");
      }

      // Update player pokemon health in localStorage
      const updatedPokemons = playerPokemons.map((pokemon) =>
        pokemon.pokemonId === selectedPokemon.pokemonId
          ? { ...pokemon, health: playerData.health }
          : pokemon
      );
      localStorage.setItem("playerPokemons", JSON.stringify(updatedPokemons));
      setPlayerPokemons(updatedPokemons);

      setBattleState({
        player: {
          pokemon: {
            ...playerData,
            imageId: playerData.imageId.toString(),
            type: playerType.name,
            typeImageId: playerType.imageId,
          },
          health: playerData.health,
          maxHealth: playerData.health,
          energy: 100,
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
          health: enemyData.health,
          maxHealth: enemyData.health,
          attacks: enemyAttacks,
        },
      });
    } catch (error) {
      console.error("Error in initializeBattle:", error);
      throw error;
    }
  };

  const checkBattleEnd = (playerHealth: number, enemyHealth: number) => {
    if (enemyHealth <= 0) {
      handleVictory();
      return true;
    }
    if (playerHealth <= 0) {
      const hasLivePokemon = playerPokemons.some(
        (pokemon) =>
          pokemon.health > 0 &&
          pokemon.pokemonId !== battleState.player.pokemon?.pokemonId
      );
      if (hasLivePokemon) {
        setCurrentMessage(
          `${battleState.player.pokemon?.name} omdlel! Vyber dalšího pokémona!`
        );
        setShowPokemonSelection(true);
      } else {
        setCurrentMessage("Všichni tví pokémoni omdleli! Hra končí!");
        setGameOver(true);
      }
      setBattleEnded(true);
      return true;
    }
    return false;
  };

  const handleVictory = async () => {
    setCurrentMessage(`${battleState.enemy.pokemon?.name} omdlel! Vyhrál jsi!`);
    setBattleEnded(true);
    setShowVictoryScreen(true);

    try {
      // Získání všech itemů z API
      const response = await fetch(`http://localhost:5212/api/Items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const items = await response.json();
        // Náhodně vybereme 1-3 itemy z dostupných
        const randomCount = Math.floor(Math.random() * 3) + 1;
        const selectedItems = items
          .sort(() => Math.random() - 0.5)
          .slice(0, randomCount);

        setEarnedItems(selectedItems);
        // Uložení itemů do localStorage a state
        const updatedItems = [...playerItems, ...selectedItems];
        localStorage.setItem("playerItems", JSON.stringify(updatedItems));
        setPlayerItems(updatedItems);
      }
    } catch (error) {
      console.error("Chyba při získávání itemů:", error);
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

    if (!checkBattleEnd(newPlayerHealth, battleState.enemy.health)) {
      setIsPlayerTurn(true);
    }
  };

  if (gameOver) {
    return (
      <div className={BattleCSS.gameOver}>
        <h2>Game Over</h2>
        <p>Všichni tví pokémoni jsou vyčerpaní!</p>
        <button
          className={BattleCSS.restartButton}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/nickname";
          }}
        >
          Začít znovu
        </button>
      </div>
    );
  }

  if (showVictoryScreen) {
    return (
      <div className={BattleCSS.victoryScreen}>
        <h2>Vítězství!</h2>
        {earnedItems.length > 0 && (
          <div className={BattleCSS.earnedItems}>
            <h3>Získal jsi tyto předměty:</h3>
            <div className={BattleCSS.itemsGrid}>
              {earnedItems.map((item, index) => (
                <div key={index} className={BattleCSS.itemCard}>
                  <img
                    src={`http://localhost:5212/api/Images/${item.imageId}`}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          className={BattleCSS.continueButton}
          onClick={() => window.location.reload()}
        >
          Pokračovat
        </button>
      </div>
    );
  }

  if (showPokemonSelection) {
    console.log("Available pokemons:", playerPokemons);
    return (
      <div className={BattleCSS.battle}>
        <div className={BattleCSS.pokemonSelection}>
          <h2>Vyber si pokémona</h2>
          {loading ? (
            <div className={BattleCSS.loading}>Načítání...</div>
          ) : (
            <div className={BattleCSS.pokemonGrid}>
              {playerPokemons.map((pokemon, index) => {
                console.log(`Pokemon ${index}:`, pokemon);
                return (
                  <div
                    key={index}
                    className={`${BattleCSS.pokemonOption} ${
                      pokemon.health <= 0 ? BattleCSS.disabled : ""
                    }`}
                    onClick={() => {
                      console.log("Clicked pokemon:", pokemon);
                      console.log("Pokemon ID:", pokemon.pokemonId);
                      console.log("Location Pokemon ID:", locationPokemonId);
                      if (pokemon.health > 0) {
                        handlePokemonSelection(pokemon);
                      }
                    }}
                    style={{
                      cursor: pokemon.health > 0 ? "pointer" : "not-allowed",
                    }}
                  >
                    <img
                      src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                      alt={pokemon.name}
                    />
                    <div className={BattleCSS.pokemonInfo}>
                      <span>{pokemon.name}</span>
                      <span>
                        HP: {pokemon.health}/{pokemon.maxHealth}
                      </span>
                    </div>
                    {pokemon.health <= 0 && (
                      <div className={BattleCSS.faintedOverlay}>Vyčerpaný</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
          <ItemInventory>
            {playerItems.slice(0, 6).map((item, index) => (
              <ItemInventoryCell key={index} item={item} />
            ))}
            {Array(Math.max(0, 6 - playerItems.length))
              .fill(null)
              .map((_, index) => (
                <ItemInventoryCell key={`empty-${index}`} />
              ))}
          </ItemInventory>
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
        </div>
      </div>
      <StoryBox showContinueText={false}>
        <p>{currentMessage}</p>
        {!battleEnded && isPlayerTurn && battleState.player.attacks && (
          <AttacksContainer
            attacks={battleState.player.attacks}
            onAttack={handlePlayerAttack}
          />
        )}
      </StoryBox>
    </div>
  );
};

export default Battle;
