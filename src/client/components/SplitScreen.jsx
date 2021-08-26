import React from "react";
import Game from "./Game.jsx";
import createServer from "../../common/server.mjs";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    splitscreen: {
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "repeat(var(--players), 1fr)",
        width: "100vw",
        height: "100vh",
        gap: "10px",
        padding: "10px",
        boxSizing: "border-box",
        "--coef": "calc(1 / var(--players))"
    },
});

const SplitScreen = (props) => {
    const classes = useStyles();
    const server = createServer(true);
    server.restart(props.word.toLowerCase(), Number(props.size));
    props.players.forEach(p => server.join(p));
    const games = props.players.map((player) => {
        return <div className={classes.window} key={player}>
            <Game
                player={player}
                server={server}
            />
        </div>
    });
    return <div className={classes.splitscreen} style={{"--players": props.players.length}}>
        {games}
    </div>
};

export default SplitScreen;