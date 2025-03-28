import { Link } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import Bg from "../components/Bg";
import StatisticsTable from "../components/StatisticsTable";

const StatisticsMenu = () => {
    return (
        <Bg imageId={300}>
            <Link to={"/"}>
                <BackBtn btnText="Hlavní menu" />
            </Link>

            <StatisticsTable />
        </Bg>
    );
};
export default StatisticsMenu;
