import { Link } from "react-router-dom";
import MainMenuCSS from "./MainMenu.module.css";
import MenuBtn from "../components/MenuBtn";
import MenuBg from "../components/MenuBg";

const MainMenu: React.FC = () => {
  return (
    <>
      <MenuBg>
        <div className={MainMenuCSS.mainMenu__buttons__container}>
          <Link to={"/nickname"}>
            <MenuBtn btnText="Hrát" />
          </Link>
          <Link to={"/statistics"}>
            <MenuBtn btnText="Statistiky" />
          </Link>
        </div>

        <Link to={"/admin"}>
          <p className={MainMenuCSS.mainMenu__adminlink}>
            <b>Administrace</b>
          </p>
        </Link>
      </MenuBg>
    </>
  );
};

export default MainMenu;
