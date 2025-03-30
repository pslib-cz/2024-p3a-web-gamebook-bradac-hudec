import React from 'react';
import GameOverScreenCSS from "../styles/components/GameOverScreen.module.css";

type GameOverScreenProps = {
  onRestart: () => void;
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  const handleRestart = () => {
    // Zálohujeme statistiky před resetováním localStorage
    const stats = {
      completedGames: localStorage.getItem("stats_completedGames"),
      caughtPokemon: localStorage.getItem("stats_caughtPokemon")
    };
    
    // Resetujeme localStorage
    localStorage.clear();
    
    // Obnovíme statistiky ze zálohy
    if (stats.completedGames) {
      localStorage.setItem("stats_completedGames", stats.completedGames);
    }
    if (stats.caughtPokemon) {
      localStorage.setItem("stats_caughtPokemon", stats.caughtPokemon);
    }
    
    // Voláme původní onRestart funkci
    onRestart();
  };

  return (
    <div className={GameOverScreenCSS.gameOver}>
      <h2 className={GameOverScreenCSS.title}>Game Over</h2>
      <p className={GameOverScreenCSS.message}>Všichni tví pokémoni jsou vyčerpaní!</p>
      <button
        onClick={handleRestart}
        className={GameOverScreenCSS.restartButton}
      >
        Začít znovu
      </button>
    </div>
  );
};

export default GameOverScreen; 