import { Link } from "react-router-dom";
import MainMenuCSS from "./MainMenu.module.css";
import MenuBtn from "../components/MenuBtn";
import Bg from "../components/Bg";

const MainMenu: React.FC = () => {
    return (
        <>
            <Bg imageId={300}>
                <div className={MainMenuCSS.mainMenu__buttons__container}>
                    <Link to={"/nickname"}>
                        <MenuBtn btnText="Hrát" />
                    </Link>
                    <Link to={"/statistics"}>
                        <MenuBtn btnText="Statistiky" />
                    </Link>
                </div>

                <Link to={"/login"}>
                    <p className={MainMenuCSS.mainMenu__adminlink}>
                        <b>Administrace</b>
                    </p>
                </Link>
            </Bg>
        </>
    );
};

export default MainMenu;
