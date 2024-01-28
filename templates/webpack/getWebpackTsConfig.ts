export const getWebpackTsConfig = () => {
    return {
        "compilerOptions": {
            "target": "ES2018",
            "lib": ["ES2018", "DOM"],
            "jsx": "preserve",
            "module": "CommonJS",
            "rootDir": "./",
            "resolveJsonModule": true,
            "allowJs": true,
            "checkJs": false,
            "outDir": "./dist", 
            "noEmit": false,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "strict": true
        },
        "include": ["src", "module.d.ts"],
        "exclude": ["./dist"]
    }


}