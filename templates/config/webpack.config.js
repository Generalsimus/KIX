const path = require("path");
// const { HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  getJsxTransformers
} = require("kix/transformers");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const publicDirectory = path.join(__dirname, "public");
const outputDirectory = path.join(__dirname, "dist");
module.exports = {
  entry: {
    index: "./index.ts",
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json",
            getCustomTransformers() {
              return getJsxTransformers()
            },
          },
        }
      ]
    }, {
      test: /\.css$/i,
      use: [{
        loader: "style-loader",
        options: {
          injectType: "styleTag"
        }
      },
      {
        loader: "css-loader",
        options: {
          modules: true,
        }
      },
      ],
    }],
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
    compress: true,
    port: 2222,
    open: true,
    hot: true,
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        vendor: {
          chunks: "async",
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
        },
        default: {
          chunks: "async",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    // Plugin for hot module replacement
    // new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: publicDirectory, to: outputDirectory }
      ]
    })
  ],
}; 