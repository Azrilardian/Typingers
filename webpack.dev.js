const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			template: "./index.html",
		}),
	],
});
