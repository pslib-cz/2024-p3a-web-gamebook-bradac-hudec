import React from 'react';
import PokemonContainerCSS from './PokemonContainer.module.css';
import HealthBar from './HealthBar';
import EnergyBar from './EnergyBar';

type PokemonType = {
    id: number;
    name: string;
    imageId: number;
    health: number;
    energy: number;
};

type PokemonContainerProps = {
    pokemon: PokemonType | null;
};

const PokemonContainer: React.FC<PokemonContainerProps> = ({ pokemon }) => {
    if (!pokemon) return null;

    return (
        <div className={PokemonContainerCSS.pokemon__container}>
            <img
                src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                className={PokemonContainerCSS.pokemon__image}
                alt={pokemon.name}
            />
            <p className={PokemonContainerCSS.pokemon__name}>{pokemon.name}</p>
            <HealthBar health={pokemon.health} maxHealth={pokemon.health} />
            <EnergyBar energy={pokemon.energy} maxEnergy={pokemon.energy} />
        </div>
    );
};

export default PokemonContainer;