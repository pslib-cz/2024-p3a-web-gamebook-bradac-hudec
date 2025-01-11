import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainMenuCSS from './MainMenu.module.css';

const MainMenu: React.FC = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
    const [pokemonAttack, setPokemonAttack] = useState<string | null>(null);

    const fetchPokemonAttack = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5212/api/Pokemon/1/Attack`);
            const data = await response.json();
            setPokemonAttack(data);
        } catch (error) {
            console.error('Failed to fetch Pokemon attack:', error);
        }
    }, []);

    useEffect(() => {
        fetchPokemonAttack();
    }, [fetchPokemonAttack]);

    const fetchBackgroundImage = useCallback((imageId: number) => {
        const imageUrl = `http://localhost:5212/api/Images/${imageId}`;
        setBackgroundImageUrl(imageUrl);
    }, []);

    useEffect(() => {
        fetchBackgroundImage(153);
    }, [fetchBackgroundImage]);

    return (
        <div
            className={MainMenuCSS.mainMenu__container}
            style={{
                backgroundImage: backgroundImageUrl
                    ? `url(${backgroundImageUrl})`
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
