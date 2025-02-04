import PokemonCellCSS from "./PokemonCell.module.css";
import PokemonType from "../types/PokemonType";

interface PokemonCellProps {
    pokemon?: PokemonType;
}

const PokemonCell: React.FC<PokemonCellProps> = ({ pokemon }) => {
    return (
        <div className={PokemonCellCSS.pokemon__cell}>
            {pokemon && (
                <div className={PokemonCellCSS.pokemon__image__container}>
                    <img
                        src={`http://localhost:5212/api/Images/${pokemon.imageId}`}
                        alt={pokemon.name}
                        className={PokemonCellCSS.pokemon__image}
                    />
                </div>
            )}
        </div>
    );
};
export default PokemonCell;
