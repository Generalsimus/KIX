export const getTsconfigContent = () => {
  return /* json */`
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "commonjs",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "target": "ES2018",
    "jsx": "preserve",
    "allowJs": true,
    "moduleResolution": "node"
  },
  "exclude": ["webpack.config.js"]
}

    `
}