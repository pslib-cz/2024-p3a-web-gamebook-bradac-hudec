import React from 'react';
import AttackType from '../types/AttackType';
import AttackButton from './AttackButton';
import styles from './AttacksContainer.module.css';

type AttacksContainerProps = {
    attacks: AttackType[];
    onAttack: (attack: AttackType) => void;
};

const AttacksContainer: React.FC<AttacksContainerProps> = ({ attacks, onAttack }) => {
    return (
        <div className={styles.attacksContainer}>
            {attacks.map((attack, index) => (
                <AttackButton
                    key={index}
                    attack={attack}
                    onAttack={onAttack}
                />
            ))}
        </div>
    );
};

export default AttacksContainer;