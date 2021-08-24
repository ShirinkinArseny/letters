import React from "react";
import Game from "../Game/Game.jsx";
import Pool from "../Pool/Pool.jsx";
import createServer from "../server";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    hotSeat: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        width: "100vw",
        height: "100vh",
        gap: "10px",
        padding: "10px",
        boxSizing: "border-box"
    },
});

const HotSeat = () => {
    const classes = useStyles();
    const players = [
        "XxX-Fox-XxX",
        "SuperMe1337",
        "hi"
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
        <Pool server={server}/>
    </div>
};

export default HotSeat;