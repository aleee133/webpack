const path = require("path");
const fs = require("fs");
const webpack = require("../../../../");

/** @type {(number, any) => import("../../../../").Configuration} */
const common = (i, options) => ({
	output: {
		filename: `${i}/[name].js`,
		chunkFilename: `${i}/[name].js`,
		cssFilename: `${i}/[name].css`,
		cssChunkFilename: `${i}/[name].css`,
		assetModuleFilename: `${i}/[hash][ext][query]`
	},
	module: {
		rules: [
			{
				test: /\.png$/,
				type: "asset"
			}
		]
	},
	experiments: {
		css: true
	},
	plugins: [
		{
			apply(compiler) {
				compiler.hooks.compilation.tap("Test", compilation => {
					compilation.hooks.processAssets.tap(
						{
							name: "copy-webpack-plugin",
							stage:
								compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
						},
						() => {
							const data = fs.readFileSync(
								path.resolve(__dirname, "./test.js")
							);

							compilation.emitAsset(
								"test.js",
								new webpack.sources.RawSource(data)
							);
						}
					);
				});
			}
		}
	],
	...options
});

/** @type {import("../../../../").Configuration[]} */
module.exports = [
	common(0, {
		entry: "../_images/file.png"
	}),
	common(1, {
		entry: {
			"asset-entry": {
				import: "../_images/file.png"
			},
			"js-entry": {
				import: "./entry.js"
			}
		}
	}),
	common(2, {
		entry: {
			"asset-entry": {
				import: "../_images/file.png"
			},
			"css-entry": {
				import: "./entry.css"
			}
		}
	}),
	common(3, {
		entry: {
			"asset-entry": {
				import: "../_images/file.png"
			},
			"js-entry": {
				import: "./entry.js"
			},
			"css-entry": {
				import: "./entry.css"
			}
		}
	})
];
