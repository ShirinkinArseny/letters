import React from "react";
import './GameField.css';

const GameFieldEmptyCell = () => {
    return <div className="game-field-cell game-field-cell_empty">

    </div>
};

const GameFieldFilledCell = (props) => {
    console.log(props);
    return <div className="game-field-cell game-field-cell_filled">
        <div className="game-field-cell__author">
            {props.author}
        </div>
        <div className="game-field-cell__symbol">
            {props.symbol}
        </div>
        <div className="game-field-cell__price">
            {props.price}
        </div>
    </div>
};

const GameField = (props) => {

    const size = Math.round(Math.sqrt(props.letters.length));

    const lettersComponents = props.letters.map((letter, index) => {
        return letter
            ? <GameFieldFilledCell key={index} {...letter}/>
            : <GameFieldEmptyCell key={index}/>;
    });

    return <div className="game-field"
                style={{ "--game-field-size": size }}
    >
        {lettersComponents}
    </div>

};

export default GameField;