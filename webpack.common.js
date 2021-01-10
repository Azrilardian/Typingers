const path = require("path");

module.exports = {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "Dist"),
		filename: "bundle.js",
	},
};
