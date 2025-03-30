import ItemInventoryCellCSS from '../styles/components/ItemInventoryCell.module.css';
import GameItem from '../types/GameItem';

interface ItemInventoryCellProps {
    item?: GameItem;
    onClick?: (item: GameItem) => void;
}

const ItemInventoryCell: React.FC<ItemInventoryCellProps> = ({ item, onClick }) => {
    const handleClick = () => {
        if (item && onClick) {
            onClick(item);
        }
    };

    return (
        <div 
            className={`${ItemInventoryCellCSS.item__cell} ${item && onClick ? ItemInventoryCellCSS.item__cell__clickable : ''}`} 
            title={item?.description}
            onClick={handleClick}
        >
            {item && (
                <>
                    <img 
                        src={`${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/Images/${item.imageId}`} 
                        alt={item.name}
                        className={ItemInventoryCellCSS.item__image}
                    />
                    {item.count && item.count > 1 && (
                        <span className={ItemInventoryCellCSS.item__count}>×{item.count}</span>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemInventoryCell;