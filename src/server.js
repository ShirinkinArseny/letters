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
        gamefield[xyToIdx(x, y, size)] = item;
    });
    return gamefield;
}

function createServer(players, initialWord, size) {

    const data = createLettersData(initialWord);


    const field = createGameField(size, data.fields);

    const queue = shuffle(data.queue);

    function peekLetter() {
        return queue.shift();
    }

    const inventories = {};
    const initialInventorySize = 7;
    players.forEach(p => {
        const v = [];
        inventories[p] = v;
        for (let i = 0; i < initialInventorySize; i++) {
            v.push(peekLetter());
        }
        return v;
    });


    function delayed(value) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(value);
            }, randomInRange(50, 500));
        });
    }

    return {
        getQueue: () => {
            return delayed(queue);
        },
        getPlayersInventory: (player) => {
            return delayed(inventories[player]);
        },
        getGameField: () => {
            return delayed(field);
        }
    }

}

export default createServer;