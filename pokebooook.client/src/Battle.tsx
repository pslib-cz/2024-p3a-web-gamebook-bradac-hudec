import React, { useState, useEffect } from 'react';
import PokemonContainer from './components/PokemonContainer';
import StoryBox from './components/StoryBox';
import AttacksContainer from './components/AttacksContainer';
import PokemonType from './types/PokemonType';
import AttackType from './types/AttackType';
import BattleCSS from './Battle.module.css';
import ItemInventory from './Menus/ItemInventory';
import PokemonInventory from './Menus/PokemonInventory';
import ItemInventoryCell from './components/ItemInventoryCell';
import PokemonCell from './components/PokemonCell';

const Battle: React.FC = () => {
    const [pokemon1, setPokemon1] = useState<PokemonType | null>(null);
    const [pokemon2, setPokemon2] = useState<PokemonType | null>(null);
    const [attacks1, setAttacks1] = useState<AttackType[]>([]);
    const [attacks2, setAttacks2] = useState<AttackType[]>([]);
    const [pokemon1Health, setPokemon1Health] = useState<number>(100);
    const [pokemon2Health, setPokemon2Health] = useState<number>(100);
    const [currentMessage, setCurrentMessage] = useState<string>('Choose an attack!');
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

    const fetchRandomPokemon = async () => {
        try {
            const randomId1 = Math.floor(Math.random() * 9) + 1;
            const randomId2 = Math.floor(Math.random() * 9) + 1;

            const response1 = await fetch(`http://localhost:5212/api/Pokemons/${randomId1}`);
            const response2 = await fetch(`http://localhost:5212/api/Pokemons/${randomId2}`);

            if (!response1.ok || !response2.ok) throw new Error('Failed to fetch Pokémon data');

            const data1 = await response1.json();
            const data2 = await response2.json();

            setPokemon1(data1);
            setPokemon2(data2);

            if (data1.pokemonId && data2.pokemonId) {
                setAttacks1(data1.pokemonAttacks);
                setAttacks2(data2.pokemonAttacks);
            } else {
                console.error("Pokemon ID is undefined", data1.pokemonId, data2.pokemonId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRandomPokemon();
    }, []);
    const handlePlayerAttack = (attack: AttackType) => {
        if (pokemon1 && attack.energyCost <= pokemon1.energy) {
            const newPlayerEnergy = pokemon1.energy - attack.energyCost;
            setPokemon1({ ...pokemon1, energy: newPlayerEnergy }); 
            setPokemon2Health(prevHealth => Math.max(prevHealth - attack.baseDamage, 0));
    
            setCurrentMessage(`You used ${attack.attackName}!`);
            setIsPlayerTurn(false);
        } else {
            setCurrentMessage("Not enough energy to use this attack.");
        }
    };
    

    const handleEnemyAttack = () => {
        if (pokemon2) {
            const randomAttack = attacks2[Math.floor(Math.random() * attacks2.length)];

            setPokemon1Health(prevHealth => Math.max(prevHealth - randomAttack.baseDamage, 0));

            setCurrentMessage(`Enemy used ${randomAttack.attackName}!`);
            setIsPlayerTurn(true);
        }
    };

    useEffect(() => {
        if (!isPlayerTurn) {
            setTimeout(() => {
                handleEnemyAttack();
            }, 1000);
        }
    }, [isPlayerTurn]);

    if (!pokemon1 || !pokemon2 || attacks1.length === 0 || attacks2.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className={BattleCSS.battle}>
            <div className={BattleCSS.battle__inventories}>
                <div className={BattleCSS.battle__inventory}>
                    <ItemInventory>
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                        <ItemInventoryCell />
                    </ItemInventory>
                </div>
                <div className={BattleCSS.battle__pokemons}>

                    <PokemonContainer pokemon={pokemon1} health={pokemon1Health} isPlayer={true} />
                    <PokemonContainer pokemon={pokemon2} health={pokemon2Health} isPlayer={false} />
                </div>
                <div className={BattleCSS.battle__inventory}>
                    <PokemonInventory>
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                        <PokemonCell />
                    </PokemonInventory>
                </div>
            </div>
            <StoryBox showContinueText={false}>
                <p>{currentMessage}</p>
                <AttacksContainer attacks={attacks1} onAttack={handlePlayerAttack} />
            </StoryBox>
        </div>
    );
};

export default Battle;
