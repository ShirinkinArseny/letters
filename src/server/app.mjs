import express from 'express';
import path from 'path';
import http from "http";

import {WebSocketServer} from "ws";
import createServer from "../common/server.mjs";


const __dirname = path.resolve();
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('build'));

const port = 8000;
console.log("running server at http://localhost:" + port)
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({server});

const rooms = [];
const roomListeners = [];

webSocketServer.on('connection', ws => {

    let player = "";
    let room = "";
    let game = undefined;

    function send({socket, player}) {
        rooms[room]?.getPlayerState(player)?.then(state => {
            const message = JSON.stringify({
                "state": state
            });
            socket.send(message);
        });
    }

    ws.on('message', bodyRaw => {
        const body = JSON.parse(bodyRaw);
        let l = roomListeners[room || body.room] || [];
        roomListeners[room || body.room] = l;
        if (body.action === "join") {
            player = body.player;
            room = body.room;
            game = rooms[body.room] || createServer(
                "",
                14,
                true
            );
            game.join(body.player);
            if (!rooms[room]) {
                rooms[room] = game;
            }
            l.push({
                "socket": ws,
                "player": player
            });
        } else if (body.action === "offerItem") {
            game.offerItem(player, body.symbol, body.index);
        } else if (body.action === "offerWord") {
            game.offerWord(player);
        } else if (body.action === "refuse") {
            game.refuse(player);
        } else if (body.action === "accept") {
            game.accept(player);
        } else if (body.action === "skip") {
            game.skip(player);
        } else if (body.action === "renew") {
            game.renew(player);
        }else if (body.action === "restart") {
            game.restart(body.word, body.size);
        }
        l.forEach(send);
    });

    ws.on("error", e => {
        const r = roomListeners[room];
        if (!r) return;
        let index = r.find(l => l === ws)
        r.splice(index, 1);
        l.forEach(send);
    });
});

server.listen(port, () => console.log("Server started"))