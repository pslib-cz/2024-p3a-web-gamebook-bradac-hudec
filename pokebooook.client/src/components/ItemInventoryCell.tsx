import ItemInventoryCellCSS from './ItemInventoryCell.module.css';

interface GameItem {
    id: number;
    name: string;
    imageId: string;
    description: string;
    count?: number;
}

interface ItemInventoryCellProps {
    item?: GameItem;
}

const ItemInventoryCell: React.FC<ItemInventoryCellProps> = ({ item }) => {
    return (
        <div className={ItemInventoryCellCSS.item__cell} title={item?.description}>
            {item && (
                <>
                    <img 
                        src={`http://localhost:5212/api/Images/${item.imageId}`} 
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