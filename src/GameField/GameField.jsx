import React from "react";
import './GameField.css';

const GameFieldEmptyCell = (props) => {
    return <button className="game-field-cell game-field-cell_empty" onClick={() => props.placeItem()}>

    </button>
};

const GameFieldFilledCell = (props) => {
    const classname =
        props.state === "ok"
            ? "game-field-cell_ok"
            : props.state === "placed"
                ? "game-field-cell_placed"
                : "game-field-cell_offered";
    return <div className={classname + " game-field-cell"}>
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
            : <GameFieldEmptyCell key={index} placeItem={() => {
                if (props.placeItem) {
                    props.placeItem(index);
                }
            }
            }/>;
    });

    return <div className="game-field"
                style={{"--game-field-size": size}}
    >
        {lettersComponents}
    </div>

};

export default GameField;