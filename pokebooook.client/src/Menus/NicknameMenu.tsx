import { Link } from "react-router-dom";
import NicknameMenuCSS from "./NicknameMenu.module.css";
import BackBtn from "../components/BackBtn";
import MenuBtn from "../components/MenuBtn";
import MenuBg from "../components/MenuBg";

const NicknameMenu = () => {
  return (    
      <MenuBg>
        <h1 className={NicknameMenuCSS.input__container__heading}>
          Zvolte vaši přezdívku
        </h1>

        <div className={NicknameMenuCSS.input__container}>
          <input
            type="text"
            className={NicknameMenuCSS.nickname__input}
            placeholder="Přezdívka"
          />

          <div className={NicknameMenuCSS.buttons__container}>
            <Link to={"/locations/1"}>
              <MenuBtn btnText="Pokračovat" />
            </Link>

            <Link to={"/"}>
              <BackBtn btnText="Zpět" />
            </Link>
          </div>
        </div>

        <Link to={"/admin"}>
          <p className={NicknameMenuCSS.nicknameMenu__adminlink}>
            <b>Administrace</b>
          </p>
        </Link>
      </MenuBg>   
  );
};
export default NicknameMenu;
