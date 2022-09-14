export const normalizeVersion = (current: string) => {
    return current.replace(/^\^+/gm, "").trim()
}