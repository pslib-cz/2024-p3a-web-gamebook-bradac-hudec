import React from 'react';
import PokemonType from '../types/PokemonType';
import PokemonSelectionGridCSS from '../styles/components/PokemonSelectionGrid.module.css';
import { API_URL } from '../env';

type PokemonSelectionGridProps = {
  playerPokemons: PokemonType[];
  loading: boolean;
  onSelect: (pokemon: PokemonType) => void;
};

const PokemonSelectionGrid: React.FC<PokemonSelectionGridProps> = ({ 
  playerPokemons, 
  loading, 
  onSelect 
}) => {
  if (loading) {
    return <div className={PokemonSelectionGridCSS.loading}>Načítání...</div>;
  }

  return (
    <div className={PokemonSelectionGridCSS.pokemonGrid}>
      {playerPokemons.map((pokemon, index) => {
        return (
          <div
            key={index}
            className={`${PokemonSelectionGridCSS.pokemonOption} ${
              pokemon.health <= 0 ? PokemonSelectionGridCSS.disabled : ""
            }`}
            onClick={() => {
              if (pokemon.health > 0) {
                onSelect(pokemon);
              }
            }}
          >
            <img
              src={`${API_URL}api/Images/${pokemon.imageId}`}
              alt={pokemon.name}
            />
            <div className={PokemonSelectionGridCSS.pokemonInfo}>
              <span>{pokemon.name}</span>
              <span>
                HP: {pokemon.health}/{pokemon.maxHealth}
              </span>
            </div>
            {pokemon.health <= 0 && (
              <div className={PokemonSelectionGridCSS.faintedOverlay}>Vyčerpaný</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PokemonSelectionGrid; 