export const deepAssign = <T extends object, S extends Object>(target: T, ...sources: S[]): T & S => {

    for (const source of (sources as any)) {
        for (const key of [...Object.keys(target), ...Object.keys(source)]) {
            const currSource = source[key]
            const currTarget = (target as any)[key]
            if (Array.isArray(currSource) && Array.isArray(currTarget)) {
                (target as any)[key] = [...new Set([...currTarget, ...currSource])]
            } else if (typeof currSource === 'object' && typeof currTarget === 'object') {
                (target as any)[key] = deepAssign(currTarget, currSource);
            } else if (currSource) {
                (target as any)[key] = currSource;
            }

        }
    }

    return target as T & S
}