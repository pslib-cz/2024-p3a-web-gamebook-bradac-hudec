import React from "react";
import styles from "./StarterSelection.module.css";

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
                    fetch(`http://localhost:5212/api/Pokemons/${id}`).then(
                        (res) => res.json()
                    )
                );
                const pokemonData = await Promise.all(pokemonPromises);
                setStarters(pokemonData);
            } catch (error) {
                console.error("Failed to fetch starter Pokemon:", error);
            }
        };
        fetchStarters();
    }, []);

    const handlePokemonClick = (pokemon: StarterPokemon) => {
        setSelectedPokemon(pokemon);
    };

    const handleConfirm = () => {
        if (selectedPokemon) {
            if (
                window.confirm(
                    `Chceš si vybrat pokémona ${selectedPokemon.name}?`
                )
            ) {
                onSelect(selectedPokemon);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Vyber si svého prvního pokémona!</h2>
            <div className={styles.pokemonGrid}>
                {starters.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className={`${styles.pokemonCard} ${
                            selectedPokemon?.id === pokemon.id
                                ? styles.selected
                                : ""
                        }`}
                        onClick={() => handlePokemonClick(pokemon)}
                    >
                        <img
                            src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                            alt={pokemon.name}
                            className={styles.pokemonImage}
                        />
                        <h3 className={styles.pokemonName}>{pokemon.name}</h3>
                    </div>
                ))}
            </div>
            {selectedPokemon && (
                <button
                    className={styles.confirmButton}
                    onClick={handleConfirm}
                >
                    Vybrat {selectedPokemon.name}
                </button>
            )}
        </div>
    );
};

export default StarterSelection;
