import React, { useEffect } from 'react';
import BgCSS from "../styles/components/Bg.module.css";
import { API_URL } from '../env';

interface BgProps {
    imageId?: number;
    bgImage?: string;
    children?: React.ReactNode;
}

const Bg: React.FC<BgProps> = ({ imageId, bgImage, children }) => {
    let backgroundImageUrl = bgImage || '';
    
   
    if (imageId && !bgImage) {
        backgroundImageUrl = `${API_URL}api/Images/${imageId}`;
    }

    useEffect(() => {
        console.log('Background image updated:', backgroundImageUrl);
    }, [backgroundImageUrl]);

    return (
        <div className={BgCSS.bg__container} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            {children}
        </div>
    );
};

export default Bg;