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

const ENEMY_ATTACK_DELAY = 1000;

const Battle: React.FC = () => {
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
    const [currentMessage, setCurrentMessage] =
        useState<string>("Choose an attack!");
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
    const [battleEnded, setBattleEnded] = useState<boolean>(false);

    const fetchRandomPokemon = async () => {
        try {
            const randomId1 = Math.floor(Math.random() * 9) + 1;
            const randomId2 = Math.floor(Math.random() * 9) + 1;

            const [playerResponse, enemyResponse] = await Promise.all([
                fetch(`http://localhost:5212/api/Pokemons/${randomId1}`),
                fetch(`http://localhost:5212/api/Pokemons/${randomId2}`),
            ]);

            if (!playerResponse.ok || !enemyResponse.ok) {
                throw new Error("Failed to fetch Pokémon data");
            }

            const playerData = await playerResponse.json();
            const enemyData = await enemyResponse.json();

            setBattleState({
                player: {
                    pokemon: playerData,
                    health: playerData.health,
                    maxHealth: playerData.health,
                    energy: playerData.energy,
                    maxEnergy: playerData.energy,
                    attacks: playerData.pokemonAttacks || [],
                },
                enemy: {
                    pokemon: enemyData,
                    health: enemyData.health,
                    maxHealth: enemyData.health,
                    attacks: enemyData.pokemonAttacks || [],
                },
            });
        } catch (error) {
            console.error("Error fetching Pokemon:", error);
            setCurrentMessage("Failed to load Pokémon. Please try again.");
        }
    };

    useEffect(() => {
        fetchRandomPokemon();
    }, []);

    const checkBattleEnd = (playerHealth: number, enemyHealth: number) => {
        if (enemyHealth <= 0) {
            setCurrentMessage(
                `${battleState.enemy.pokemon?.name} fainted! You won!`
            );
            setBattleEnded(true);
            return true;
        }
        if (playerHealth <= 0) {
            setCurrentMessage(
                `${battleState.player.pokemon?.name} fainted! You lost!`
            );
            setBattleEnded(true);
            return true;
        }
        return false;
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
            const newPlayerEnergy =
                battleState.player.energy - attack.energyCost;

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
            }
        } else {
            setCurrentMessage("Not enough energy to use this attack!");
        }
    };

    const handleEnemyAttack = () => {
        if (
            !battleState.enemy.pokemon ||
            battleEnded ||
            battleState.enemy.attacks.length === 0 ||
            battleState.enemy.health <= 0
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

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (!isPlayerTurn && !battleEnded) {
            timeoutId = setTimeout(handleEnemyAttack, ENEMY_ATTACK_DELAY);
        }
        return () => clearTimeout(timeoutId);
    }, [isPlayerTurn, battleEnded]);

    if (!battleState.player.pokemon || !battleState.enemy.pokemon) {
        return <div className={BattleCSS.loading}>Loading battle...</div>;
    }

    return (
        <div className={BattleCSS.battle}>
            <div className={BattleCSS.battle__inventories}>
                <div className={BattleCSS.battle__inventory}>
                    <ItemInventory>
                        {Array(6)
                            .fill(null)
                            .map((_, index) => (
                                <ItemInventoryCell key={index} />
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
                        isPlayer={true}
                    />
                    <PokemonContainer
                        pokemon={battleState.enemy.pokemon}
                        health={battleState.enemy.health}
                        maxHealth={battleState.enemy.maxHealth}
                        isPlayer={false}
                    />
                </div>
                <div className={BattleCSS.battle__inventory}>
                    <PokemonInventory>
                        {Array(6)
                            .fill(null)
                            .map((_, index) => (
                                <PokemonCell key={index} />
                            ))}
                    </PokemonInventory>
                </div>
            </div>
            <StoryBox showContinueText={false}>
                <p>{currentMessage}</p>
                {!battleEnded && isPlayerTurn && (
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
