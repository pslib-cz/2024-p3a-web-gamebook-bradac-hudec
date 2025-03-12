import { useState, useEffect } from 'react';
import ItemInventoryCellCSS from './ItemInventoryCell.module.css';

interface GameItem {
    id: number;
    name: string;
    imageId: string;
    description: string;
}

interface ItemInventoryCellProps {
    item?: GameItem;
}

const ItemInventoryCell: React.FC<ItemInventoryCellProps> = ({ item }) => {
    return (
        <div className={ItemInventoryCellCSS.item__cell} title={item?.description}>
            {item && (
                <img 
                    src={`http://localhost:5212/api/Images/${item.imageId}`} 
                    alt={item.name}
                    className={ItemInventoryCellCSS.item__image}
                />
            )}
        </div>
    );
};

export default ItemInventoryCell;