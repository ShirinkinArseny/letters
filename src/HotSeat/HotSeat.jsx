import React from "react";
import Game from "../Game/Game.jsx";
import Pool from "../Pool/Pool.jsx";
import './HotSeat.css';
import createServer from "../server";

const HotSeat = () => {
    const players = [
        "XxX-Fox-XxX",
        "SuperMe1337",
        "hi"
    ];
    const server = createServer(players, "philosophy", 14);
    const games = players.map((player) =>
        <div className="hot-seat__window" key={player}>
            <Game
                player={player}
                inventory={server.getPlayersInventory(player)}
                field = {server.getGameField()}
            />
        </div>
    );
    return <div className="hot-seat">
        {games}
        {<Pool queue={server.getQueue()}/>}
    </div>
};

export default HotSeat;