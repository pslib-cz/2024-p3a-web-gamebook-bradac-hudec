import PokemonAttack from "./pokemonAttacks";

type PokemonType = {
    pokemonId: number;
    name: string;
    imageId: string;
    maxHealth: number;
    health: number;
    energy: number;
    type: string;
    typeImageId: number;
    pokemonAttacks: PokemonAttack[];
    instanceId?: string;
};

export default PokemonType;
