const hash = (string, range) => {

    let counter = 0;
    const limit = Math.pow(2, 16);

    for (let i = 0; i < string.length; i++) {
        counter *= 31;
        const code = string.charCodeAt(i);
        counter += code;
        if (counter >= limit) {
            counter %= limit;
        }
    }

    return counter % range;

};

const colorHash = (string) => {
    const h = hash(string, 16);
    return "hsl(" + h * 360 / 16 + ", 50%, 50%)"
}


export default colorHash;