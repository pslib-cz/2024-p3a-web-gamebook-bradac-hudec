import React from 'react';
import BattleCSS from "../styles/pages/Battle.module.css";

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className={BattleCSS.gameOver} style={{
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
        marginBottom: '1rem'
      }}>Game Over</h2>
      <p style={{
        fontSize: '1.5rem',
        marginBottom: '2rem',
        color: 'white',
        textShadow: '1px 1px 10px #000'
      }}>Všichni tví pokémoni jsou vyčerpaní!</p>
      <button
        onClick={onRestart}
        style={{
          padding: '15px 30px',
          fontSize: '1.5em',
          backgroundColor: '#d9d9d9',
          border: 'solid 5px #a1a1a1',
          borderRadius: '20px',
          color: '#fff',
          cursor: 'pointer',
          textShadow: '1px 1px 30px #000'
        }}
      >
        Začít znovu
      </button>
    </div>
  );
};

export default GameOverScreen; 