export const getWebpackConfigContents = () => {
    return /* js */`const path = require("path");
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const { getTransformers } = require("kix/transformers");
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    // const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    
    const publicDirectory = path.join(__dirname, "public");
    const outputDirectory = path.join(__dirname, "dist");
    
    module.exports = {
      entry: {
        index: "/index.jsx",
      },
      module: {
        rules: [
          {
            test: /\.(ts|(t|j)sx)$/i,
            use: [
              {
                loader: "ts-loader",
                options: {
                  configFile: "tsconfig.json",
                  getCustomTransformers: getTransformers,
                },
              },
            ],
          },
          {
            test: /\.(s?c|sa)ss$/i,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                  // modules: true,
                  url: true,
                  import: true,
                }
              },
              "postcss-loader",
              "sass-loader",
            ]
          },
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
      },
      output: {
        filename: "[chunkhash].bundle.js",
        path: outputDirectory,
        clean: true,
        asyncChunks: true,
      },
      devServer: {
        static: publicDirectory,
        port: 2222,
        open: true,
        hot: true,
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "./index.html",
        }),
        new CopyWebpackPlugin({
          patterns: [{ from: publicDirectory, to: outputDirectory }],
        }),
      ],
    };`
}