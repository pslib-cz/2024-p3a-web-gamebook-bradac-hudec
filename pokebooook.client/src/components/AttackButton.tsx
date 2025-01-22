import React from 'react';
import AttackType from '../types/AttackType';
import styles from './AttackButton.module.css';

type AttackButtonProps = {
    attack: AttackType;
    onAttack: (attack: AttackType) => void;
};

const AttackButton: React.FC<AttackButtonProps> = ({ attack, onAttack }) => {
    return (
        <button
            className={styles.attackButton}
            onClick={() => onAttack(attack)}
        >
            <span className={styles.attackButton__name}>{attack.attackName}</span>
            <span className={styles.attackButton__energy}>{attack.energyCost}</span>
        </button>
    );
};

export default AttackButton;