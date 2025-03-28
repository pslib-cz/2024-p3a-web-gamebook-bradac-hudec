import React from "react";
import AttackType from "../types/AttackType";
import AttackButtonCSS from "../styles/components/AttackButton.module.css";

type AttackButtonProps = {
    attack: AttackType;
    onAttack: (attack: AttackType) => void;
};

const AttackButton: React.FC<AttackButtonProps> = ({ attack, onAttack }) => {
    return (
        <button
            className={AttackButtonCSS.attackButton}
            onClick={() => onAttack(attack)}
        >
            <span className={AttackButtonCSS.attackButton__name}>
                {attack.attackName}
            </span>
            <div className={AttackButtonCSS.attackButton__stats}>
                <span className={AttackButtonCSS.attackButton__damage}>
                    {attack.baseDamage}
                </span>
                <span className={AttackButtonCSS.attackButton__energy}>
                    {attack.energyCost}
                </span>
            </div>
        </button>
    );
};

export default AttackButton;
