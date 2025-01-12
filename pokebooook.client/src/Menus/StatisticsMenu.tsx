import React, { useCallback, useEffect, useState } from "react";
import StatisticsMenuCSS from "./StatisticsMenu.module.css";
import { Link } from "react-router";

const StatisticsMenu = () => {
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
      className={StatisticsMenuCSS.statisticsMenu__container}
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : "none",
      }}
    >
     <Link to={"/"}>
       <button className={StatisticsMenuCSS.statisticsMenu__btn}>Zpátky</button>
     </Link>
      
      <div className={StatisticsMenuCSS.statisticsMenu__content}>
        <h1 className={StatisticsMenuCSS.statisticsMenu__heading}>Statistiky</h1>
        <div className={StatisticsMenuCSS.statisticsMenu__content__item}>
          <h2 className={StatisticsMenuCSS.statisticsMenu__content__heading}>
            asinejakydalsistat
          </h2>
          <p className={StatisticsMenuCSS.statisticsMenu__content__text}>0</p>
        </div>
        <div className={StatisticsMenuCSS.statisticsMenu__content__item}>
          <h2 className={StatisticsMenuCSS.statisticsMenu__content__heading}>
            Celkový počet dohraných her
          </h2>
          <p className={StatisticsMenuCSS.statisticsMenu__content__text}>0</p>
        </div>
        <div className={StatisticsMenuCSS.statisticsMenu__content__item}>
          <h2 className={StatisticsMenuCSS.statisticsMenu__content__heading}>
            Celkový počet chycených pokémonů
          </h2>
          <p className={StatisticsMenuCSS.statisticsMenu__content__text}>0</p>
        </div>
      </div>
    </div>
  );
};
export default StatisticsMenu;
