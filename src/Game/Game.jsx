import React, {useState} from "react";
import './Game.css';
import GameUI from "../GameUI/GameUI.jsx";
import GameTitle from "../GameTitle/GameTitle.jsx";
import GameField from "../GameField/GameField.jsx";

const Game = (props) => {
    const [inventory, setInventory] = useState()
    const [field, setField] = useState();
    props.inventory.then(e => {
        setInventory(e);
    });
    props.field.then(e => {
        setField(e);
    });
    if (!inventory || !field) return <div className="game">loading</div>;
    const letters = [
        undefined,
        undefined,
        {
            author: "Player1",
            symbol: "A",
            price: 3
        },
        undefined
    ];
    return <div className="game">
        <GameTitle title={props.player}/>
        <GameField
            letters={field}
        />
        <GameUI inventory={inventory}/>
    </div>
};

export default Game;