
import packageJson from "../../package.json";

export const getConfigJson = (projectName: string) => {
    return {
        tsConfig: {
            "compilerOptions": {
                "target": "es2016",
                "jsx": "preserve",
                "module": "commonjs",
                "moduleResolution": "node",
                "outDir": "./dist",
                "allowJs": true,
                "esModuleInterop": true,
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "skipLibCheck": true
            }
        },
        packageJson: {
            "name": projectName,
            "version": "1.0.0",
            "private": true,
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1",
                "dev": "kix start",
                "start": "kix start",
                "build": "kix build"
            },
            "repository": {
                "type": "git",
                "url": "git+https://github.com/Generalsimus/KIX.git"
            },
            "bugs": {
                "url": "https://github.com/Generalsimus/KIX/issues"
            },
            "homepage": "https://github.com/Generalsimus/KIX#readme",
            "devDependencies": {
                "kix": packageJson.version + ""
            },
            "dependencies": {}
        }
    }
} 