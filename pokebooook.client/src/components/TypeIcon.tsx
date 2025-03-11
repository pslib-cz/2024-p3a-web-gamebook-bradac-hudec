import React, { useEffect, useState } from "react";
import styles from "./TypeIcon.module.css";
import PokemonTypeEnum from "../types/PokemonTypeEnum";

interface TypeIconProps {
    typeId: number;
    size?: "small" | "medium" | "large";
}

const TypeIcon: React.FC<TypeIconProps> = ({ typeId, size = "medium" }) => {
    const [typeInfo, setTypeInfo] = useState<PokemonTypeEnum | null>(null);

    useEffect(() => {
        const fetchTypeInfo = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5212/api/PokemonTypes/${typeId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setTypeInfo(data);
                }
            } catch (error) {
                console.error("Error fetching type info:", error);
            }
        };

        if (typeId) {
            fetchTypeInfo();
        }
    }, [typeId]);

    const getTypeClassName = () => {
        if (!typeInfo) return `${styles.icon} ${styles.normal} ${styles[size]}`;
        return `${styles.icon} ${styles[typeInfo.name.toLowerCase()]} ${
            styles[size]
        }`;
    };

    return (
        <div className={getTypeClassName()}>
            <img
                src={`http://localhost:5212/api/Images/${typeInfo?.imageId}`}
                alt={typeInfo?.name || "normal"}
                className={styles.typeImage}
            />
        </div>
    );
};

export default TypeIcon;
