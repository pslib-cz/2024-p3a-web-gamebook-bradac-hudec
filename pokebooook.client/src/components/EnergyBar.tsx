import React from "react";
import EnergyBarCSS from "./EnergyBar.module.css";
import EnergyBarProps from "../types/EnergyBarType";

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy }) => {
  const safeMaxEnergy = maxEnergy > 0 ? maxEnergy : 1; 
  const energyPercentage = (energy / safeMaxEnergy) * 100;

  return (
    <div className={EnergyBarCSS.energyBarContainer}>
      <div
        className={EnergyBarCSS.energyBar}
        style={{
          width: `${energyPercentage}%`,
        }}
      ></div>
      <p className={EnergyBarCSS.energyText}>
        {energy}/{safeMaxEnergy}
      </p>
    </div>
  );
};
export default EnergyBar;