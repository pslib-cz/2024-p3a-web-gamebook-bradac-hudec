import React from "react";
import AttackButton from "./AttackButton";
import AttackType from "../types/AttackType";
import AttacksContainerCSS from "../styles/components/AttacksContainer.module.css";

interface AttacksContainerProps {
    attacks: AttackType[];
    onAttack: (attack: AttackType) => void;
}

const AttacksContainer: React.FC<AttacksContainerProps> = ({
    attacks,
    onAttack,
}) => {
    console.log("Attacks in AttacksContainer:", attacks); 

    if (!attacks || attacks.length === 0) {
        return <div>No attacks available</div>;
    }

    return (
        <div className={AttacksContainerCSS.attacksContainer}>
            {attacks.map((attack) => (
                <AttackButton
                    key={attack.attackId}
                    attack={attack}
                    onAttack={onAttack}
                />
            ))}
        </div>
    );
};

export default AttacksContainer;
