import React from "react";
import Game from "./Game.jsx";
import {makeStyles} from "@material-ui/core/styles";
import client from "../client";

const useStyles = makeStyles({
    networkGame: {
        width: "100vw",
        height: "100vh",
        padding: "10px",
        boxSizing: "border-box",
        "--coef": 1
    },
});

const NetworkGame = (props) => {
    const classes = useStyles();
    const server = client(props.room, props.player);
    return <div className={classes.networkGame}>
        <div className={classes.window} key={props.player}>
            <Game
                player={props.player}
                server={server}
            />
        </div>
    </div>
};

export default NetworkGame;