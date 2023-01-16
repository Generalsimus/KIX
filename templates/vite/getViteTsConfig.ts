export const getVitTsConfig = () => {
    return {
        "compilerOptions": {
            "target": "ESNext",
            "lib": ["ESNext", "DOM"],
            "jsx": "preserve",
            "module": "ESNext",
            "rootDir": "./",
            "moduleResolution": "Node",
            "resolveJsonModule": true,
            "allowJs": true,
            "checkJs": false,
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