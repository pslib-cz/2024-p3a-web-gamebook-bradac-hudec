import React, { FC } from 'react';
import PokemonInventoryCSS from "../styles/menus/PokemonInventory.module.css";
import PokemonType from '../types/PokemonType';

type PokemonInventoryProps = { 
    children: React.ReactNode;
    onSelect?: (pokemon: PokemonType) => void;
}

const PokemonInventory: FC<PokemonInventoryProps> = ({ children, onSelect }) => {
    return (
        <div className={PokemonInventoryCSS.pokemonInventory}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<{ onSelect?: (pokemon: PokemonType) => void }>, { onSelect });
                }
                return child;
            })}
        </div>
    );
}

export default PokemonInventory;