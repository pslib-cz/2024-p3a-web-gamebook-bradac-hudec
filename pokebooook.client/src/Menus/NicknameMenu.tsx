import React, { useState } from "react";
import { Link } from "react-router-dom";
import NicknameMenuCSS from "./NicknameMenu.module.css";
import BackBtn from "../components/BackBtn";
import MenuBtn from "../components/MenuBtn";
import Bg from "../components/Bg";

const NicknameMenu: React.FC = () => {
    const [nickname, setNickname] = useState<string>("");

    const handleNicknameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNickname(event.target.value);
    };

    const handleContinueClick = () => {
        localStorage.clear(); 
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("playerPokemons", JSON.stringify([]));
        localStorage.setItem("visitedLocations", JSON.stringify([]));
    };

    return (
        <Bg imageId={300}>
            <h1 className={NicknameMenuCSS.input__container__heading}>
                Zvolte vaši přezdívku
            </h1>

            <div className={NicknameMenuCSS.input__container}>
                <input
                    type="text"
                    className={NicknameMenuCSS.nickname__input}
                    placeholder="Přezdívka"
                    value={nickname}
                    onChange={handleNicknameChange}
                />

                <div className={NicknameMenuCSS.buttons__container}>
                    <Link to="/locations/1" onClick={handleContinueClick}>
                        <MenuBtn btnText="Pokračovat" />
                    </Link>

                    <Link to="/">
                        <BackBtn btnText="Zpět" />
                    </Link>
                </div>
            </div>

            <Link to="/admin">
                <p className={NicknameMenuCSS.nicknameMenu__adminlink}>
                    <b>Administrace</b>
                </p>
            </Link>
        </Bg>
    );
};

export default NicknameMenu;
