import { Link } from "react-router";
import BackBtn from "../components/BackBtn";
import MenuBg from "../components/MenuBg";
import StatisticsTable from "../components/StatisticsTable";

const StatisticsMenu = () => {
  return (    
      <MenuBg>

        <Link to={"/"}>
          <BackBtn btnText="Hlavní menu" />
        </Link>

        <StatisticsTable />

      </MenuBg>  
  );
};
export default StatisticsMenu;
