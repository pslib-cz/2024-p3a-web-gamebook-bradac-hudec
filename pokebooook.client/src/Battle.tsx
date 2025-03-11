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
    const [showPokemonSelection, setShowPokemonSelection] =
        useState<boolean>(true);
    const [currentMessage, setCurrentMessage] = useState<string>(
        "Choose your Pokémon!"
    );
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
    const [battleEnded, setBattleEnded] = useState<boolean>(false);
    const [pokemonTypes, setPokemonTypes] = useState<PokemonTypeEnum[]>([]);

    const handlePokemonSelection = async (selectedPokemon: PokemonType) => {
        console.log("Selected Pokemon:", selectedPokemon);
        const pokemonId = selectedPokemon.imageId;
        if (!pokemonId) {
            console.error("Invalid Pokemon selected:", selectedPokemon);
            return;
        }
        try {
            await initializeBattle({
                ...selectedPokemon,
                pokemonId: parseInt(pokemonId),
            });
        } catch (error) {
            console.error("Error in handlePokemonSelection:", error);
        }
    };

    const fetchAttackDetails = async (
        attackId: number
    ): Promise<AttackType> => {
        const response = await fetch(
            `http://localhost:5212/api/Attacks/${attackId}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch attack ${attackId}`);
        }
        const attackData = await response.json();
        return {
            attackId: attackData.attackId,
            attackName: attackData.name, // Note: API returns 'name', we map to 'attackName'
            energyCost: attackData.energyCost,
            baseDamage: attackData.baseDamage,
        };
    };

    const fetchPokemonTypes = async () => {
        try {
            const response = await fetch(
                "http://localhost:5212/api/PokemonTypes"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch Pokemon types");
            }
            const data = await response.json();
            setPokemonTypes(data);
        } catch (error) {
            console.error("Error fetching Pokemon types:", error);
        }
    };

    useEffect(() => {
        fetchPokemonTypes();
    }, []);

    const initializeBattle = async (selectedPokemon: PokemonType) => {
        try {
            const playerResponse = await fetch(
                `http://localhost:5212/api/Pokemons/${selectedPokemon.imageId}`
            );

            const enemyResponse = await fetch(
                `http://localhost:5212/api/Pokemons/${locationPokemonId}`
            );

            if (!playerResponse.ok || !enemyResponse.ok) {
                throw new Error("Failed to fetch Pokémon data");
            }

            const playerData = await playerResponse.json();
            const enemyData = await enemyResponse.json();

            console.log("Player Pokemon typeId:", playerData.typeId);
            console.log("Enemy Pokemon typeId:", enemyData.typeId);
            console.log("Available Pokemon Types:", pokemonTypes);

            // Get the type data for both Pokemon
            const playerType = pokemonTypes.find(
                (t) => t.typeId === playerData.typeId
            );
            const enemyType = pokemonTypes.find(
                (t) => t.typeId === enemyData.typeId
            );

            console.log("Found player type:", playerType);
            console.log("Found enemy type:", enemyType);

            const playerAttacks = playerData.pokemonAttacks.map((pa: any) => ({
                attackId: pa.pokemonAttackId,
                attackName: pa.attackName,
                energyCost: pa.energyCost,
                baseDamage: pa.baseDamage,
            }));

            const enemyAttacks = enemyData.pokemonAttacks.map((pa: any) => ({
                attackId: pa.pokemonAttackId,
                attackName: pa.attackName,
                energyCost: pa.energyCost,
                baseDamage: pa.baseDamage,
            }));

            setBattleState({
                player: {
                    pokemon: {
                        ...playerData,
                        imageId: selectedPokemon.imageId,
                        maxHealth: playerData.health,
                        type: playerType?.name || "Unknown",
                        typeImageId: playerType?.imageId, // This should be 251 for Charmander
                    },
                    health: playerData.health,
                    maxHealth: playerData.health,
                    energy: playerData.energy,
                    maxEnergy: playerData.energy,
                    attacks: playerAttacks,
                },
                enemy: {
                    pokemon: {
                        ...enemyData,
                        maxHealth: enemyData.health,
                        type: enemyType?.name || "Unknown",
                        typeImageId: enemyType?.imageId,
                    },
                    health: enemyData.health,
                    maxHealth: enemyData.health,
                    attacks: enemyAttacks,
                },
            });
            setShowPokemonSelection(false);
            setCurrentMessage("Choose an attack!");
        } catch (error) {
            console.error("Error initializing battle:", error);
            setCurrentMessage("Failed to load battle data. Please try again.");
        }
    };

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

    if (showPokemonSelection) {
        return (
            <div className={BattleCSS.battle}>
                <div className={BattleCSS.pokemonSelection}>
                    <h2>Choose your Pokémon</h2>
                    <div className={BattleCSS.pokemonGrid}>
                        {playerPokemons.map((pokemon, index) => (
                            <div
                                key={index}
                                className={BattleCSS.pokemonOption}
                                onClick={() => {
                                    console.log("Clicked Pokemon:", pokemon);
                                    if (pokemon && pokemon.imageId) {
                                        handlePokemonSelection(pokemon);
                                    } else {
                                        console.error(
                                            "Invalid Pokemon data:",
                                            pokemon
                                        );
                                    }
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <PokemonCell pokemon={pokemon} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

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
