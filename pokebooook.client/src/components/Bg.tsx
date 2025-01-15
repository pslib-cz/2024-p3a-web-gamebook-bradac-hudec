import React, { useEffect } from 'react';
import BgCSS from './Bg.module.css';

interface BgProps {
    imageId: number;
    children: React.ReactNode;
}

const Bg: React.FC<BgProps> = ({ imageId, children }) => {
    const backgroundImageUrl = `http://localhost:5212/api/Images/${imageId}`; 

    useEffect(() => {
        console.log('Background image updated:', backgroundImageUrl);
    }, [backgroundImageUrl]);

    return (
        <div className={BgCSS.bg__container} style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
            {children}
        </div>
    );
};

export default Bg;