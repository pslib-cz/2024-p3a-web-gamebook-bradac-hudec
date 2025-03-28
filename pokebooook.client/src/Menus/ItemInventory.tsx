import { FC } from 'react';
import ItemInventoryCSS from "../styles/menus/ItemInventory.module.css";

type ItemInventoryProps = { 
    children: React.ReactNode;  

}

const ItemInventory:FC<ItemInventoryProps> = ({children}) => {

    return (
        <div className={ItemInventoryCSS.itemInventory}>
           {children}
        </div>
    );

};
export default ItemInventory;