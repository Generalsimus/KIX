"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = void 0;
const charToInteger = {};
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
for (let i = 0; i < chars.length; i++) {
    charToInteger[chars.charCodeAt(i)] = i;
}
function decode(mappings) {
    const decoded = [];
    let line = [];
    const segment = [
        0,
        0,
        0,
        0,
        0,
    ];
    let j = 0;
    for (let i = 0, shift = 0, value = 0; i < mappings.length; i++) {
        const c = mappings.charCodeAt(i);
        if (c === 44) {
            segmentify(line, segment, j);
            j = 0;
        }
        else if (c === 59) {
            segmentify(line, segment, j);
            j = 0;
            decoded.push(line);
            line = [];
            segment[0] = 0;
        }
        else {
            let integer = charToInteger[c];
            if (integer === undefined) {
                throw new Error('Invalid character (' + String.fromCharCode(c) + ')');
            }
            const hasContinuationBit = integer & 32;
            integer &= 31;
            value += integer << shift;
            if (hasContinuationBit) {
                shift += 5;
            }
            else {
                const shouldNegate = value & 1;
                value >>>= 1;
                if (shouldNegate) {
                    value = value === 0 ? -0x80000000 : -value;
                }
                segment[j] += value;
                j++;
                value = shift = 0;
            }
        }
    }
    segmentify(line, segment, j);
    decoded.push(line);
    return decoded;
}
exports.decode = decode;
function segmentify(line, segment, j) {
    if (j === 4)
        line.push([segment[0], segment[1], segment[2], segment[3]]);
    else if (j === 5)
        line.push([segment[0], segment[1], segment[2], segment[3], segment[4]]);
    else if (j === 1)
        line.push([segment[0]]);
}
