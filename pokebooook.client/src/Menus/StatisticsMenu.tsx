import StatisticsMenuCSS from "./StatisticsMenu.module.css";
import { Link } from "react-router";
import BackBtn from "../components/BackBtn";
import MenuBg from "../components/MenuBg";

const StatisticsMenu = () => {
  return (
    <>
      <MenuBg>
        <Link to={"/"}>
          <BackBtn btnText="Hlavní menu" />
        </Link>

        <div className={StatisticsMenuCSS.statisticsMenu__content}>
          <h1 className={StatisticsMenuCSS.statisticsMenu__heading}>
            Statistiky
          </h1>
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
      </MenuBg>
    </>
  );
};
export default StatisticsMenu;
