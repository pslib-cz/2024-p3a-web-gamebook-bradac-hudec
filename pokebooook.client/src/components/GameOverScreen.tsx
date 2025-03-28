import React from 'react';
import BattleCSS from '../Battle.module.css';

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className={BattleCSS.gameOver}>
      <h2>Game Over</h2>
      <p>Všichni tví pokémoni jsou vyčerpaní!</p>
      <button
        className={BattleCSS.restartButton}
        onClick={onRestart}
      >
        Začít znovu
      </button>
    </div>
  );
};

export default GameOverScreen; 