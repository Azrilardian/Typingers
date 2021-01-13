const path = require("path");

module.exports = {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "Dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.(svg|png|jpg|jpeg)$/,
				use: {
					loader: "file-loader",
					options: {
						publicPath: (resourcePath, context) => {
							return path.relative(path.dirname(resourcePath), context) + "";
						},
						name: "[name].[ext]",
						outputPath: "img",
					},
				},
			},
		],
	},
};
