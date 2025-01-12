import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NicknameMenuCSS from "./NicknameMenu.module.css";

const NicknameMenu = () => {
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
      className={NicknameMenuCSS.nicknameMenu__container}
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : "none",
      }}
    >
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
            <button className={NicknameMenuCSS.nicknameMenu__btn}>
              <b>Pokračovat</b>
            </button>
          </Link>
          <Link to={"/"}>
            <button className={NicknameMenuCSS.nicknameMenu__btn}>
              <b>Zpět</b>
            </button>
          </Link>
        </div>
      </div>

      <Link to={"/admin"}>
        <p className={NicknameMenuCSS.nicknameMenu__adminlink}>
          <b>Administrace</b>
        </p>
      </Link>
    </div>
  );
};
export default NicknameMenu;
