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
			{
				test: /\.(svg|png|jpg|jpeg|webp)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "[name].[ext]",
						outputPath: "img",
					},
				},
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			template: "./index.html",
		}),
	],
});
