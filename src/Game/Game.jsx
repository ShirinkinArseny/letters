import React, {useEffect, useState} from "react";
import './Game.css';
import GameUI from "../GameUI/GameUI.jsx";
import GameTitle from "../GameTitle/GameTitle.jsx";
import GameField from "../GameField/GameField.jsx";

const Game = (props) => {
    console.log("Render game for " + props.player);
    const [playerState, setPlayerState] = useState()
    const [placingItem, setPlacingItem] = useState()

    function loadState() {
        props.server.getPlayerState(props.player).then(e => {
            setPlayerState(e);
        });
    }

    useEffect(() => {
        loadState();
        props.server.subscribe(() => {
            loadState();
        });
    }, [props.player]);
    if (!playerState) return <div className="game">loading</div>;
    return <div className="game">
        <GameTitle title={props.player}/>
        <GameField
            letters={playerState.field}
            placeItem={placingItem ? (index) => {
                props.server.offerItem(props.player, placingItem.symbol, index);
            } : undefined
            }
        />
        <
            GameUI
            inventory={playerState.inventory}
            placingItem={placingItem}
            setPlacingItem={setPlacingItem}
            accept={() => props.server.accept(props.player)}
            refuse={() => props.server.refuse(props.player)}
            offerWord={() => {
                props.server.offerWord(props.player);
            }}
        />
    </div>
};

export default Game;