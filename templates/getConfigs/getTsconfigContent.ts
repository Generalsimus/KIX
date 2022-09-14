export const getTsconfigContent = () => {
    return /* json */`{
    "compilerOptions": {
      "outDir": "./public/",
      "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "preserve",
      "allowJs": true,
      "moduleResolution": "node"
    }
  }`
}