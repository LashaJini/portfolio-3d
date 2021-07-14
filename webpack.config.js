const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = (env, argv) => {
  const outDir = "build";
  const PORT = 3000;

  return {
    entry: "./index",
    output: {
      path: path.join(__dirname, outDir),
      // filename: "[name].[chunkhash].bundle.js",
      filename: "[name].bundle.js",
    },
    devServer: {
      // contentBase: path.join(__dirname, outDir),
      contentBase: path.join(__dirname, "/public/"),
      port: PORT,
      compress: true,
    },
    devtool: "source-map",
    resolve: {
      extensions: [".js"],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.pug$/,
          use: ["pug-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|glb|gltf)$/,
          use: ["file-loader"],
        },
        {
          test: /\.(glsl)$/,
          use: ["raw-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./views/pug/index.pug",
        inject: true,
      }),
    ],
  };
};

module.exports = config;
