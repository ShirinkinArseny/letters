import React, {useEffect, useState} from "react";
import GameUI from "./GameUI.jsx";
import GameField from "./GameField.jsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    game: {
        background: "#EEE",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "2px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        boxSizing: "border-box",
        gap: "20px"
    },

    field: {},

    ui: {}
});

const Game = (props) => {

    const classes = useStyles();

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

    const itemsAreOffered = playerState.field.find(i => i?.state === "offered")
    const itemsArePlaced = playerState.field.find(i => i?.state === "placed")

    return <div className={classes.game}>
        <div className={classes.field}>
            <GameField
                letters={playerState.field}
                placeItem={placingItem ? (index) => {
                    setPlacingItem(undefined);
                    props.server.offerItem(props.player, placingItem.symbol, index);
                } : undefined
                }
            />
        </div>
        <div className={classes.ui}>
            <
                GameUI
                inventory={playerState.inventory}
                player={props.player}
                turn={playerState.turn.player}
                totalItems={playerState.totalItems}
                remainingItems={playerState.remainingItems}
                placingItem={placingItem}
                setPlacingItem={setPlacingItem}
                itemsAreOffered={itemsAreOffered}
                itemsArePlaced={itemsArePlaced}
                accept={() => props.server.accept(props.player)}
                refuse={() => props.server.refuse(props.player)}
                offerWord={() => {
                    props.server.offerWord(props.player);
                }}
                skip={() => props.server.skip(props.player)}
                renew={() => props.server.renew(props.player)}
                restart={(word, size) => props.server.restart(word, size)}
                rank={playerState.rank}
            />
        </div>
    </div>
};

export default Game;