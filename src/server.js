function randomInRange(from, to) {
    const r = Math.random();
    const diff = to - from + 1;
    const v = from + diff * r;
    const vi = Math.floor(v);
    if (vi < from || vi > to) {
        throw new Error("Sadly, but randomInRange is broken")
    }
    return vi;
}

function shuffle(array) {
    const copy = [...array];

    function swap(a, b) {
        if (a === b) return;
        const tmp = copy[a];
        copy[a] = copy[b];
        copy[b] = tmp;
    }

    const shuffleAgressiveness = 4;
    for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < shuffleAgressiveness; j++) {
            const a = randomInRange(0, copy.length - 1);
            const b = randomInRange(0, copy.length - 1);
            swap(a, b);
        }
    }
    return copy;
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

function xyToIdx(x, y, size) {
    return y * size + x;
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
        const i = xyToIdx(x, y, size);
        item.state = "ok";
        gamefield[i] = item;
    });
    return gamefield;
}

function createServer(players, initialWord, size) {

    const data = createLettersData(initialWord);


    const field = createGameField(size, data.fields);

    const queue = shuffle(data.queue);
    const invokeOnChange = [];

    function peekLetter() {
        return queue.shift();
    }

    const inventories = {};
    const initialInventorySize = 7;
    players.forEach(p => {
        const v = [];
        inventories[p] = v;
        for (let i = 0; i < initialInventorySize; i++) {
            const item = peekLetter();
            item.author = p;
            v.push(item);
        }
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
                resolve(value);
            });
        });
    }

    function toggleChange() {
        invokeOnChange.forEach(c => c());
    }

    function offerItem(
        player,
        symbol,
        index
    ) {
        if (index < 0 || index > size * size) {
            throw new Error("Cell " + index + " is out of field");
        }
        const playerInventoryIndex = inventories[player].findIndex(e => e.symbol === symbol);
        if (playerInventoryIndex === -1) {
            throw new Error("Player " + player + " has no letter " + symbol + " in inventory")
        }
        const item = inventories[player].splice(playerInventoryIndex, 1)[0];
        if (field[index]) {
            throw new Error("Cell " + index + " is already taken")
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
                    throw new Error("Word is offered not by player " + player);
                }
                field[i].state = "offered";
            }
        }
        accepts = {};
        acceptsRemaining = players.length;
        toggleChange();
    }

    function acceptVoted() {
        for (let i = 0; i < size * size; i++) {
            if (field[i]?.state === "offered") {
                field[i].state = "ok";
                const newItem = peekLetter();
                newItem.author = field[i].author;
                inventories[field[i].author].push(newItem);
            }
        }
        toggleChange();
    }

    function refuseVoted() {
        for (let i = 0; i < size * size; i++) {
            if (field[i]?.state === "offered") {
                const refund = field[i];
                field[i] = undefined;
                inventories[refund.author].push(refund);
            }
        }
        toggleChange();
    }

    function accept(player) {
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

    return {
        getQueue: () => {
            return delayed(queue);
        },
        getPlayerState: (player) => {
            return delayed({
                "inventory": inventories[player],
                "field": field
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
        }
    }

}

export default createServer;