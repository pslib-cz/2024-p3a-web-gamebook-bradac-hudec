import { Link } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import Bg from "../components/Bg";
import StatisticsTable from "../components/StatisticsTable";
import StatisticsMenuCSS from "../styles/menus/StatisticsMenu.module.css";

const StatisticsMenu = () => {
    return (
        <Bg imageId={300}>
            <div className={StatisticsMenuCSS.statistics__container}>
                <h1 className={StatisticsMenuCSS.statistics__title}>Statistiky pokébook</h1>
                <StatisticsTable />
                <div className={StatisticsMenuCSS.statistics__back_button}>
                    <Link to={"/"}>
                        <BackBtn btnText="Hlavní menu" />
                    </Link>
                </div>
            </div>
        </Bg>
    );
};
export default StatisticsMenu;
