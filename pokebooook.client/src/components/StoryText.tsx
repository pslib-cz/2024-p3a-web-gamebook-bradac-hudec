import { FC } from "react";
import StoryTextCSS from "../styles/components/StoryText.module.css";

type StoryTextProps = {
    text: string;
};

const StoryText: FC<StoryTextProps> = ({ text }) => {
    return (
        <p className={StoryTextCSS.text}>
            <b>{text}</b>
        </p>
    );
};
export default StoryText;
