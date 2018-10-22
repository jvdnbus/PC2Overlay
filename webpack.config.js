var webpack = require('webpack')

module.exports = {
	entry: './app/driver.js',
	externals: {
		'jquery': '$'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'underscore-template-loader'
					}
				]
			}
		]
	},
	output: {
		path: __dirname + '/static/js',
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.ProvidePlugin({
			_: 'underscore'
		})
	],
	resolve: {
		modules: [
			__dirname + '/node_modules',
			__dirname + '/app',
			__dirname + '/app/controller',
			__dirname + '/app/view',
			__dirname + '/app/model'
		]
	},
	resolveLoader: {
		modules: [__dirname + '/node_modules']
	}
}
