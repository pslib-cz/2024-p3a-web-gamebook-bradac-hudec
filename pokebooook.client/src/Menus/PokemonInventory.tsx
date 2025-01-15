import { FC } from 'react';
import PokemonInventoryCSS from './PokemonInventory.module.css';

type PokemonInventoryProps = { 
    children: React.ReactNode;  

}


const PokemonInventory:FC<PokemonInventoryProps> = ({children}) => {


        return (
            <>
                <div className={PokemonInventoryCSS.pokemonInventory}>
                  {children}
                </div>
            </>
        );


 }
 export default PokemonInventory;