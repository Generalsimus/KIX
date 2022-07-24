const STRING_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const NumberToUniqueString = (i: number): string => {
    const l = STRING_CHARACTERS.length,
        p = i >= l ? NumberToUniqueString(Math.floor(i / l) - 1) : "",
        ls = STRING_CHARACTERS[i % l];
    return p + ls;
};