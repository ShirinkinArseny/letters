const client = (room, player) => {

    let playerstate;
    let newStateHandlers = [];

    const socket = new WebSocket("ws://" + window.location.hostname+":"+window.location.port + "/events");
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        playerstate = message.state;
        newStateHandlers.forEach(a => a());
    };
    socket.onopen = function () {
        socket.send(JSON.stringify({
            player: player,
            action: "join",
            room: room
        }))
    };

    return {
        getPlayerState: () => {
            return new Promise((accept) => {
                if (playerstate) {
                    accept(playerstate);
                }
            });
        },
        subscribe: (h) => {
            newStateHandlers.push(h);
        },
        offerItem: (_, symbol, index) => {
            socket.send(JSON.stringify({
                action: "offerItem",
                symbol: symbol,
                index: index
            }))
        },
        offerWord: () => {
            socket.send(JSON.stringify({
                action: "offerWord"
            }))
        },
        refuse: () => {
            socket.send(JSON.stringify({
                action: "refuse"
            }))
        },
        accept: () => {
            socket.send(JSON.stringify({
                action: "accept"
            }))
        },
        skip: () => {
            socket.send(JSON.stringify({
                action: "skip"
            }))
        },
        renew: () => {
            socket.send(JSON.stringify({
                action: "renew"
            }))
        },
        restart: (word, size) => {
            socket.send(JSON.stringify({
                action: "restart",
                word: word,
                size: size
            }))
        }
    };

}

export default client;