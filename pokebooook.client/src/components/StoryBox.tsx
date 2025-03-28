import React from 'react';
import StoryBoxCSS from "../styles/components/StoryBox.module.css";

type StoryBoxProps = {
    children: React.ReactNode;
    showContinueText?: boolean;
    onClick?: () => void;
};

const StoryBox: React.FC<StoryBoxProps> = ({ children, showContinueText = true, onClick }) => {
    return (
        <div className={StoryBoxCSS.actionBox__container} onClick={onClick}>
            {children}
            {showContinueText && <div className={StoryBoxCSS.clickToContinue}>Klikněte pro pokračování</div>}
        </div>
    );
};

export default StoryBox;