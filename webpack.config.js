const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "production",
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "Dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [miniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin(),
			new terserPlugin(),
			new htmlWebpackPlugin({
				template: "index.html",
				minify: {
					removeAttributeQuotes: true,
					removeComments: true,
					collapseWhitespace: true,
				},
			}),
		],
	},
	plugins: [
		new miniCssExtractPlugin({
			filename: "./style/css/style.css",
		}),
	],
};
