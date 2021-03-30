const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const terserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [miniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.(svg|png|jpg|jpeg|webp)$/,
				use: {
					loader: "file-loader",
					options: {
						publicPath: "../../img/",
						name: "[name].[ext]",
						outputPath: "img",
					},
				},
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
});
