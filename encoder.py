digit_map = {
    '000': 'ı',
    '001': 'ᛁ',
    '010': '|',
    '011': 'ǀ',
    '100': 'I',
    '101': '᱾',
    '110': 'Ӏ',
    '111': '❘'
}
padding = 'ӏ'

def format_time(seconds):
    if seconds < 60:
        return f"{seconds}\""
    
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    return f"{minutes}'{remaining_seconds}\""


bit_map = {v: k for k, v in digit_map.items()}


def encode(b):
    origlen = len(b)
    paddings = -origlen % 3

    b += bytes(paddings)

    # Convert bytes to list of ints
    b_list = [int(x) for x in b]

    # Convert each byte to binary string and pad with zeros
    binary_strs = [bin(x)[2:].zfill(8) for x in b_list]

    # Concatenate the three binary strings into one long string
    concatenated_str = ''.join(binary_strs)

    # Split the long string into 8 groups of 3 characters and get corrosponding character
    split_str = [
        digit_map[concatenated_str[i:i + 3]]
        for i in range(0, len(concatenated_str), 3)
    ]

    return "▶" + ''.join(split_str) + padding * paddings + " " + str(
        origlen) + '"'


def decode(s):
    # Strip off the ▶ character at the beginning
    s = s.split(' ')[0][1:]

    paddings = s[-2:].count(padding)

    # Split the encoded string into characters
    split_str = [s[i] for i in range(0, len(s)- paddings)]

    # Convert each group of 4 characters to binary string
    binary_strs = [bit_map[x] for x in split_str]

    # Concatenate the binary strings into one long string
    concatenated_str = ''.join(binary_strs)

    # Convert the binary string back to bytes
    b = bytearray(
        int(concatenated_str[i:i + 8], 2)
        for i in range(0,
                       len(concatenated_str) - 8 *paddings, 8))

    return bytes(b)

if __name__ == '__main__':
    original = '12345'.encode('utf-8')
    b = encode(original)

    print(b)

    print(decode(b))
    decoded = decode(b).decode('utf-8')
    print(decoded)