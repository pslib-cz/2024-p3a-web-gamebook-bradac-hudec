import React from "react";
import PokemonContainerCSS from "../styles/components/PokemonContainer.module.css";
import HealthBar from "./HealthBar";
import EnergyBar from "./EnergyBar";
import PokemonType from "../types/PokemonType";

interface PokemonContainerProps {
    pokemon: PokemonType | null;
    health: number;
    maxHealth: number;
    energy?: number;
    maxEnergy?: number;
    type?: string;
    typeImageId?: number;
    isPlayer: boolean;
}

const PokemonContainer: React.FC<PokemonContainerProps> = ({
    pokemon,
    health,
    maxHealth,
    energy,
    maxEnergy,
    type,
    typeImageId,
    isPlayer,
}) => {
    if (!pokemon) return null;

    console.log("Pokemon type image ID:", typeImageId); 

    return (
        <div className={PokemonContainerCSS.pokemon__container}>
            <img
                src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                className={PokemonContainerCSS.pokemon__image}
                alt={pokemon.name}
            />
            <div className={PokemonContainerCSS.pokemonInfo}>
                <h3>{pokemon.name}</h3>
                {typeImageId && (
                    <img
                        src={`http://localhost:5212/api/Images/${typeImageId}`}
                        alt={type}
                        className={PokemonContainerCSS.typeIcon}
                    />
                )}
            </div>
            <HealthBar health={health} maxHealth={maxHealth} />
            {isPlayer && energy !== undefined && maxEnergy !== undefined && (
                <EnergyBar energy={energy} maxEnergy={maxEnergy} />
            )}
        </div>
    );
};

export default PokemonContainer;
