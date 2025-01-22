import PokemonAttack from './pokemonAttacks';

type PokemonType = {
    pokemonId: number;
    name: string;
    imageId: string;
    maxHealth: number;
    health: number;
    energy: number; 
    pokemonAttacks: PokemonAttack[];
}

export default PokemonType;