import React, { useEffect } from "react";
import BattleCSS from "../styles/pages/Battle.module.css";
import GameItem from "../types/GameItem";
import PokemonType from "../types/PokemonType";

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
    <div className={BattleCSS.victoryScreen} style={{
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
      border: 'solid 5px #a1a1a1',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      color: 'white',
      textShadow: '1px 1px 10px #000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '400px',
      maxWidth: '80%',
      zIndex: 1000
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '1px 1px 15px #000',
        marginBottom: '1.5rem'
      }}>Vítězství!</h2>
      
      {capturedPokemon && (
        <>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 10px #000',
            marginBottom: '1rem'
          }}>Chytil jsi nového pokémona!</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(217, 217, 217, 0.5)',
              border: 'solid 3px #a1a1a1',
              padding: '1rem',
              borderRadius: '15px',
              width: 'fit-content',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)'
            }}>
              <img
                src={`http://localhost:5212/api/Images/${capturedPokemon.imageId}`}
                alt={capturedPokemon.name}
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  marginBottom: '0.5rem' 
                }}
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
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>{capturedPokemon.name}</span>
            </div>
          </div>
        </>
      )}
      
      {groupedItems.length > 0 ? (
        <>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 10px #000',
            marginBottom: '1rem'
          }}>Získal jsi tyto předměty:</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            width: '100%'
          }}>
            {groupedItems.map((groupedItem) => (
              <div key={groupedItem.item.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.8rem',
                backgroundColor: 'rgba(217, 217, 217, 0.5)',
                border: 'solid 2px #a1a1a1',
                borderRadius: '10px',
                boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)'
              }}>
                <img
                  src={`http://localhost:5212/api/Images/${groupedItem.item.imageId}`}
                  alt={groupedItem.item.name}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    marginBottom: '0.5rem' 
                  }}
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
                <span style={{ fontWeight: 'bold' }}>
                  {groupedItem.item.name}{" "}
                  {groupedItem.count > 1 && (
                    <strong>×{groupedItem.count}</strong>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 10px #000',
            marginBottom: '0.5rem'
          }}>Bohužel jsi nezískal žádné předměty.</h3>
          <p style={{ 
            fontSize: '1.1rem',
            marginBottom: '1.5rem'
          }}>Možná budeš mít více štěstí příště!</p>
        </>
      )}
      <button 
        onClick={handleContinue}
        style={{
          padding: '15px 30px',
          fontSize: '1.5em',
          backgroundColor: '#d9d9d9',
          border: 'solid 5px #a1a1a1',
          borderRadius: '20px',
          color: '#fff',
          cursor: 'pointer',
          textShadow: '1px 1px 30px #000',
          marginTop: '1rem'
        }}
      >
        Pokračovat
      </button>
    </div>
  );
};

export default VictoryScreen;
