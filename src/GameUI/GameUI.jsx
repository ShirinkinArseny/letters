import React from "react";
import './GameUI.css';

const GameUICard = (props) => {

    const classname = props.placingItem?.symbol === props.symbol
        ? "game-ui-card_selected"
        : ""

    return <button
        className={classname + " game-ui-card"}
        onClick={() => {
            const eq = props.placingItem?.symbol === props.symbol
            console.log(props.placingItem?.symbol + " $ " + props.symbol + " $ " + eq);
            if (eq) {
                props.setPlacingItem(undefined);
            } else {
                props.setPlacingItem(props);
            }
        }}
    >
        <div className="game-ui-card__symbol">
            {props.symbol}
        </div>
        <div className="game-ui-card__price">
            {props.price}
        </div>
    </button>
}

const GameUIButton = (
    props
) => {
    const onclick = props.onClick || (() => {
    });
    return <button
        className="game-ui-button"
        onClick={onclick}
    >
        {props.children}
    </button>
}

const GameUI = (props) => {

    const inventory = props.inventory.map((item, idx) => {
        return <GameUICard
            symbol={item.symbol}
            price={item.price}
            key={"game-ui__inventory$" + idx + ":" + item.symbol}
            placingItem={props.placingItem}
            setPlacingItem={(item) => {
                props.setPlacingItem(item)
            }}
        />
    });

    return <div className="game-ui">
        {inventory}
        <GameUIButton onClick={() => {
            props.setPlacingItem(undefined);
            props.accept();
        }
        }>ACCEPT</GameUIButton>
        <GameUIButton onClick={() => {
            props.setPlacingItem(undefined);
            props.refuse();
        }
        }>REFUSE</GameUIButton>
        <GameUIButton onClick={() => {
            props.setPlacingItem(undefined);
            props.offerWord();
        }}>OFFER</GameUIButton>
        <GameUIButton>SKIP</GameUIButton>
        <GameUIButton>RENEW</GameUIButton>
    </div>
};

export default GameUI;