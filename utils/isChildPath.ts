import path from "path"

export const isChildPath = (parentPath: string, childPath: string): boolean => {
    // const relative = path.relative(parentPath, childPath);
    return !(path.relative(childPath, parentPath).startsWith('..'));

}