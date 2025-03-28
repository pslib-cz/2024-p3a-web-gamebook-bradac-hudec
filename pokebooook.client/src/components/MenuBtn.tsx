import {FC} from "react";
import MenuBtnCSS from "../styles/components/MenuBtn.module.css";


type MenuBtnProps = {
    btnText: string;
}



const MenuBtn: FC<MenuBtnProps> = ({ btnText }) => { 





    return (
            <button className={MenuBtnCSS.menu__btn}>{btnText}</button>
    );
}
export default MenuBtn;