import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainMenuCSS from './MainMenu.module.css';

const MainMenu: React.FC = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
    
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
            <Link to={'/nickname'}>
                <button className={MainMenuCSS.mainMenu__btn}><b>Hrát</b></button>
            </Link>
            <Link to={'/statistics'}>
                <button className={MainMenuCSS.mainMenu__btn}><b>Statistiky</b></button>
            </Link>
            </div>

            <Link to={'/admin'}>
                <p className={MainMenuCSS.mainMenu__adminlink}><b>Administrace</b></p>
            </Link>
        </div>
    );
};

export default MainMenu;
