export const getWebpackTsConfig = () => {
    return {
        "compilerOptions": {
            "outDir": "./dist/",
            "noImplicitAny": true,
            "module": "commonjs",
            "resolveJsonModule": true,
            "esModuleInterop": true,
            "target": "ES2017",
            "jsx": "preserve",
            "allowJs": true,
            "moduleResolution": "node"
        },
        "exclude": ["webpack.config.js", "./dist"]
    }

}