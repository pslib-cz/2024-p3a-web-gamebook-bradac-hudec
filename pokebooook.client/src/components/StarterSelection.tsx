import React from "react";
import StarterSelectionCSS from "../styles/components/StarterSelection.module.css";
import { API_URL } from "../env";

interface StarterPokemon {
    id: number;
    name: string;
    imageId: number;
    health: number;
    energy: number;
}

interface StarterSelectionProps {
    onSelect: (pokemon: StarterPokemon) => void;
}

const StarterSelection: React.FC<StarterSelectionProps> = ({ onSelect }) => {
    const [starters, setStarters] = React.useState<StarterPokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] =
        React.useState<StarterPokemon | null>(null);

    React.useEffect(() => {
        const fetchStarters = async () => {
            try {
                const starterIds = [1, 4, 7];
                const pokemonPromises = starterIds.map((id) =>
                    fetch(`${API_URL}/api/Pokemons/${id}`).then(
                        (res) => res.json()
                    )
                );
                const pokemonData = await Promise.all(pokemonPromises);
                console.log("Fetched starter pokemon data:", pokemonData);
                
            
                const transformedData = pokemonData.map(pokemon => ({
                    id: pokemon.pokemonId,
                    name: pokemon.name,
                    imageId: pokemon.imageId,
                    health: pokemon.health,
                    energy: pokemon.energy || 100
                }));
                console.log("Transformed starter data:", transformedData);
                setStarters(transformedData);
            } catch (error) {
                console.error("Failed to fetch starter Pokemon:", error);
            }
        };
        fetchStarters();
    }, []);

    const handlePokemonClick = (pokemon: StarterPokemon) => {
        console.log("Selected starter pokemon:", pokemon);
        setSelectedPokemon(pokemon);
    };

    const handleConfirm = () => {
        if (selectedPokemon) {
            console.log("Confirming starter pokemon:", selectedPokemon);
            onSelect(selectedPokemon);
        }
    };

    return (
        <div className={StarterSelectionCSS.container}>
            <h2 className={StarterSelectionCSS.title}>Vyber si svého prvního pokémona!</h2>
            <div className={StarterSelectionCSS.pokemonGrid}>
                {starters.map((pokemon) => (
                    <div
                        key={`starter-${pokemon.id}`}
                        className={`${StarterSelectionCSS.pokemonCard} ${
                            selectedPokemon?.id === pokemon.id
                                ? StarterSelectionCSS.selected
                                : ""
                        }`}
                        onClick={() => handlePokemonClick(pokemon)}
                    >
                        <img
                            src={`${API_URL}/api/Images/${pokemon.imageId}`}
                            alt={pokemon.name}
                            className={StarterSelectionCSS.pokemonImage}
                        />
                        <h3 className={StarterSelectionCSS.pokemonName}>{pokemon.name}</h3>
                    </div>
                ))}
            </div>
            {selectedPokemon && (
                <button
                    className={StarterSelectionCSS.confirmButton}
                    onClick={handleConfirm}
                >
                    Vybrat {selectedPokemon.name}
                </button>
            )}
        </div>
    );
};

export default StarterSelection;
