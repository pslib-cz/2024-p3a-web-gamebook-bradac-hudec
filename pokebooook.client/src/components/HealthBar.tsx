import React from 'react';
import HealthbarCSS from './HealthBar.module.css';

type HealthBarProps = {
    health: number;
    maxHealth: number;
};

const HealthBar: React.FC<HealthBarProps> = ({ health, maxHealth }) => {
    const healthPercentage = (health / maxHealth) * 100;

    return (
        <div className={HealthbarCSS.healthBarContainer}>
            <div
                className={HealthbarCSS.healthBar}
                style={{
                    width: `${healthPercentage}%`,
                }}
            ></div>
            <p className={HealthbarCSS.healthText}>
                {health}/{maxHealth}
            </p>
        </div>
    );
};

export default HealthBar;