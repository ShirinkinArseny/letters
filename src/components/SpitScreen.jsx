import React from "react";
import Game from "./Game.jsx";
import createServer from "../server";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    hotSeat: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoRows: "1fr",
        width: "100vw",
        height: "100vh",
        gap: "10px",
        padding: "10px",
        boxSizing: "border-box"
    },
});

const SpitScreen = () => {
    const classes = useStyles();
    const players = [
        "fork27",
        "NamelessWobs"
    ];
    const server = createServer(players, "philosophy", 14, true);
    const games = players.map((player) => {
        return <div className="hot-seat__window" key={player}>
            <Game
                player={player}
                server={server}
            />
        </div>
    });
    return <div className={classes.hotSeat}>
        {games}
    </div>
};

export default SpitScreen;