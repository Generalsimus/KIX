export const getVitTsConfig = () => {
    return {
        "compilerOptions": {
            "target": "ESNext",
            "useDefineForClassFields": true,
            "module": "ESNext",
            "lib": ["ESNext", "DOM"],
            "outDir": "dist",
            "moduleResolution": "Node",
            "strict": true,
            "resolveJsonModule": true,
            "isolatedModules": true,
            "esModuleInterop": true,
            "noEmit": false,
            "jsx": "preserve",
            "allowJs": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noImplicitReturns": true,
            "skipLibCheck": true,
            "declaration": true,
            "declarationMap": false
        },
        "include": ["src"]
    }
}