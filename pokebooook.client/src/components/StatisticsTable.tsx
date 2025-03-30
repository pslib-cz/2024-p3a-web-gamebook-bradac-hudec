import { useEffect, useState } from "react";
import StatisticsTableCSS from "../styles/components/StatisticsTable.module.css";

const StatisticsTable = () => { 
  const [caughtPokemon, setCaughtPokemon] = useState<number>(0);
  const [completedGames, setCompletedGames] = useState<number>(0);

  useEffect(() => {

    const loadStatistics = () => {
      try {
       
        const caughtPokemonCount = localStorage.getItem("stats_caughtPokemon");
        if (caughtPokemonCount) {
          setCaughtPokemon(parseInt(caughtPokemonCount));
        }
        
    
        const completedGamesCount = localStorage.getItem("stats_completedGames");
        if (completedGamesCount) {
          setCompletedGames(parseInt(completedGamesCount));
        }
      } catch (error) {
        console.error("Chyba při načítání statistik:", error);
      }
    };

    loadStatistics();
  }, []);

  return (
    <div className={StatisticsTableCSS.statisticsTable__content}>
      <h1 className={StatisticsTableCSS.statisticsTable__content__title}>
        Statistiky
      </h1>
      <div className={StatisticsTableCSS.statisticsTable__content__item}>
        <h2 className={StatisticsTableCSS.statisticsTable__content__heading}>
          Celkový počet dokončených her
        </h2>
        <p className={StatisticsTableCSS.statisticsTable__content__text}>{completedGames}</p>
      </div>
      <div className={StatisticsTableCSS.statisticsTable__content__item}>
        <h2 className={StatisticsTableCSS.statisticsTable__content__heading}>
          Celkový počet chycených pokémonů
        </h2>
        <p className={StatisticsTableCSS.statisticsTable__content__text}>{caughtPokemon}</p>
      </div>
    </div>
  );
};

export default StatisticsTable;