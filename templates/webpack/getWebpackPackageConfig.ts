export const getWebpackPackageConfig = (kixVersion: string, tsVersion: string, appName: string) => {
    return {
        name: appName,
        version: "0.0.1",
        description: "",
        scripts: {
            "build": "webpack --mode=production",
            "dist": "webpack --mode=production",
            "start": "webpack-dev-server --mode=development",
            "serve": "webpack-dev-server --mode=development",
            "dev": "webpack-dev-server --mode=development"
        },
        author: "",
        license: "ISC",
        devDependencies: {
            "copy-webpack-plugin": "^11.0.0",
            "css-loader": "^6.7.1",
            "html-webpack-plugin": "^5.5.0",
            "postcss": "^8.4.16",
            "postcss-loader": "^7.0.1",
            "sass": "^1.54.9",
            "sass-loader": "^13.0.2",
            "style-loader": "^3.3.1",
            "ts-loader": "^9.3.1",
            "typescript": tsVersion,
            "webpack": "^5.74.0",
            "webpack-cli": "^4.10.0",
            "webpack-dev-server": "^4.11.0",
            "fork-ts-checker-webpack-plugin": "^7.2.13"
        },
        dependencies: {
            kix: kixVersion
        }
    }
}
