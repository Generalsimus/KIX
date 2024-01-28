export const getWebpackPackageConfig = (kixVersion: string, tsVersion: string, appName: string) => {
    return {
        "name": appName,
        "version": "0.0.1",
        "description": "",
        "scripts": {
            "build": "webpack --mode=production",
            "dist": "webpack --mode=production",
            "start": "webpack-dev-server --mode=development",
            "serve": "webpack-dev-server --mode=development",
            "dev": "webpack-dev-server --mode=development"
        },
        "author": "",
        "license": "ISC",
        "devDependencies": {
            "@svgr/webpack": "^8.1.0",
            "copy-webpack-plugin": "^12.0.2",
            "css-loader": "^6.9.1",
            "html-webpack-plugin": "^5.6.0",
            "postcss": "^8.4.33",
            "postcss-loader": "^8.0.0",
            "sass": "^1.70.0",
            "sass-loader": "^14.0.0",
            "style-loader": "^3.3.4",
            "typescript": tsVersion,
            "webpack": "^5.89.0",
            "webpack-cli": "^5.1.4",
            "webpack-dev-server": "^4.15.1",
            "webpack-ts-load": "^0.0.8"
        },
        "dependencies": {
            "kix": kixVersion
        }
    }

}
