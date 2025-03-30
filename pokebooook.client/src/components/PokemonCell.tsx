import React, { useState } from 'react';
import PokemonCellCSS from "../styles/components/PokemonCell.module.css";
import PokemonType from "../types/PokemonType";
import ConfirmationDialog from './ConfirmationDialog';
import { API_URL } from '../env';

interface PokemonCellProps {
    pokemon?: PokemonType;
    onSelect?: (pokemon: PokemonType) => void;
}

const PokemonCell: React.FC<PokemonCellProps> = ({ pokemon, onSelect }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleClick = () => {
        if (pokemon && onSelect) {
            setShowConfirmation(true);
        }
    };

    const handleConfirm = () => {
        if (pokemon && onSelect) {
            onSelect(pokemon);
            setShowConfirmation(false);
        }
    };  

    return (
        <>
            <div className={PokemonCellCSS.pokemon__cell} onClick={handleClick}>
                {pokemon && (
                    <>
                        <div className={PokemonCellCSS.pokemon__image__container}>
                            <img
                                src={`${API_URL}api/Images/${pokemon.imageId}`}
                                alt={pokemon.name}
                                className={PokemonCellCSS.pokemon__image}
                            />
                        </div>
                        <div className={PokemonCellCSS.pokemon__stats}>
                            <div 
                                className={PokemonCellCSS.pokemon__health}
                                style={{
                                    '--value': `${(pokemon.health / pokemon.maxHealth) * 100}%`
                                } as React.CSSProperties}
                            />
                            <div 
                                className={PokemonCellCSS.pokemon__energy}
                                style={{
                                    '--value': `${(pokemon.energy / 100) * 100}%`
                                } as React.CSSProperties}
                            />
                        </div>
                    </>
                )}
            </div>
            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirm}
                title="Výběr pokémona"
                message={`Opravdu chceš vybrat ${pokemon?.name}?`}
            />
        </>
    );
};

export default PokemonCell;
