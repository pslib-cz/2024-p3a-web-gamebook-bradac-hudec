import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import MainMenuCSS from "./MainMenu.module.css";

interface ImageData {
    id: number;
    type: string;
    data: string;
}

const MainMenu: React.FC = () => {
    const [backgroundImage, setBackgroundImage] = useState<ImageData | null>(
        null
    );
    const [isNameInputVisible, setIsNameInputVisible] = useState(false);
    const handlePlayClick = () => {
        setIsNameInputVisible(true);
    };
    const handleBackClick = () => {
        setIsNameInputVisible(false);
    };

    const fetchBackgroundImage = useCallback(async (imageId: number) => {
        try {
            const response = await fetch(
                `http://localhost:5212/api/Images/${imageId}`
            );
            const data = await response.json();
            setBackgroundImage(data);
        } catch (error) {
            console.error("Failed to fetch background image:", error);
        }
    }, []);

    useEffect(() => {
        fetchBackgroundImage(153);
    }, [fetchBackgroundImage]);

    return (
        <div
            className={MainMenuCSS.mainMenu__container}
            style={{
                backgroundImage: backgroundImage
                    ? `url(data:${backgroundImage.type};base64,${backgroundImage.data})`
                    : "none",
            }}
        >
            <div className={MainMenuCSS.mainMenu__buttons__container}>
                {!isNameInputVisible ? (
                    <>
                        <button
                            onClick={handlePlayClick}
                            className={MainMenuCSS.mainMenu__btn}
                        >
                            <b>Hrát</b>
                        </button>
                        <button className={MainMenuCSS.mainMenu__btn}>
                            <b>Statistiky</b>
                        </button>
                        <Link to={"/admin"}>
                            <p className={MainMenuCSS.mainMenu__adminlink}>
                                <b>Administrace</b>
                            </p>
                        </Link>
                    </>
                ) : (
                    <>
                        <h2 style={{ color: "white", margin: 0 }}>
                            Zvolte vaši přezdívku
                        </h2>
                        <input
                            type="text"
                            className={MainMenuCSS.mainMenu__input}
                            placeholder="Vaše jméno"
                        />
                        <Link to={"/locations/1"}>
                            <button className={MainMenuCSS.mainMenu__btn}>
                                <b>Pokračovat</b>
                            </button>
                        </Link>
                        <button
                            onClick={handleBackClick}
                            className={MainMenuCSS.mainMenu__btn}
                        >
                            <b>Zpět</b>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MainMenu;
