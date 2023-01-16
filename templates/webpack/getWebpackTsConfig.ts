export const getWebpackTsConfig = () => {
    return {
        "compilerOptions": {
            "target": "ES2018",
            "lib": ["ES2018", "DOM"],
            "jsx": "preserve",
            "module": "commonjs",
            "rootDir": "./",
            "moduleResolution": "Node",
            "resolveJsonModule": true,
            "allowJs": true,
            "checkJs": false,
            "declaration": true,
            "declarationMap": false,
            "outDir": "./dist",
            "noEmit": false,
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true,
            "types": ["node"]
        },
        "include": ["src", "module.d.ts"],
        "exclude": ["./dist"]
    }


}