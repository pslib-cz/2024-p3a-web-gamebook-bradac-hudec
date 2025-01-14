import {FC} from "react"; 
import { useCallback, useEffect, useState } from "react";
import MenuBgCSS from "./MenuBg.module.css";

type ContainerProps = {
    children: React.ReactNode;
}



const MenuBg:FC<ContainerProps> = ( {children} ) => {
    
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
        null
      );
    
      const fetchBackgroundImage = useCallback((imageId: number) => {
        const imageUrl = `http://localhost:5212/api/Images/${imageId}`;
        setBackgroundImageUrl(imageUrl);
      }, []);
    
      useEffect(() => {
        fetchBackgroundImage(153);
      }, [fetchBackgroundImage]);




    return (

<div
      className={MenuBgCSS.mainMenu__container}
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : "none",
      }}
    >
  {children}
</div>


    )
   
   
    
}
export default MenuBg;