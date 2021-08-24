function randomInRange(from, to) {
    const r = Math.random();
    const diff = to - from + 1;
    const v = from + diff * r;
    const vi = Math.floor(v);
    return vi;
}

const alphabet = [
    ['A', 9, 1],
    ['B', 2, 3],
    ['C', 2, 3],
    ['D', 4, 2],
    ['E', 12, 1],
    ['F', 2, 4],
    ['G', 3, 2],
    ['H', 2, 4],
    ['I', 9, 1],
    ['J', 1, 8],
    ['K', 1, 5],
    ['L', 4, 1],
    ['M', 2, 3],
    ['N', 6, 1],
    ['O', 8, 1],
    ['P', 2, 3],
    ['Q', 1, 10],
    ['R', 6, 1],
    ['S', 4, 1],
    ['T', 6, 1],
    ['U', 4, 1],
    ['V', 2, 4],
    ['W', 2, 4],
    ['X', 1, 8],
    ['Y', 2, 4],
    ['Z', 1, 10],
    ['*', 2, 0],
]
const letterToIndex = {};
alphabet.forEach((l, idx) => {
    letterToIndex[l[0]] = idx;
});


function createLettersData(
    initialWord
) {
    const alphabetCopy = [...alphabet.map(e => [...e])];
    const initialWordFields = [];
    initialWord.toUpperCase().split("").forEach(w => {
        const idx = letterToIndex[w];
        alphabetCopy[idx][1]--;
        initialWordFields.push({
            "symbol": w,
            "price": alphabetCopy[idx][2]
        })
        if (alphabetCopy[idx][1] < 0) {
            throw new Error("This word contains more letters " + w + " that allowed in alphabet")
        }
    });
    return {
        queue: alphabetCopy.map(l => {
            const a = [];
            for (let i = 0; i < l[1]; i++) {
                a.push({
                    "symbol": l[0].toUpperCase(),
                    "price": l[2]
                });
            }
            return a;
        }).flat(),
        fields: initialWordFields
    };
}

function createGameField(size, initialItems) {
    const gamefield = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            gamefield.push(undefined);
        }
    }
    const offset = Math.floor(size / 2 - initialItems.length / 2)
    const y = Math.round(size / 2);
    initialItems.forEach((item, idx) => {
        const x = offset + idx;
        const i = y * size + x;
        item.state = "ok";
        gamefield[i] = item;
    });
    return gamefield;
}

function createServer(
    players,
    initialWord,
    size,
    forgiveMistakes
) {

    const data = createLettersData(initialWord);

    let turn = 0;

    function getCurrentTurnPlayer() {
        return players[turn % players.length];
    }

    const field = createGameField(size, data.fields);

    const queue = data.queue;
    const invokeOnChange = [];

    function pickLetter() {
        const idx = randomInRange(0, queue.length - 1);
        return queue.splice(idx, 1)[0];
    }

    function pickNewInventoryItems(player) {
        for (let i = 0; i < initialInventorySize && queue.length > 0; i++) {
            const item = pickLetter();
            item.author = player;
            inventories[player].push(item);
        }
    }

    const inventories = {};
    const rank = {};
    const initialInventorySize = 7;
    players.forEach(p => {
        rank[p] = 0;
        const v = [];
        inventories[p] = v;
        pickNewInventoryItems(p);
        return v;
    });


    function delay(action) {
        setTimeout(() => {
            action();
        }, randomInRange(50, 500));
    }

    function delayed(value) {
        return new Promise((resolve) => {
            delay(() => {
                resolve(value());
            });
        });
    }

    function toggleChange() {
        invokeOnChange.forEach(c => c());
    }

    function error(text) {
        if (forgiveMistakes) {
            return true;
        }
        throw new Error(text);
    }

    function offerItem(
        player,
        symbol,
        index
    ) {
        if (player !== getCurrentTurnPlayer()) {
            return error("Player " + player + " is not allowed to offer items, turn is for " + getCurrentTurnPlayer());
        }
        if (index < 0 || index > size * size) {
            return error("Cell " + index + " is out of field");
        }
        const playerInventoryIndex = inventories[player].findIndex(e => e.symbol === symbol);
        if (playerInventoryIndex === -1) {
            return error("Player " + player + " has no letter " + symbol + " in inventory")
        }
        const item = inventories[player].splice(playerInventoryIndex, 1)[0];
        if (field[index]) {
            return error("Cell " + index + " is already taken")
        }
        item.state = "placed";
        field[index] = item;
        toggleChange();
    }

    let accepts = {};
    let acceptsRemaining = 0;

    function offerWord(player) {
        for (let i = 0; i < size * size; i++) {
            if (field[i]?.state === "placed") {
                if (field[i].author !== player) {
                    return error("Word is offered not by player " + player);
                }
                field[i].state = "offered";
            }
        }
        accepts = {};
        acceptsRemaining = players.length - 1;
        toggleChange();
    }


    function findWords() {
        function wordsThatContainThisLetterDXDY(x, y, dx, dy) {

            function over(x, y) {
                return x < 0 || x >= size || y < 0 || y >= size;
            }

            function pass(x, y, dx, dy) {
                let [xs, ys] = [x, y];
                const word = [];
                while (true) {
                    xs += dx;
                    ys += dy;
                    if (over(xs, ys)) {
                        break;
                    }
                    if (!field[xs + ys * size]) break
                    word.push([xs, ys])
                }
                return word;
            }

            const start = pass(x, y, dx, dy);
            const end = pass(x, y, -dx, -dy);
            const word = start.reverse().concat([[x, y]]).concat(end)
            if (word.length > 1) return [word.map(c => c[0] + c[1] * size)];
            return [];
        }

        function wordsThatContainThisLetterH(x, y) {
            return wordsThatContainThisLetterDXDY(x, y, -1, 0);
        }

        function wordsThatContainThisLetterV(x, y) {
            return wordsThatContainThisLetterDXDY(x, y, 0, -1);
        }

        function wordsThatContainThisLetter(idx) {
            const x = idx % size;
            const y = Math.floor(idx / size);
            return wordsThatContainThisLetterH(x, y)
                .concat(wordsThatContainThisLetterV(x, y));
        }

        function arraysAreIdentical(a, b) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }


        const uniqueWords = [];

        field
            .map((i, idx) => i?.state === "offered" ? idx : undefined)
            .filter(i => i !== undefined)
            .map(i => wordsThatContainThisLetter(i))
            .reduce((a, b) => a.concat(b), [])
            .forEach(word => {
                for (let i = 0; i < uniqueWords.length; i++) {
                    if (arraysAreIdentical(word, uniqueWords[i])) return;
                }
                uniqueWords.push(word);
            });

        uniqueWords.forEach(w => {
            rank[getCurrentTurnPlayer()] += w.map(idx => field[idx].price).reduce((a, b) => a + b, 0);
        });
    }

    function acceptVoted() {
        findWords();
        for (let i = 0; i < size * size; i++) {
            if (field[i]?.state === "offered") {
                field[i].state = "ok";
                const newItem = pickLetter();
                newItem.author = field[i].author;
                inventories[field[i].author].push(newItem);
            }
        }
        turn++;
        toggleChange();
    }

    function refuseVoted() {
        for (let i = 0; i < size * size; i++) {
            const state = field[i]?.state;
            if (state === "offered" || state === "placed") {
                const refund = field[i];
                field[i] = undefined;
                inventories[refund.author].push(refund);
            }
        }
        toggleChange();
    }


    function accept(player) {
        if (player === getCurrentTurnPlayer()) {
            return error("Player " + player + " is not allowed to vote for own word")
        }
        if (!accepts[player]) {
            acceptsRemaining--;
        }
        accepts[player] = 1;
        if (acceptsRemaining === 0) {
            acceptVoted();
        }
    }

    function refuse(player) {
        refuseVoted();
    }

    function skip(player) {
        const currentPlayer = getCurrentTurnPlayer();
        if (currentPlayer !== player) {
            return error("Player " + player + " is not allowed to skip, current player is " + currentPlayer);
        }
        turn++;
        toggleChange();
    }

    function renew(player) {
        const currentPlayer = getCurrentTurnPlayer();
        if (currentPlayer !== player) {
            return error("Player " + player + " is not allowed to renew, current player is " + currentPlayer);
        }
        for (let i = 0; i < inventories[player].length; i++) {
            queue.push(inventories[player][i]);
        }
        inventories[player] = [];
        pickNewInventoryItems(player);
        turn++;
        toggleChange();
    }

    return {
        getQueue: () => {
            return delayed(() => {
                return queue;
            });
        },
        getPlayerState: (player) => {
            return delayed(() => {
                return {
                    "inventory": inventories[player],
                    "field": field,
                    "poolRemaining": queue.length,
                    "turn": {
                        "player": getCurrentTurnPlayer(),
                        "number": turn
                    },
                    "rank": rank
                }
            });
        },
        offerItem: (player, symbol, index) => {
            delay(() => {
                offerItem(player, symbol, index);
            });
        },
        offerWord: (player) => {
            delay(() => {
                offerWord(player);
            });
        },
        subscribe: (callback) => {
            invokeOnChange.push(callback);
        },
        refuse: (player) => {
            refuse(player);
        },
        accept: (player) => {
            accept(player);
        },
        skip: (player) => {
            skip(player);
        },
        renew: (player) => {
            renew(player);
        }
    }

}

export default createServer;