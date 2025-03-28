import {FC} from "react";
import BackBtnCSS from "../styles/components/BackBtn.module.css";


type MenuBtnProps = {
    btnText: string;
}



const BackBtn: FC<MenuBtnProps> = ({ btnText }) => { 
    return (
            <button className={BackBtnCSS.back__btn}>{btnText}</button>
    );
}
export default BackBtn;