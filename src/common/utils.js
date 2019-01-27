//取得一个整随机数，取值范围为[lowerValue,upperValue]
function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function shuffle(word, minlen) {
    let s = new Set(word);
    let wl = s.size;

    if (wl < minlen) { wl = minlen; }
    let mod = wl % 5;
    if (mod !== 0) { wl = wl + (5 - mod); }

    const vowels = ['a', 'e', 'i', 'o', 'u'];

    for (let i = 0; i < vowels.length; i++) {
        if (s.size < wl) {
            s.add(vowels[i]);
        } else {
            break;
        }
    }

    const confusions = [['c', 'k'], ['i', 'y'], ['k', 'g'], ['l', 'r'], ['m', 'n'],
     ['p', 'b'],['q', 'k'], ['r', 'l'], ['s', 'c'], ['v', 'f'], ['w', 'u'], ['ph', 'f']]

    for (let i = 0; i < confusions.length; i++) {
        if (s.size < wl) {
            if (word.indexOf(confusions[i][0]) >= 0) {
                s.add(confusions[i][1]);
            }
        } else {
            break;
        }
    }

    while (s.size < wl) {
        s.add(String.fromCharCode(randomFrom(97, 117)));
    }

    let arr = [...s];
    let len = arr.length;
    //打乱：从数组中随机取一个数，移至末尾；然后从未移动过的数中再取一个数，移至倒数第二……
    for (let i = len - 1; i > 0; i--) {
        let item = arr.splice(randomFrom(0, i), 1)
        arr.splice(i, 0, item);
    }

    return arr;
}

function countPerfect(arr, criteria) {
    let c = 0;

    for (let t of arr) {
        if ((t.status & criteria) === criteria) {
            c++;
        }
    }

    return c;
}

export { shuffle, countPerfect };