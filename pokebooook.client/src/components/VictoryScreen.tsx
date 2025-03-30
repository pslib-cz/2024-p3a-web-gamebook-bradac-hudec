import React, { useEffect } from "react";
import VictoryScreenCSS from "../styles/components/VictoryScreen.module.css";
import GameItem from "../types/GameItem";
import PokemonType from "../types/PokemonType";
import { API_URL } from "../env";

interface VictoryScreenProps {
  earnedItems: GameItem[];
  capturedPokemon?: PokemonType | null;
  onContinue: () => void;
}

interface GroupedItem {
  item: GameItem;
  count: number;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
  earnedItems,
  capturedPokemon,
  onContinue,
}) => {
  useEffect(() => {
    console.log("VictoryScreen - předané předměty:", earnedItems);
    if (capturedPokemon) {
      console.log("VictoryScreen - chycený pokémon:", capturedPokemon);
    }
  }, [earnedItems, capturedPokemon]);

  const handleContinue = () => {
    console.log("Hráč klikl na Pokračovat");
    onContinue();
  };

  const groupItems = (items: GameItem[]): GroupedItem[] => {
    if (!items || items.length === 0) return [];

    const groupedMap = new Map<string, GroupedItem>();

    items.forEach((item) => {
      if (groupedMap.has(item.name)) {
        const groupedItem = groupedMap.get(item.name)!;
        groupedItem.count += 1;
      } else {
        groupedMap.set(item.name, { item, count: 1 });
      }
    });

    return Array.from(groupedMap.values());
  };

  const groupedItems = groupItems(earnedItems);

  return (
    <div className={VictoryScreenCSS.victoryScreen}>
      <h2 className={VictoryScreenCSS.title}>Vítězství!</h2>
      
      {capturedPokemon && (
        <>
          <h3 className={VictoryScreenCSS.sectionTitle}>Chytil jsi nového pokémona!</h3>
          <div className={VictoryScreenCSS.capturedPokemonContainer}>
            <div className={VictoryScreenCSS.pokemonCard}>
              <img
                src={`${API_URL}api/Images/${capturedPokemon.imageId}`}
                alt={capturedPokemon.name}
                className={VictoryScreenCSS.pokemonImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentNode;
                  if (parent) {
                    const textNode = document.createElement("div");
                    textNode.className = VictoryScreenCSS.placeholder;
                    textNode.innerText = "?";
                    parent.prepend(textNode);
                  }
                }}
              />
              <span className={VictoryScreenCSS.pokemonName}>{capturedPokemon.name}</span>
            </div>
          </div>
        </>
      )}
      
      {groupedItems.length > 0 ? (
        <>
          <h3 className={VictoryScreenCSS.sectionTitle}>Získal jsi tyto předměty:</h3>
          <div className={VictoryScreenCSS.itemsGrid}>
            {groupedItems.map((groupedItem) => (
              <div key={groupedItem.item.id} className={VictoryScreenCSS.itemCard}>
                <img
                  src={`${API_URL}api/Images/${groupedItem.item.imageId}`}
                  alt={groupedItem.item.name}
                  className={VictoryScreenCSS.itemImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentNode;
                    if (parent) {
                      const textNode = document.createElement("div");
                      textNode.className = VictoryScreenCSS.placeholder;
                      textNode.innerText = "?";
                      parent.prepend(textNode);
                    }
                  }}
                />
                <span className={VictoryScreenCSS.itemName}>
                  {groupedItem.item.name}{" "}
                  {groupedItem.count > 1 && (
                    <strong className={VictoryScreenCSS.itemCount}>×{groupedItem.count}</strong>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className={VictoryScreenCSS.sectionTitle}>
            Nezískal jsi žádné předměty.
          </h3>
        </>
      )}
      
      <button
        className={VictoryScreenCSS.continueButton}
        onClick={handleContinue}
      >
        Pokračovat
      </button>
    </div>
  );
};

export default VictoryScreen;
