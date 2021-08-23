import React from "react";
import './GameTitle.css';

const GameTitle = (props) => {
    return <div className="game-title">
        {props.title}
    </div>
};

export default GameTitle;