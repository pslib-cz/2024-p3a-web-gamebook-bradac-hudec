import React from 'react';
import EnergyBarCSS from './EnergyBar.module.css';

type EnergyBarProps = {
    energy: number;
    maxEnergy: number;
};

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy }) => {
    const energyPercentage = (energy / maxEnergy) * 100;

    return (
        <div className={EnergyBarCSS.energyBarContainer}>
            <div
                className={EnergyBarCSS.energyBar}
                style={{
                    width: `${energyPercentage}%`,
                }}
            ></div>
            <p className={EnergyBarCSS.energyText}>
                {energy}/{maxEnergy}
            </p>
        </div>
    );
};

export default EnergyBar;