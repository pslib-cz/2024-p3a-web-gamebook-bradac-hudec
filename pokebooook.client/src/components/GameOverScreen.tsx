import React from 'react';
import GameOverScreenCSS from "../styles/components/GameOverScreen.module.css";

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className={GameOverScreenCSS.gameOver}>
      <h2 className={GameOverScreenCSS.title}>Game Over</h2>
      <p className={GameOverScreenCSS.message}>Všichni tví pokémoni jsou vyčerpaní!</p>
      <button
        onClick={onRestart}
        className={GameOverScreenCSS.restartButton}
      >
        Začít znovu
      </button>
    </div>
  );
};

export default GameOverScreen; 