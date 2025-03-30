import React from 'react';
import PokemonType from '../types/PokemonType';
import BattleCSS from '../styles/pages/Battle.module.css';

interface PokemonSelectionGridProps {
  playerPokemons: PokemonType[];
  loading: boolean;
  onSelect: (pokemon: PokemonType) => void;
}

const PokemonSelectionGrid: React.FC<PokemonSelectionGridProps> = ({ 
  playerPokemons, 
  loading, 
  onSelect 
}) => {
  if (loading) {
    return <div className={BattleCSS.loading}>Načítání...</div>;
  }

  return (
    <div className={BattleCSS.pokemonGrid}>
      {playerPokemons.map((pokemon, index) => {
        return (
          <div
            key={index}
            className={`${BattleCSS.pokemonOption} ${
              pokemon.health <= 0 ? BattleCSS.disabled : ""
            }`}
            onClick={() => {
              if (pokemon.health > 0) {
                onSelect(pokemon);
              }
            }}
            style={{
              cursor: pokemon.health > 0 ? "pointer" : "not-allowed",
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/Images/${pokemon.imageId}`}
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
  );
};

export default PokemonSelectionGrid; 