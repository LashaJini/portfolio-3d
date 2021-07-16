const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const outDir = "build";
const PORT = 3000;

const config = {
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
  resolve: {
    extensions: [".js"],
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(glb|glsl|glb)$/,
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [{ from: "public", to: "" }],
      options: {
        concurrency: 100,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./views/pug/index.pug",
      inject: true,
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  if (argv.mode === "production") {
    config.output.publicPath =  "/portfolio-3d/";
  }

  return config;
};
