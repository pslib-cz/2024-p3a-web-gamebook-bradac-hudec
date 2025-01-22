import React from 'react';
import PokemonContainerCSS from './PokemonContainer.module.css';
import HealthBar from './HealthBar';
import EnergyBar from './EnergyBar';
import PokemonType from '../types/PokemonType';

type PokemonContainerProps = {
    pokemon: PokemonType | null;
    health: number;
    isPlayer: boolean;
};

const PokemonContainer: React.FC<PokemonContainerProps> = ({ pokemon, health, isPlayer }) => {
    if (!pokemon) return null;

    return (
        <div className={PokemonContainerCSS.pokemon__container}>
            <img
                src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                className={PokemonContainerCSS.pokemon__image}
                alt={pokemon.name}
            />
            <p className={PokemonContainerCSS.pokemon__name}>{pokemon.name}</p>
            <HealthBar health={health} maxHealth={pokemon.health} />

            {isPlayer && (
                <EnergyBar energy={pokemon.energy} maxEnergy={pokemon.energy} />
            )}
        </div>
    );
};

export default PokemonContainer;
