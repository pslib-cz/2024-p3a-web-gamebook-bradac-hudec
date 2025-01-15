import { FC } from "react";
import ActionBoxCSS from './StoryBox.module.css';

type ActionBoxProps = {
    children: React.ReactNode;
    onClick?: () => void;
    showContinueText?: boolean;
};

const ActionBox: FC<ActionBoxProps> = ({ children, onClick, showContinueText = true }) => {
    return (
        <div onClick={onClick} className={ActionBoxCSS.actionBox__container}>
            {children}
            {showContinueText && (
                <div className={ActionBoxCSS.clickToContinue}><b>klikněte pro pokračování...</b></div>
            )}
        </div>
    );
};

export default ActionBox;