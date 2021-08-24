import React from "react";
import {Button, ButtonGroup} from "@material-ui/core";

const GameUI = (props) => {

    const inventory = props.inventory
        .sort((a, b) => a.symbol.localeCompare(b.symbol))
        .map((item, idx) => {
        const eq = props.placingItem?.symbol === item.symbol
        return <Button
            disabled={props.turn !== props.player}
            key={"game-ui__inventory$" + idx + ":" + item.symbol}
            color={eq ? "secondary" : "primary"}
            onClick={() => {
                console.log(props.placingItem?.symbol + " $ " + item.symbol + " $ " + eq);
                if (eq) {
                    props.setPlacingItem(undefined);
                } else {
                    props.setPlacingItem(item);
                }
            }}
        >
            {item.symbol} ({item.price})
        </Button>
    });

    return <div className="game-ui">
        <ButtonGroup
            variant="contained"
            orientation="vertical"
        >
            {inventory}
            <Button
                disabled={!props.itemsAreOffered || props.turn === props.player}
                onClick={() => {
                    props.setPlacingItem(undefined);
                    props.accept();
                }}
            >
                ACCEPT
            </Button>
            <Button
                disabled={!props.itemsAreOffered && props.turn !== props.player}
                onClick={() => {
                    props.setPlacingItem(undefined);
                    props.refuse();
                }
                }
            >
                REFUSE
            </Button>
            <Button
                disabled={!props.itemsArePlaced || props.turn !== props.player}
                onClick={() => {
                    props.setPlacingItem(undefined);
                    props.offerWord();
                }}
            >
                OFFER
            </Button>
            <Button
                disabled={props.turn !== props.player}
                onClick={() => {
                    props.setPlacingItem(undefined);
                    props.skip();
                }}
            >
                SKIP
            </Button>
            <Button
                disabled={props.turn !== props.player}
                onClick={() => {
                    props.setPlacingItem(undefined);
                    props.renew();
                }}
            >
                RENEW
            </Button>
        </ButtonGroup>
    </div>
};

export default GameUI;