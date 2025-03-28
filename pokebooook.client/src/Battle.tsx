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
import PokemonSelectionGrid from "./components/PokemonSelectionGrid";
import VictoryScreen from "./components/VictoryScreen";
import GameOverScreen from "./components/GameOverScreen";

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
  onBattleComplete: (wasVictorious: boolean, earnedItems?: GameItem[]) => void;
}

const Battle: React.FC<BattleProps> = ({
  locationPokemonId,
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

  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  const checkBattleEnd = (playerHealth: number, enemyHealth: number) => {
    if (enemyHealth <= 0) {
      setCurrentMessage("Vítězství! Porazil jsi protivníka!");
      setIsPlayerTurn(false);
      setBattleEnded(true);

      (async () => {
        await generateRewards();

        setShowVictoryScreen(true);
      })();

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

        const newPlayerPokemons = [...playerPokemons];
        const selectedPokemonIndex = newPlayerPokemons.findIndex(
          (p) => p.pokemonId === battleState.player.pokemon?.pokemonId
        );

        if (selectedPokemonIndex !== -1) {
          newPlayerPokemons[selectedPokemonIndex].health = 0;
          localStorage.setItem(
            "playerPokemons",
            JSON.stringify(newPlayerPokemons)
          );
          setPlayerPokemons(newPlayerPokemons);
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

      const response = await fetch(`/api/Items`);

      if (response.ok) {
        const items = await response.json();

        if (!Array.isArray(items)) {
          console.error("Vrácená data nejsou pole:", items);
          setEarnedItems([]);
          return;
        }

        if (items.length === 0) {
          console.warn("Žádné předměty nejsou k dispozici");
          setEarnedItems([]);
          return;
        }

        const randomCount = Math.min(
          3,
          Math.max(1, Math.floor(Math.random() * 3) + 1)
        );

        const shuffledItems = [...items].sort(() => Math.random() - 0.5);

        const uniqueItemIds = new Set();
        const selectedItems = [];

        for (const item of shuffledItems) {
          if (!uniqueItemIds.has(item.id)) {
            uniqueItemIds.add(item.id);
            selectedItems.push(item);

            if (selectedItems.length >= randomCount) {
              break;
            }
          }
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
      const response = await fetch("/api/PokemonTypes");
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

  const initializeBattle = async (selectedPokemon: PokemonType) => {
    try {
      if (!selectedPokemon.pokemonId) {
        throw new Error("Selected pokemon has no valid ID");
      }

      if (!locationPokemonId) {
        throw new Error("Location pokemon ID is missing");
      }

      const playerResponse = await fetch(
        `/api/Pokemons/${selectedPokemon.pokemonId}`
      );

      const enemyResponse = await fetch(`/api/Pokemons/${locationPokemonId}`);

      if (!playerResponse.ok || !enemyResponse.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      const playerData = await playerResponse.json();
      const enemyData = await enemyResponse.json();

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

      if (playerAttacks.length === 0 || enemyAttacks.length === 0) {
        throw new Error("No valid attacks found for one or both Pokemon");
      }

      const currentHealth = selectedPokemon.health;

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
        localStorage.setItem(
          "playerPokemons",
          JSON.stringify(newPlayerPokemons)
        );
        setPlayerPokemons(newPlayerPokemons);
      }

      console.log(
        "Předávám získané předměty do nadřazené komponenty:",
        earnedItems
      );

      onBattleComplete(true, earnedItems);
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
        (p) => p.pokemonId === battleState.player.pokemon?.pokemonId
      );

      if (selectedPokemonIndex !== -1) {
        newPlayerPokemons[selectedPokemonIndex].health = 0;
        localStorage.setItem(
          "playerPokemons",
          JSON.stringify(newPlayerPokemons)
        );
        setPlayerPokemons(newPlayerPokemons);
      }
    }

    if (!checkBattleEnd(newPlayerHealth, battleState.enemy.health)) {
      setIsPlayerTurn(true);
    }
  };

  const handleRestartGame = () => {
    localStorage.clear();
    window.location.href = "/nickname";
  };

  const handleContinue = () => {
    handleVictory();

    window.location.reload();
  };

  if (gameOver) {
    return <GameOverScreen onRestart={handleRestartGame} />;
  }

  if (showVictoryScreen) {
    return (
      <VictoryScreen earnedItems={earnedItems} onContinue={handleContinue} />
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
