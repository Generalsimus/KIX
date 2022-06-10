export const shallowClone = <O extends Record<any, any>>(obj: O): O => {
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    );
} 