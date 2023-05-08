const digit_map = {
    '000': 'ı',
    '001': 'ᛁ',
    '010': '|',
    '011': 'ǀ',
    '100': 'I',
    '101': '᱾',
    '110': 'Ӏ',
    '111': '❘'
};
const padding = 'ӏ';

const bit_map = {};
for (let key in digit_map) {
    bit_map[digit_map[key]] = key;
}

function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds}"`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}'${remainingSeconds}"`;
  }
  

function encode(b) {
    const origlen = b.length;
    const paddings = (3 - origlen % 3) % 3;

    b = new Uint8Array([...b, ...(new Array(paddings).fill(0))]);

    // Convert bytes to list of ints
    const b_list = [].slice.call(b);

    // Convert each byte to binary string and pad with zeros
    const binary_strs = b_list.map(x => x.toString(2).padStart(8, '0'));

    // Concatenate the three binary strings into one long string
    const concatenated_str = binary_strs.join('');

    // Split the long string into 8 groups of 3 characters and get corresponding character
    const split_str = [];
    for (let i = 0; i < concatenated_str.length; i += 3) {
        split_str.push(digit_map[concatenated_str.slice(i, i + 3)]);
    }

    return '▶' + split_str.join('') + padding.repeat(paddings) + ' ' + formatTime(origlen);
}

function decode(s) {
    // Strip off the ▶ character at the beginning
    s = s.split(' ')[0].substring(1);

    const paddings = (s.match(new RegExp(padding, 'g')) || []).length;
    console.log(paddings);


    // Split the encoded string into individual characters
    const split_str = s.split('');

    // Convert each character to the corresponding binary string
    const binary_strs = [];
    for (let i = 0; i < split_str.length - paddings; i++) {
        binary_strs.push(bit_map[split_str[i]]);
    }

    // Concatenate the binary strings into one long string
    const concatenated_str = binary_strs.join('');

    // Convert the binary string back to bytes
    const b = new Uint8Array(
        Array.from({ length: (concatenated_str.length - paddings * 8) / 8 }, (_, i) => parseInt(concatenated_str.slice(i * 8, (i + 1) * 8), 2))
    );

    return b;
}