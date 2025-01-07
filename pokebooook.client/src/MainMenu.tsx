import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import MainMenuCSS from './MainMenu.module.css';

interface ImageData {
    id: number;
    type: string;
    data: string;
}

const MainMenu: React.FC = () => {
    const [backgroundImage, setBackgroundImage] = useState<ImageData | null>(null);
    const [pokemonAttack, setPokemonAttack] = useState<string | null>("");

    const FetchPokemonAttack = useCallback(async () => {
        const response = await fetch(`http://localhost:5212/api/Pokemon/1/Attack`);
        const data = await response.json();
        setPokemonAttack(data);
    }, []);

    useEffect(() => {
        FetchPokemonAttack();
       console.log(pokemonAttack);
    }, [pokemonAttack]);


    const fetchBackgroundImage = useCallback(async (imageId: number) => {
        try {
            const response = await fetch(`http://localhost:5212/api/Images/${imageId}`);
            const data = await response.json();
            setBackgroundImage(data);
        } catch (error) {
            console.error('Failed to fetch background image:', error);
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
                    : 'none',
            }}
        >
            <div className={MainMenuCSS.mainMenu__buttons__container}>
                <button className={MainMenuCSS.mainMenu__btn}><b>Hrát</b></button>
                <button className={MainMenuCSS.mainMenu__btn}><b>Statistiky</b></button>
            </div>

            <Link to={'/admin'}>
                <p className={MainMenuCSS.mainMenu__adminlink}><b>Administrace</b></p>
            </Link>
        </div>
    );
};

export default MainMenu;
