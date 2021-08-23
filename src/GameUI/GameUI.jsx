import React from "react";
import './GameUI.css';

const GameUICard = (props) => {
    return <button className="game-ui-card">
        <div className="game-ui-card__symbol">
            {props.symbol}
        </div>
        <div className="game-ui-card__price">
            {props.price}
        </div>
    </button>
}

const GameUIButton = (props) => {
    return <button className="game-ui-button">
        {props.children}
    </button>
}

const GameUI = (props) => {
    const inventory = props.inventory.map((card, idx) => {
        return <GameUICard symbol={card.symbol} price={card.price} key={"game-ui__inventory$"+idx+":"+card.symbol}/>
    });
    return <div className="game-ui">
        {inventory}
        <GameUIButton>ACCEPT</GameUIButton>
        <GameUIButton>REFUSE</GameUIButton>
        <GameUIButton>OFFER</GameUIButton>
        <GameUIButton>SKIP</GameUIButton>
        <GameUIButton>RENEW</GameUIButton>
    </div>
};

export default GameUI;