import React, { useEffect } from "react";
import BattleCSS from "../Battle.module.css";
import GameItem from "../types/GameItem";

interface VictoryScreenProps {
  earnedItems: GameItem[];
  onContinue: () => void;
}

interface GroupedItem {
  item: GameItem;
  count: number;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
  earnedItems,
  onContinue,
}) => {
  useEffect(() => {
    console.log("VictoryScreen - předané předměty:", earnedItems);
  }, [earnedItems]);

  const handleContinue = () => {
    console.log("Hráč klikl na Pokračovat");
    onContinue();
  };

  const groupItems = (items: GameItem[]): GroupedItem[] => {
    if (!items || items.length === 0) return [];

    const groupedMap = new Map<number, GroupedItem>();

    items.forEach((item) => {
      if (groupedMap.has(item.id)) {
        const groupedItem = groupedMap.get(item.id)!;
        groupedItem.count += 1;
      } else {
        groupedMap.set(item.id, { item, count: 1 });
      }
    });

    return Array.from(groupedMap.values());
  };

  const groupedItems = groupItems(earnedItems);

  return (
    <div className={BattleCSS.victoryScreen}>
      <h2>Vítězství!</h2>
      {earnedItems && earnedItems.length > 0 ? (
        <div className={BattleCSS.earnedItems}>
          <h3>Získal jsi tyto předměty:</h3>
          <div className={BattleCSS.itemsGrid}>
            {groupedItems.map((groupedItem) => (
              <div key={groupedItem.item.id} className={BattleCSS.itemCard}>
                <img
                  src={`http://localhost:5212/api/Images/${groupedItem.item.imageId}`}
                  alt={groupedItem.item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentNode;
                    if (parent) {
                      const textNode = document.createElement("div");
                      textNode.className = BattleCSS.itemPlaceholder;
                      textNode.innerText = "?";
                      parent.prepend(textNode);
                    }
                  }}
                />
                <span>
                  {groupedItem.item.name}{" "}
                  {groupedItem.count > 1 && (
                    <strong>×{groupedItem.count}</strong>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={BattleCSS.earnedItems}>
          <h3>Bohužel jsi nezískal žádné předměty.</h3>
          <p>Možná budeš mít více štěstí příště!</p>
        </div>
      )}
      <button className={BattleCSS.continueButton} onClick={handleContinue}>
        Pokračovat
      </button>
    </div>
  );
};

export default VictoryScreen;
